<?php

namespace App\Http\Controllers;

use App\Models\Evaluacion;
use App\Services\EvaluacionWordService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class EvaluacionController extends Controller
{
    public function index()
    {
        $evaluaciones = Auth::user()
            ->evaluaciones()
            ->withCount('areas')
            ->withCount([
                'aplicaciones as aplicaciones_completadas_count' => function ($query) {
                    $query->where('estado', 'completada');
                },
                'aplicaciones as aplicaciones_count',
            ])
            ->orderByDesc('id')
            ->paginate(15);

        return view('gestion.evaluaciones.index', compact('evaluaciones'));
    }

    public function create(): View
    {
        return view('gestion.evaluacion-crear', [
            'evaluacion' => null,
            'areasIniciales' => [],
        ]);
    }

    public function store(Request $request)
    {
        $datos = $this->validarEvaluacion($request);

        $evaluacion = DB::transaction(function () use ($datos) {
            $evaluacion = Auth::user()->evaluaciones()->create([
                'nombre' => $datos['nombre'],
                'tipo_evaluacion' => $datos['tipo_evaluacion'],
                'proyecto' => $datos['proyecto'] ?? null,
                'docente' => $datos['docente'] ?? null,
                'fecha_inicio' => $datos['fecha_inicio'],
                'fecha_fin' => $datos['fecha_fin'],
                'estado' => $datos['estado'] ?? 'activa',
            ]);

            $this->sincronizarAreas($evaluacion, $datos['areas']);

            return $evaluacion;
        });

        return redirect()
            ->route('evaluaciones.show', $evaluacion)
            ->with('status', 'Evaluación creada correctamente.');
    }

    public function edit(int $id)
    {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->with(['areas.subareas' => function ($query) {
                $query->withCount('resultados');
            }])
            ->findOrFail($id);

        if (! $evaluacion->puedeEditarse()) {
            return redirect()
                ->route('evaluaciones.show', $evaluacion)
                ->with('error', 'No se puede editar una evaluación archivada.');
        }

        $areasIniciales = $evaluacion->areas
            ->map(function ($area) {
                return [
                    'id' => $area->id,
                    'nombre' => $area->nombre,
                    'subareas' => $area->subareas
                        ->map(function ($subarea) {
                            return [
                                'id' => $subarea->id,
                                'nombre' => $subarea->nombre,
                                'tiene_resultados' => (int) $subarea->resultados_count > 0,
                            ];
                        })
                        ->values(),
                ];
            })
            ->values();

        return view(
            'gestion.evaluacion-crear',
            compact('evaluacion', 'areasIniciales')
        );
    }

    public function update(Request $request, int $id)
    {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->findOrFail($id);

        if (! $evaluacion->puedeEditarse()) {
            return redirect()
                ->route('evaluaciones.show', $evaluacion)
                ->with('error', 'No se puede editar una evaluación archivada.');
        }

        $datos = $this->validarEvaluacion($request);

        $resultadoSincronizacion = DB::transaction(function () use ($evaluacion, $datos) {
            $evaluacion->update([
                'nombre' => $datos['nombre'],
                'tipo_evaluacion' => $datos['tipo_evaluacion'],
                'proyecto' => $datos['proyecto'] ?? null,
                'docente' => $datos['docente'] ?? null,
                'fecha_inicio' => $datos['fecha_inicio'],
                'fecha_fin' => $datos['fecha_fin'],
            ]);

            $resultado = $this->sincronizarAreas($evaluacion, $datos['areas']);

            $resultado['aplicacionesReabiertas'] =
                $evaluacion->reabrirAplicacionesIncompletas();

            return $resultado;
        });

        $mensaje = 'Evaluación actualizada correctamente.';

        if ($resultadoSincronizacion['nuevasSubareas'] > 0) {
            $mensaje .= ' Se agregaron '.$resultadoSincronizacion['nuevasSubareas']
                .' subárea(s).';
        }

        if ($resultadoSincronizacion['aplicacionesReabiertas'] > 0) {
            $mensaje .= ' Se reabrieron '
                .$resultadoSincronizacion['aplicacionesReabiertas']
                .' evaluación(es) de estudiantes para puntuar las subáreas nuevas.';
        }

        if ($resultadoSincronizacion['resultadosEliminados'] > 0) {
            $mensaje .= ' Se eliminaron '
                .$resultadoSincronizacion['resultadosEliminados']
                .' puntuación(es) de subáreas eliminadas.';
        }

        return redirect()
            ->route('evaluaciones.show', $evaluacion)
            ->with('status', $mensaje);
    }

    public function show(int $id)
    {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->with([
                'areas.subareas',
                'aplicaciones.estudiante',
                'aplicaciones.resultados',
            ])
            ->findOrFail($id);

        $totalSubareas = $evaluacion->totalSubareas();

        return view(
            'gestion.evaluaciones.show',
            compact('evaluacion', 'totalSubareas')
        );
    }

    public function archivar(int $id)
    {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->findOrFail($id);

        $evaluacion->update(['estado' => 'archivada']);

        return redirect()
            ->route('evaluaciones.show', $evaluacion)
            ->with('status', 'Evaluación archivada correctamente.');
    }

    public function wordMuestra(
        Request $request,
        int $id,
        EvaluacionWordService $wordService
    ) {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->with('areas.subareas')
            ->findOrFail($id);

        try {
            $archivo = $wordService->generarMuestra(
                $evaluacion,
                $this->plantillaSolicitada($request)
            );
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->route('evaluaciones.show', $evaluacion)
                ->with('error', 'No se pudo generar el Word de muestra. Inténtalo nuevamente.');
        }

        $nombreDescarga = 'muestra_evaluacion_'
            .now()->format('Y-m-d_H-i-s').'.docx';

        return response()
            ->download(
                $archivo,
                $nombreDescarga,
                [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ]
            )
            ->deleteFileAfterSend(true);
    }

    private function validarEvaluacion(Request $request): array
    {
        return $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo_evaluacion' => 'required|string|max:255',
            'proyecto' => 'nullable|string|max:255',
            'docente' => 'nullable|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'estado' => 'nullable|in:borrador,activa,archivada',
            'areas' => 'required|array|min:1',
            'areas.*.id' => 'nullable|integer',
            'areas.*.nombre' => 'required|string|max:255',
            'areas.*.subareas' => 'required|array|min:1',
            'areas.*.subareas.*.id' => 'nullable|integer',
            'areas.*.subareas.*.nombre' => 'required|string|max:255',
        ]);
    }

    /**
     * Sincroniza las áreas y subáreas enviadas con las existentes.
     *
     * Conserva los IDs de las subáreas para no romper los resultados ya
     * registrados. Si se elimina una subárea, también se eliminan sus
     * resultados. Devuelve las subáreas nuevas y los resultados eliminados.
     *
     * @return array{nuevasSubareas: int, resultadosEliminados: int}
     */
    private function sincronizarAreas(Evaluacion $evaluacion, array $areasDatos): array
    {
        $areasExistentes = $evaluacion->areas()
            ->with('subareas')
            ->get()
            ->keyBy('id');

        $subareasExistentes = $evaluacion->subareas()->get()->keyBy('id');

        $idsAreasConservadas = [];
        $idsSubareasConservadas = [];
        $nuevasSubareas = 0;

        foreach (array_values($areasDatos) as $indiceArea => $areaDato) {
            $numeroArea = $indiceArea + 1;
            $areaId = isset($areaDato['id']) ? (int) $areaDato['id'] : null;
            $area = $areasExistentes->get($areaId);

            if ($area) {
                $area->update([
                    'nombre' => $areaDato['nombre'],
                    'orden' => $numeroArea,
                ]);
            } else {
                $area = $evaluacion->areas()->create([
                    'nombre' => $areaDato['nombre'],
                    'orden' => $numeroArea,
                ]);
            }

            $idsAreasConservadas[] = $area->id;

            foreach (array_values($areaDato['subareas']) as $indiceSubarea => $subareaDato) {
                $numeroSubarea = $indiceSubarea + 1;
                $subareaId = isset($subareaDato['id'])
                    ? (int) $subareaDato['id']
                    : null;
                $subarea = $subareasExistentes->get($subareaId);

                if ($subarea) {
                    $subarea->update([
                        'evaluacion_area_id' => $area->id,
                        'nombre' => $subareaDato['nombre'],
                        'orden' => $numeroSubarea,
                    ]);
                } else {
                    $subarea = $area->subareas()->create([
                        'nombre' => $subareaDato['nombre'],
                        'orden' => $numeroSubarea,
                    ]);

                    $nuevasSubareas++;
                }

                $idsSubareasConservadas[] = $subarea->id;
            }
        }

        $subareasAEliminar = $subareasExistentes->except($idsSubareasConservadas);

        $resultadosEliminados = 0;

        foreach ($subareasAEliminar as $subarea) {
            $resultadosEliminados += $subarea->resultados()->delete();

            $subarea->delete();
        }

        $areasAEliminar = $areasExistentes->except($idsAreasConservadas);

        foreach ($areasAEliminar as $area) {
            $area->delete();
        }

        return [
            'nuevasSubareas' => $nuevasSubareas,
            'resultadosEliminados' => $resultadosEliminados,
        ];
    }

    private function plantillaSolicitada(Request $request): string
    {
        $plantilla = $request->query('plantilla', 'vertical');

        if (! in_array($plantilla, ['vertical', 'horizontal'], true)) {
            return 'vertical';
        }

        return $plantilla;
    }
}

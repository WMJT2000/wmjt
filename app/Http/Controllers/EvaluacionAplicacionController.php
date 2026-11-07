<?php

namespace App\Http\Controllers;

use App\Services\EvaluacionWordService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class EvaluacionAplicacionController extends Controller
{
    public function create(int $evaluacionId)
    {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->findOrFail($evaluacionId);

        if ($evaluacion->estado !== 'activa') {
            return redirect()
                ->route('evaluaciones.show', $evaluacion)
                ->with('error', 'Solo se pueden aplicar evaluaciones activas.');
        }

        $estudiantes = Auth::user()
            ->estudiantes()
            ->with('grupo')
            ->where('activo', true)
            ->orderBy('apellidos')
            ->orderBy('nombres')
            ->get();

        $aplicaciones = $evaluacion->aplicaciones()
            ->get()
            ->keyBy('estudiante_id');

        return view(
            'gestion.evaluaciones.aplicar',
            compact('evaluacion', 'estudiantes', 'aplicaciones')
        );
    }

    public function store(Request $request, int $evaluacionId)
    {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->findOrFail($evaluacionId);

        if ($evaluacion->estado !== 'activa') {
            return redirect()
                ->route('evaluaciones.show', $evaluacion)
                ->with('error', 'Solo se pueden aplicar evaluaciones activas.');
        }

        $datos = $request->validate([
            'estudiante_id' => [
                'required',
                'integer',
                Rule::exists('estudiantes', 'id')
                    ->where('user_id', Auth::id())
                    ->where('activo', true)
                    ->whereNull('deleted_at'),
            ],
        ]);

        $aplicacion = $evaluacion->aplicaciones()
            ->where('estudiante_id', $datos['estudiante_id'])
            ->where('intento', 1)
            ->first();

        if (! $aplicacion) {
            $aplicacion = $evaluacion->aplicaciones()->create([
                'estudiante_id' => $datos['estudiante_id'],
                'evaluador_id' => Auth::id(),
                'intento' => 1,
                'estado' => 'en_progreso',
                'fecha_evaluacion' => now()->toDateString(),
                'iniciada_en' => now(),
            ]);
        }

        return redirect()->route(
            'evaluaciones.aplicaciones.edit',
            [$evaluacion->id, $aplicacion->id]
        );
    }

    public function edit(int $evaluacionId, int $aplicacionId)
    {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->with(['areas.subareas'])
            ->findOrFail($evaluacionId);

        $aplicacion = $evaluacion->aplicaciones()
            ->with(['estudiante.grupo', 'resultados'])
            ->findOrFail($aplicacionId);

        $resultados = $aplicacion->resultados
            ->keyBy('evaluacion_subarea_id');

        return view(
            'gestion.evaluaciones.puntuar',
            compact('evaluacion', 'aplicacion', 'resultados')
        );
    }

    public function update(
        Request $request,
        int $evaluacionId,
        int $aplicacionId
    ) {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->with('areas.subareas')
            ->findOrFail($evaluacionId);

        $aplicacion = $evaluacion->aplicaciones()
            ->findOrFail($aplicacionId);

        if ($aplicacion->estado === 'completada') {
            return redirect()
                ->route(
                    'evaluaciones.aplicaciones.edit',
                    [$evaluacion->id, $aplicacion->id]
                )
                ->with('error', 'La evaluación ya está completada.');
        }

        $datos = $request->validate([
            'accion' => 'required|in:borrador,finalizar',
            'resultados' => 'nullable|array',
            'resultados.*.valoracion' => 'nullable|in:excelente,en_proceso,debilitado,nulo',
            'resultados.*.observacion' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string',
        ]);

        $subareas = $evaluacion->areas
            ->flatMap(function ($area) {
                return $area->subareas;
            })
            ->keyBy('id');

        $resultados = $datos['resultados'] ?? [];

        if ($datos['accion'] === 'finalizar') {
            foreach ($subareas as $subarea) {
                $valoracion = $resultados[$subarea->id]['valoracion'] ?? null;

                if ($valoracion === null || $valoracion === '') {
                    return back()
                        ->withInput()
                        ->withErrors([
                            'resultados' => 'Debes valorar todas las subáreas para finalizar.',
                        ]);
                }
            }
        }

        DB::transaction(function () use (
            $aplicacion,
            $subareas,
            $resultados,
            $datos
        ) {
            foreach ($subareas as $subarea) {
                $fila = $resultados[$subarea->id] ?? null;
                $valoracion = $fila['valoracion'] ?? null;

                if ($valoracion === null || $valoracion === '') {
                    $aplicacion->resultados()
                        ->where('evaluacion_subarea_id', $subarea->id)
                        ->delete();

                    continue;
                }

                $aplicacion->resultados()->updateOrCreate(
                    ['evaluacion_subarea_id' => $subarea->id],
                    [
                        'valoracion' => $valoracion,
                        'observacion' => $fila['observacion'] ?? null,
                    ]
                );
            }

            if ($datos['accion'] === 'finalizar') {
                $aplicacion->update([
                    'estado' => 'completada',
                    'completada_en' => now(),
                    'observaciones' => $datos['observaciones'] ?? null,
                ]);
            } else {
                $aplicacion->update([
                    'observaciones' => $datos['observaciones'] ?? null,
                ]);
            }
        });

        $mensaje = $datos['accion'] === 'finalizar'
            ? 'Evaluación finalizada correctamente.'
            : 'Avance guardado correctamente.';

        return redirect()
            ->route(
                'evaluaciones.aplicaciones.edit',
                [$evaluacion->id, $aplicacion->id]
            )
            ->with('status', $mensaje);
    }

    public function word(
        Request $request,
        int $evaluacionId,
        int $aplicacionId,
        EvaluacionWordService $wordService
    ) {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->findOrFail($evaluacionId);

        $aplicacion = $evaluacion->aplicaciones()
            ->with([
                'evaluacion.areas.subareas',
                'estudiante',
                'resultados',
            ])
            ->findOrFail($aplicacionId);

        if ($aplicacion->estado !== 'completada') {
            return redirect()
                ->route(
                    'evaluaciones.aplicaciones.edit',
                    [$evaluacion->id, $aplicacion->id]
                )
                ->with('error', 'Debes finalizar la evaluación antes de generar el Word.');
        }

        try {
            $archivo = $wordService->generar(
                $aplicacion,
                $this->plantillaSolicitada($request)
            );
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->route(
                    'evaluaciones.aplicaciones.edit',
                    [$evaluacion->id, $aplicacion->id]
                )
                ->with('error', 'No se pudo generar el Word. Inténtalo nuevamente.');
        }

        $nombreDescarga = 'evaluacion_'.now()->format('Y-m-d_H-i-s').'.docx';

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

    public function wordTodas(
        Request $request,
        int $evaluacionId,
        EvaluacionWordService $wordService
    ) {
        $evaluacion = Auth::user()
            ->evaluaciones()
            ->findOrFail($evaluacionId);

        $aplicaciones = $evaluacion->aplicaciones()
            ->where('estado', 'completada')
            ->with([
                'estudiante.grupo',
                'resultados',
            ])
            ->get()
            ->sortBy(fn ($aplicacion) => [
                $aplicacion->estudiante->apellidos,
                $aplicacion->estudiante->nombres,
            ])
            ->values();

        if ($aplicaciones->isEmpty()) {
            return redirect()
                ->route('evaluaciones.show', $evaluacion)
                ->with('error', 'No hay evaluaciones completadas para descargar.');
        }

        try {
            $archivo = $wordService->generarTodas(
                $aplicaciones,
                $this->plantillaSolicitada($request)
            );
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->route('evaluaciones.show', $evaluacion)
                ->with('error', 'No se pudo generar el Word. Inténtalo nuevamente.');
        }

        $nombreDescarga = 'evaluaciones_'.now()->format('Y-m-d_H-i-s').'.docx';

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

    private function plantillaSolicitada(Request $request): string
    {
        $plantilla = $request->query('plantilla', 'vertical');

        if (! in_array($plantilla, ['vertical', 'horizontal'], true)) {
            return 'vertical';
        }

        return $plantilla;
    }
}

<?php

namespace App\Http\Controllers;

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
        return view('gestion.evaluacion-crear');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo_evaluacion' => 'required|string|max:255',
            'proyecto' => 'nullable|string|max:255',
            'docente' => 'nullable|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'estado' => 'nullable|in:borrador,activa,archivada',
            'areas' => 'required|array|min:1',
            'areas.*.nombre' => 'required|string|max:255',
            'areas.*.subareas' => 'required|array|min:1',
            'areas.*.subareas.*.nombre' => 'required|string|max:255',
        ]);

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

            foreach ($datos['areas'] as $indiceArea => $area) {
                $areaNueva = $evaluacion->areas()->create([
                    'nombre' => $area['nombre'],
                    'orden' => $indiceArea + 1,
                ]);

                foreach ($area['subareas'] as $indiceSubarea => $subarea) {
                    $areaNueva->subareas()->create([
                        'nombre' => $subarea['nombre'],
                        'orden' => $indiceSubarea + 1,
                    ]);
                }
            }

            return $evaluacion;
        });

        return redirect()
            ->route('evaluaciones.show', $evaluacion)
            ->with('status', 'Evaluación creada correctamente.');
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
}

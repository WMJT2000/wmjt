<?php

namespace App\Http\Controllers;

use App\Models\Manual;
use App\Models\ManualExecution;
use App\Models\ManualStepProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ManualExecutionController extends Controller
{


    public function index()
    {
        $user = Auth::user();

        $manuals = Manual::with([
            'technology',
            'sections.steps',
        ])
            ->where('status', 'published')
            ->orderBy('id', 'asc')
            ->get();

        $executions = ManualExecution::where('user_id', $user->id)
            ->get()
            ->keyBy('manual_id');

        foreach ($manuals as $manual) {
            $manual->user_execution = $executions->get($manual->id);

            $totalSteps = $manual->sections->sum(function ($section) {
                return $section->steps->count();
            });

            $completedSteps = 0;

            if ($manual->user_execution) {
                $completedSteps = ManualStepProgress::where(
                    'execution_id',
                    $manual->user_execution->id
                )
                    ->where('status', 'completed')
                    ->count();
            }

            $manual->total_steps = $totalSteps;
            $manual->completed_steps = $completedSteps;

            $manual->progress_percentage = $totalSteps > 0
                ? round(($completedSteps / $totalSteps) * 100)
                : 0;
        }

        return view('manuals.index', compact('manuals'));
    }




    public function myManuals()
    {
        $user = Auth::user();

        $executions = ManualExecution::with([
            'manual.technology',
            'manual.sections.steps',
            'stepProgress',
        ])
            ->where('user_id', $user->id)
            ->orderByDesc('updated_at')
            ->get()
            ->unique('manual_id')
            ->values();

        foreach ($executions as $execution) {

            $manual = $execution->manual;

            $totalSteps = $manual->sections->sum(function ($section) {
                return $section->steps->count();
            });

            $completedSteps = $execution->stepProgress
                ->where('status', 'completed')
                ->count();

            $execution->total_steps = $totalSteps;
            $execution->completed_steps = $completedSteps;

            $execution->progress_percentage = $totalSteps > 0
                ? round(($completedSteps / $totalSteps) * 100)
                : 0;
        }

        $totalManuales = $executions->count();

        $manualesCompletados = $executions
            ->where('status', 'completed')
            ->count();

        $manualesEnProgreso = $totalManuales - $manualesCompletados;

        return view('manuals.my-manuals', compact(
            'executions',
            'totalManuales',
            'manualesEnProgreso',
            'manualesCompletados'
        ));

    }


    /**
     * Iniciar una nueva ejecución de un manual.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'manual_id' => 'required|integer|exists:manuals,id',
        ]);

        $user = Auth::user();

        $manual = Manual::with('sections.steps')
            ->find($validated['manual_id']);

        if (!$manual) {
            return response()->json([
                'success' => false,
                'message' => 'Manual no encontrado'
            ], 404);
        }

        // Buscar si el usuario ya tiene una ejecución en progreso.
        $execution = ManualExecution::where('manual_id', $manual->id)
            ->where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->first();

        if ($execution) {
            return response()->json([
                'success' => true,
                'message' => 'Ya existe una ejecución en progreso',
                'data' => $execution
            ]);
        }

        $execution = ManualExecution::create([
            'manual_id' => $manual->id,
            'user_id' => $user->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        // Crear el progreso inicial de todos los pasos.
        foreach ($manual->sections as $section) {

            foreach ($section->steps as $step) {

                ManualStepProgress::create([
                    'execution_id' => $execution->id,
                    'step_id' => $step->id,
                    'status' => 'pending',
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Ejecución iniciada correctamente',
            'data' => $execution
        ], 201);
    }

    /**
     * Crear una nueva ejecución de un manual ya completado.
     */
    public function restart($manualId)
    {
        $user = Auth::user();

        $manual = Manual::with('sections.steps')->find($manualId);

        if (!$manual) {
            return response()->json([
                'success' => false,
                'message' => 'Manual no encontrado'
            ], 404);
        }

        // Crear una nueva ejecución
        $execution = ManualExecution::create([
            'manual_id' => $manual->id,
            'user_id' => $user->id,
            'status' => 'in_progress',
            'started_at' => now(),
            'current_step_id' => null,
        ]);

        // Crear nuevamente el progreso de todos los pasos
        foreach ($manual->sections as $section) {
            foreach ($section->steps as $step) {
                ManualStepProgress::create([
                    'execution_id' => $execution->id,
                    'step_id' => $step->id,
                    'status' => 'pending',
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Nueva ejecución creada correctamente',
            'data' => $execution
        ], 201);
    }

    /**
     * Obtener una ejecución completa.
     */
    public function show($id)
    {
        $user = Auth::user();

        $execution = ManualExecution::with([
            'manual.technology',
            'manual.sections.steps',
            'stepProgress.step',
        ])
            ->where('user_id', $user->id)
            ->find($id);

        if (!$execution) {
            return response()->json([
                'success' => false,
                'message' => 'Ejecución no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $execution
        ]);
    }

    /**
     * Obtener la ejecución actual del usuario para un manual.
     */

    public function myExecution($manualId)
    {
        $user = Auth::user();

        $execution = ManualExecution::with([
            'manual.technology',
            'manual.sections.steps',
            'stepProgress.step',
        ])
            ->where('manual_id', $manualId)
            ->where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->first();

        if (!$execution) {
            return response()->json([
                'success' => true,
                'data' => null
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $execution
        ]);
    }



    /**
     * Marcar un paso como completado.
     */
    public function completeStep($executionId, $stepId)
    {
        $user = Auth::user();

        $execution = ManualExecution::where('id', $executionId)
            ->where('user_id', $user->id)
            ->first();

        if (!$execution) {
            return response()->json([
                'success' => false,
                'message' => 'Ejecución no encontrada'
            ], 404);
        }

        if ($execution->status !== 'in_progress') {
            return response()->json([
                'success' => false,
                'message' => 'La ejecución ya no está en progreso'
            ], 400);
        }

        $progress = ManualStepProgress::where(
            'execution_id',
            $execution->id
        )
            ->where('step_id', $stepId)
            ->first();

        if (!$progress) {
            return response()->json([
                'success' => false,
                'message' => 'El paso no pertenece a esta ejecución'
            ], 404);
        }

        $progress->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $this->checkExecutionCompleted($execution);

        return response()->json([
            'success' => true,
            'message' => 'Paso completado correctamente',
            'data' => $progress
        ]);
    }

    /**
     * Marcar un paso nuevamente como pendiente.
     */
    public function uncompleteStep($executionId, $stepId)
    {
        $user = Auth::user();

        $execution = ManualExecution::where('id', $executionId)
            ->where('user_id', $user->id)
            ->first();

        if (!$execution) {
            return response()->json([
                'success' => false,
                'message' => 'Ejecución no encontrada'
            ], 404);
        }

        $progress = ManualStepProgress::where(
            'execution_id',
            $execution->id
        )
            ->where('step_id', $stepId)
            ->first();

        if (!$progress) {
            return response()->json([
                'success' => false,
                'message' => 'El paso no pertenece a esta ejecución'
            ], 404);
        }

        $progress->update([
            'status' => 'pending',
            'completed_at' => null,
        ]);

        // Si estaba completada, vuelve a progreso.
        if ($execution->status === 'completed') {
            $execution->update([
                'status' => 'in_progress',
                'completed_at' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Paso marcado como pendiente',
            'data' => $progress
        ]);
    }


    /**
     * Guardar una nota personal de un paso.
     */
    public function saveStepNote(Request $request, $executionId, $stepId)
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $user = Auth::user();

        $execution = ManualExecution::where('id', $executionId)
            ->where('user_id', $user->id)
            ->first();

        if (!$execution) {
            return response()->json([
                'success' => false,
                'message' => 'Ejecución no encontrada'
            ], 404);
        }

        $progress = ManualStepProgress::where('execution_id', $execution->id)
            ->where('step_id', $stepId)
            ->first();

        if (!$progress) {
            return response()->json([
                'success' => false,
                'message' => 'El paso no pertenece a esta ejecución'
            ], 404);
        }

        $progress->update([
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Nota guardada correctamente',
            'data' => $progress
        ]);
    }

    /**
     * Verificar si todos los pasos fueron completados.
     */
    private function checkExecutionCompleted(ManualExecution $execution)
    {
        $pendingSteps = ManualStepProgress::where(
            'execution_id',
            $execution->id
        )
            ->where('status', '!=', 'completed')
            ->count();

        if ($pendingSteps === 0) {

            $execution->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);
        }
    }


    /**
     * Guardar el paso actual de la ejecución.
     */
    public function updateCurrentStep($executionId, $stepId)
    {
        $user = Auth::user();

        $execution = ManualExecution::where('id', $executionId)
            ->where('user_id', $user->id)
            ->first();

        if (!$execution) {
            return response()->json([
                'success' => false,
                'message' => 'Ejecución no encontrada'
            ], 404);
        }

        $progress = ManualStepProgress::where('execution_id', $execution->id)
            ->where('step_id', $stepId)
            ->first();

        if (!$progress) {
            return response()->json([
                'success' => false,
                'message' => 'El paso no pertenece a esta ejecución'
            ], 404);
        }

        $execution->update([
            'current_step_id' => $stepId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Paso actual guardado correctamente',
            'data' => $execution
        ]);
    }


    public function page($manualId)
    {
        $manual = Manual::with([
            'technology',
            'sections.steps'
        ])->find($manualId);

        if (!$manual) {
            abort(404, 'Manual no encontrado');
        }

        return view(
            'manuals.execution',
            compact('manual')
        );
    }
}
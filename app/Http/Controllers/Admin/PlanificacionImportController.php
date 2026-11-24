<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlanificacionImportRequest;
use App\Models\Actividad;
use App\Models\Planificacion;
use App\Services\PlanificacionImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PlanificacionImportController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | PANTALLA PRINCIPAL
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $planificaciones = Auth::user()
            ->planificaciones()
            ->orderBy('id', 'desc')
            ->get([
                'id',
                'experiencia_aprendizaje',
                'nombre_maestra',
                'fecha',
                'es_plantilla',
            ]);

        return view(
            'gestion.planificacion-import',
            compact('planificaciones')
        );
    }

    /*
    |--------------------------------------------------------------------------
    | LISTAR ACTIVIDADES DE UNA PLANIFICACIÓN
    |--------------------------------------------------------------------------
    |
    | Se usa desde JavaScript para llenar el selector cuando queremos
    | importar subactividades en una actividad existente.
    |
    */

    public function actividadesList(
        Planificacion $planificacion
    ): JsonResponse {
        $planificacion = Auth::user()
            ->planificaciones()
            ->findOrFail($planificacion->id);

        $actividades = $planificacion->actividades()
            ->with('subactividades')
            ->orderBy('seccion')
            ->orderBy('orden')
            ->get([
                'id',
                'seccion',
                'orden',
                'ambito',
                'destreza',
                'planificacion_id',
            ]);

        return response()->json([
            'success' => true,
            'data' => $actividades,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTACIÓN COMPLETA
    |--------------------------------------------------------------------------
    */

    public function store(
        PlanificacionImportRequest $request,
        PlanificacionImportService $importService
    ): JsonResponse {
        $result = $importService->import(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Las planificaciones se importaron correctamente.',
            'data' => $result,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR ACTIVIDADES EN UNA PLANIFICACIÓN EXISTENTE
    |--------------------------------------------------------------------------
    */

    public function actividades(
        PlanificacionImportRequest $request,
        Planificacion $planificacion,
        PlanificacionImportService $importService
    ): JsonResponse {
        $planificacion = Auth::user()
            ->planificaciones()
            ->findOrFail($planificacion->id);

        $result = $importService->importActividades(
            $planificacion,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Las actividades se importaron correctamente.',
            'data' => $result,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR SUBACTIVIDADES EN UNA ACTIVIDAD EXISTENTE
    |--------------------------------------------------------------------------
    */

    public function subactividades(
        PlanificacionImportRequest $request,
        Actividad $actividad,
        PlanificacionImportService $importService
    ): JsonResponse {
        $actividad = Actividad::whereHas(
            'planificacion',
            function ($query) {
                $query->where(
                    'user_id',
                    Auth::id()
                );
            }
        )->findOrFail($actividad->id);

        $result = $importService->importSubactividades(
            $actividad,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Las subactividades se importaron correctamente.',
            'data' => $result,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Planificacion;
use App\Models\Actividad;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlanificacionController extends Controller
{
    // ==========================================
    // GESTIÓN DE PLANIFICACIONES
    // ==========================================

    public function index()
    {
        return view('gestion.planificaciones');
    }

    // ==========================================
    // API - LISTAR PLANIFICACIONES
    // ==========================================

    public function apiIndex()
    {
        $planificaciones = Auth::user()
            ->planificaciones()
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $planificaciones
        ]);
    }


    // ==========================================
    // API - MOSTRAR PLANIFICACIÓN
    // ==========================================

    public function apiShow($id)
    {
        $planificacion = Auth::user()
            ->planificaciones()
            ->with('actividades')
            ->find($id);

        if (!$planificacion) {

            return response()->json([
                'success' => false,
                'message' => 'Planificación no encontrada.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $planificacion
        ]);
    }



    public function create(Request $request)
    {
        return view('gestion.planificacion-crear', [
            'planificacionId' => $request->query('id')
        ]);
    }


    // ==========================================
    // GUARDAR PLANIFICACIÓN
    // ==========================================

    public function store(Request $request)
    {
        $planificacion = Planificacion::create([
            'user_id' => Auth::id(),

            'experiencia_aprendizaje' =>
            $request->input('1_experiencia_prendizaje'),

            'descripcion_general_experiencia' =>
            $request->input('2_descripcion_general_experiencia'),

            'nombre_maestra' =>
            $request->input('3_nombre_maestra'),

            'tiempo_estimado' =>
            $request->input('4_tiempo_estimado'),

            'fecha' =>
            $request->input('5_fecha'),

            'nivel_educativo' =>
            $request->input('6_nivel_educativo'),

            'objetivo_aprendizaje' =>
            $request->input('7_objetivo_aprendizaje'),

            'elemento_integrador' =>
            $request->input('8_elemento_integrador'),

            'nocion_dia' =>
            $request->input('9_nocion_dia'),

            'tamano_letra_actividades' =>
            $request->input('tamano_letra_actividades', 8),

            'estado' => 'borrador',

            'progreso' =>
            $request->input('progreso', 0),
        ]);


        // ==========================================
        // ACTIVIDADES PARTE 1
        // ==========================================

        $part1 = $request->input('part1', []);

        foreach ($part1 as $index => $actividad) {

            Actividad::create([
                'planificacion_id' => $planificacion->id,

                'seccion' => 'part1',

                'orden' => $index + 1,

                'ambito' =>
                $actividad['ambito'] ?? null,

                'destreza' =>
                $actividad['destreza'] ?? null,

                'estrategias_metologicas' =>
                $actividad['estrategias_metologicas'] ?? null,

                'recursos' =>
                $actividad['recursos'] ?? null,

                'indicadores_logro' =>
                $actividad['indicadores_logro'] ?? null,
            ]);
        }


        // ==========================================
        // ACTIVIDADES PARTE 2
        // ==========================================

        $part2 = $request->input('part2', []);

        foreach ($part2 as $index => $actividad) {

            Actividad::create([
                'planificacion_id' => $planificacion->id,

                'seccion' => 'part2',

                'orden' => $index + 1,

                'ambito' =>
                $actividad['ambito'] ?? null,

                'destreza' =>
                $actividad['destreza'] ?? null,

                'estrategias_metologicas' =>
                $actividad['estrategias_metologicas'] ?? null,

                'recursos' =>
                $actividad['recursos'] ?? null,

                'indicadores_logro' =>
                $actividad['indicadores_logro'] ?? null,
            ]);
        }


        // ==========================================
        // RESPUESTA
        // ==========================================

        if ($request->expectsJson()) {

            return response()->json([
                'success' => true,
                'message' =>
                'Planificación guardada correctamente.',
                'planificacion_id' =>
                $planificacion->id,
            ]);
        }

        return redirect()
            ->back()
            ->with(
                'success',
                'Planificación guardada correctamente.'
            );
    }



    public function update(Request $request, $id)
    {
        $planificacion = Auth::user()
            ->planificaciones()
            ->find($id);

        if (!$planificacion) {
            return response()->json([
                'success' => false,
                'message' => 'Planificación no encontrada.'
            ], 404);
        }

        $planificacion->update([
            'experiencia_aprendizaje' => $request->input('1_experiencia_prendizaje'),
            'descripcion_general_experiencia' => $request->input('2_descripcion_general_experiencia'),
            'nombre_maestra' => $request->input('3_nombre_maestra'),
            'tiempo_estimado' => $request->input('4_tiempo_estimado'),
            'fecha' => $request->input('5_fecha'),
            'nivel_educativo' => $request->input('6_nivel_educativo'),
            'objetivo_aprendizaje' => $request->input('7_objetivo_aprendizaje'),
            'elemento_integrador' => $request->input('8_elemento_integrador'),
            'nocion_dia' => $request->input('9_nocion_dia'),
            'tamano_letra_actividades' => $request->input('tamano_letra_actividades', 8),
            'progreso' => $request->input('progreso', 0),
        ]);

        $planificacion->actividades()->delete();

        $part1 = $request->input('part1', []);

        foreach ($part1 as $index => $actividad) {
            Actividad::create([
                'planificacion_id' => $planificacion->id,
                'seccion' => 'part1',
                'orden' => $index + 1,
                'ambito' => $actividad['ambito'] ?? null,
                'destreza' => $actividad['destreza'] ?? null,
                'estrategias_metologicas' => $actividad['estrategias_metologicas'] ?? null,
                'recursos' => $actividad['recursos'] ?? null,
                'indicadores_logro' => $actividad['indicadores_logro'] ?? null,
            ]);
        }

        $part2 = $request->input('part2', []);

        foreach ($part2 as $index => $actividad) {
            Actividad::create([
                'planificacion_id' => $planificacion->id,
                'seccion' => 'part2',
                'orden' => $index + 1,
                'ambito' => $actividad['ambito'] ?? null,
                'destreza' => $actividad['destreza'] ?? null,
                'estrategias_metologicas' => $actividad['estrategias_metologicas'] ?? null,
                'recursos' => $actividad['recursos'] ?? null,
                'indicadores_logro' => $actividad['indicadores_logro'] ?? null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Planificación actualizada correctamente.',
            'planificacion_id' => $planificacion->id,
        ]);
    }


    // ==========================================
    // ELIMINAR PLANIFICACIÓN
    // ==========================================

    public function destroy($id)
    {
        $planificacion = Auth::user()
            ->planificaciones()
            ->find($id);

        if (!$planificacion) {
            return response()->json([
                'success' => false,
                'message' => 'Planificación no encontrada.'
            ], 404);
        }

        $planificacion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Planificación eliminada correctamente.'
        ]);
    }
}
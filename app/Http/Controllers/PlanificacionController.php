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
            ->where('es_plantilla', false)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $planificaciones
        ]);
    }


    // ==========================================
    // API - PLANIFICACIONES POR RANGO DE FECHAS
    // ==========================================

    public function porFechas(Request $request)
    {
        $request->validate([
            'desde' => 'required|date',
            'hasta' => 'required|date',
        ]);

        $desde = $request->input('desde');
        $hasta = $request->input('hasta');

        if ($desde > $hasta) {
            return response()->json([
                'success' => false,
                'message' =>
                    'La fecha inicial no puede ser mayor que la fecha final.'
            ], 422);
        }

        $planificaciones = Auth::user()
            ->planificaciones()
            ->where('es_plantilla', false)
            ->whereDate('fecha', '>=', $desde)
            ->whereDate('fecha', '<=', $hasta)
            ->orderBy('fecha', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $planificaciones
        ]);
    }


    // ==========================================
    // API - LISTAR PLANTILLAS
    // ==========================================

    public function apiPlantillas()
    {
        $plantillas = Auth::user()
            ->planificaciones()
            ->where('es_plantilla', true)
            ->with('actividades')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $plantillas
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
                'message' =>
                    'Planificación no encontrada.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $planificacion
        ]);
    }


    // ==========================================
    // MOSTRAR FORMULARIO DE CREACIÓN / EDICIÓN
    // ==========================================

  // ==========================================
// MOSTRAR FORMULARIO DE CREACIÓN / EDICIÓN
// ==========================================

public function create(Request $request)
{
    $idUrl = $request->query('id');

    $usandoPlantilla =
        $request->query('plantilla') == 1;

    $planificacionId = null;
    $plantillaId = null;
    $recuperandoBorrador = false;


    // =====================================================
    // CASO 1
    // CREAR NUEVA PLANIFICACIÓN DESDE UNA PLANTILLA
    // =====================================================

    if ($usandoPlantilla && $idUrl) {

        /*
        -----------------------------------------------------
        BUSCAR SI YA EXISTE UN BORRADOR CREADO DESDE
        ESTA MISMA PLANTILLA
        -----------------------------------------------------
        */

        $borradorId =
            session('planificacion_borrador_id');

        $borradorPlantillaId =
            session('planificacion_borrador_plantilla_id');


        /*
        -----------------------------------------------------
        COMPROBAR SI EL BORRADOR PERTENECE A ESTA PLANTILLA
        -----------------------------------------------------
        */

        if (
            $borradorId &&
            $borradorPlantillaId &&
            (string) $borradorPlantillaId ===
                (string) $idUrl
        ) {

            $borrador = Auth::user()
                ->planificaciones()
                ->where('id', $borradorId)
                ->where('estado', 'borrador')
                ->where('es_plantilla', false)
                ->first();

            if ($borrador) {

                /*
                -------------------------------------------------
                IMPORTANTE:

                Aquí usamos el ID de la planificación nueva,
                NO el ID de la plantilla.
                -------------------------------------------------
                */

                $planificacionId =
                    $borrador->id;

                $recuperandoBorrador =
                    true;
            }
        }


        /*
        -----------------------------------------------------
        SI NO HAY BORRADOR:

        CARGAMOS LA PLANTILLA COMO ORIGEN.
        -----------------------------------------------------
        */

        if (!$recuperandoBorrador) {

            $plantilla = Auth::user()
                ->planificaciones()
                ->where('id', $idUrl)
                ->where('es_plantilla', true)
                ->firstOrFail();

            $plantillaId =
                $plantilla->id;
        }
    }


    // =====================================================
    // CASO 2
    // EDITAR PLANIFICACIÓN O PLANTILLA EXISTENTE
    // =====================================================

    elseif ($idUrl) {

        /*
        -----------------------------------------------------
        AQUÍ NO FILTRAMOS es_plantilla = false.

        Primero buscamos cualquier registro del usuario.

        Esto permite:

        /planificaciones/crear?id=25
        -> editar planificación normal

        /planificaciones/crear?id=1
        -> editar plantilla
        -----------------------------------------------------
        */

        $registro = Auth::user()
            ->planificaciones()
            ->where('id', $idUrl)
            ->firstOrFail();


        /*
        -----------------------------------------------------
        TANTO LA PLANIFICACIÓN NORMAL COMO LA PLANTILLA
        SE ENVÍAN COMO planificacionId.

        El JS será quien determine si es plantilla.
        -----------------------------------------------------
        */

        $planificacionId =
            $registro->id;
    }


    // =====================================================
    // CASO 3
    // NUEVA PLANIFICACIÓN / RECUPERAR BORRADOR
    // =====================================================

    else {

        $borradorId =
            session('planificacion_borrador_id');


        if ($borradorId) {

            $borrador = Auth::user()
                ->planificaciones()
                ->where('id', $borradorId)
                ->where('estado', 'borrador')
                ->where('es_plantilla', false)
                ->first();


            if ($borrador) {

                $planificacionId =
                    $borrador->id;

                $recuperandoBorrador =
                    true;

            } else {

                /*
                ---------------------------------------------
                EL BORRADOR YA NO EXISTE.

                LIMPIAMOS LA SESIÓN.
                ---------------------------------------------
                */

                session()->forget([
                    'planificacion_borrador_id',
                    'planificacion_borrador_plantilla_id'
                ]);
            }
        }
    }


    // =====================================================
    // ENVIAR DATOS A LA VISTA
    // =====================================================

    return view(
        'gestion.planificacion-crear',
        [
            'planificacionId' =>
                $planificacionId,

            'plantillaId' =>
                $plantillaId,

            'recuperandoBorrador' =>
                $recuperandoBorrador,
        ]
    );
}


    // ==========================================
    // GUARDAR NUEVA PLANIFICACIÓN O PLANTILLA
    // ==========================================

    public function store(Request $request)
    {
        // ==========================================
        // DETERMINAR SI ES GUARDADO DEFINITIVO
        // ==========================================

        $finalizar =
            $request->boolean('finalizar');


        // ==========================================
        // CREAR PLANIFICACIÓN
        // ==========================================

        $planificacion = Planificacion::create([

            'user_id' =>
                Auth::id(),

            'experiencia_aprendizaje' =>
                $request->input(
                    '1_experiencia_prendizaje'
                ),

            'descripcion_general_experiencia' =>
                $request->input(
                    '2_descripcion_general_experiencia'
                ),

            'nombre_maestra' =>
                $request->input(
                    '3_nombre_maestra'
                ),

            'tiempo_estimado' =>
                $request->input(
                    '4_tiempo_estimado'
                ),

            'fecha' =>
                $request->input(
                    '5_fecha'
                ),

            'nivel_educativo' =>
                $request->input(
                    '6_nivel_educativo'
                ),

            'objetivo_aprendizaje' =>
                $request->input(
                    '7_objetivo_aprendizaje'
                ),

            'elemento_integrador' =>
                $request->input(
                    '8_elemento_integrador'
                ),

            'nocion_dia' =>
                $request->input(
                    '9_nocion_dia'
                ),

            'tamano_letra_actividades' =>
                $request->input(
                    'tamano_letra_actividades',
                    8
                ),

            // ==========================================
            // BORRADOR / FINALIZADA
            // ==========================================

            'estado' =>
                $finalizar
                    ? 'finalizada'
                    : 'borrador',

            'progreso' =>
                $request->input(
                    'progreso',
                    0
                ),

            // ==========================================
            // NORMAL / PLANTILLA
            // ==========================================

            'es_plantilla' =>
                $request->boolean(
                    'es_plantilla'
                ),
        ]);


        // ==========================================
        // ACTIVIDADES PARTE 1
        // ==========================================

        $part1 = $request->input(
            'part1',
            []
        );

        foreach (
            $part1
            as $index => $actividad
        ) {

            Actividad::create([

                'planificacion_id' =>
                    $planificacion->id,

                'seccion' =>
                    'part1',

                'orden' =>
                    $index + 1,

                'ambito' =>
                    $actividad['ambito'] ?? null,

                'destreza' =>
                    $actividad['destreza'] ?? null,

                'estrategias_metologicas' =>
                    $actividad[
                        'estrategias_metologicas'
                    ] ?? null,

                'recursos' =>
                    $actividad['recursos'] ?? null,

                'indicadores_logro' =>
                    $actividad[
                        'indicadores_logro'
                    ] ?? null,
            ]);
        }


        // ==========================================
        // ACTIVIDADES PARTE 2
        // ==========================================

        $part2 = $request->input(
            'part2',
            []
        );

        foreach (
            $part2
            as $index => $actividad
        ) {

            Actividad::create([

                'planificacion_id' =>
                    $planificacion->id,

                'seccion' =>
                    'part2',

                'orden' =>
                    $index + 1,

                'ambito' =>
                    $actividad['ambito'] ?? null,

                'destreza' =>
                    $actividad['destreza'] ?? null,

                'estrategias_metologicas' =>
                    $actividad[
                        'estrategias_metologicas'
                    ] ?? null,

                'recursos' =>
                    $actividad['recursos'] ?? null,

                'indicadores_logro' =>
                    $actividad[
                        'indicadores_logro'
                    ] ?? null,
            ]);
        }


        // ==========================================
        // MANEJAR BORRADOR EN SESIÓN
        // ==========================================

        if (
            !$planificacion->es_plantilla &&
            $planificacion->estado === 'borrador'
        ) {

            /*
            -----------------------------------------------------
            Guardamos el ID de la nueva planificación.
            -----------------------------------------------------
            */

            session([
                'planificacion_borrador_id' =>
                    $planificacion->id,

                /*
                -------------------------------------------------
                Si vino desde una plantilla, guardamos cuál fue.

                Ejemplo:

                plantilla = 1
                borrador = 25

                queda:

                planificacion_borrador_id = 25
                planificacion_borrador_plantilla_id = 1
                -------------------------------------------------
                */

                'planificacion_borrador_plantilla_id' =>
                    $request->input(
                        'plantilla_origen_id'
                    )
            ]);

        } elseif (
            !$planificacion->es_plantilla &&
            $planificacion->estado === 'finalizada'
        ) {

            /*
            -----------------------------------------------------
            La planificación ya terminó.
            Ya no debe recuperarse como borrador.
            -----------------------------------------------------
            */

            session()->forget([
                'planificacion_borrador_id',
                'planificacion_borrador_plantilla_id'
            ]);
        }


        // ==========================================
        // RESPUESTA JSON
        // ==========================================

        if ($request->expectsJson()) {

            return response()->json([

                'success' =>
                    true,

                'message' =>
                    $planificacion->es_plantilla
                        ? 'Plantilla guardada correctamente.'
                        : (
                            $finalizar
                                ? 'Planificación guardada correctamente.'
                                : 'Borrador guardado correctamente.'
                        ),

                'planificacion_id' =>
                    $planificacion->id,

                'es_plantilla' =>
                    $planificacion->es_plantilla,

                'estado' =>
                    $planificacion->estado,
            ]);
        }


        // ==========================================
        // RESPUESTA NORMAL
        // ==========================================

        return redirect()
            ->back()
            ->with(
                'success',
                $planificacion->es_plantilla
                    ? 'Plantilla guardada correctamente.'
                    : (
                        $finalizar
                            ? 'Planificación guardada correctamente.'
                            : 'Borrador guardado correctamente.'
                    )
            );
    }


    // ==========================================
    // ACTUALIZAR PLANIFICACIÓN
    // ==========================================

    public function update(
        Request $request,
        $id
    ) {

        // ==========================================
        // BUSCAR PLANIFICACIÓN DEL USUARIO
        // ==========================================

        $planificacion = Auth::user()
            ->planificaciones()
            ->find($id);


        if (!$planificacion) {

            return response()->json([
                'success' => false,
                'message' =>
                    'Planificación no encontrada.'
            ], 404);
        }


        // ==========================================
        // SABER SI ES GUARDADO DEFINITIVO
        // ==========================================

        $finalizar =
            $request->boolean('finalizar');


        // ==========================================
        // ACTUALIZAR DATOS PRINCIPALES
        // ==========================================

        $planificacion->update([

            'experiencia_aprendizaje' =>
                $request->input(
                    '1_experiencia_prendizaje'
                ),

            'descripcion_general_experiencia' =>
                $request->input(
                    '2_descripcion_general_experiencia'
                ),

            'nombre_maestra' =>
                $request->input(
                    '3_nombre_maestra'
                ),

            'tiempo_estimado' =>
                $request->input(
                    '4_tiempo_estimado'
                ),

            'fecha' =>
                $request->input(
                    '5_fecha'
                ),

            'nivel_educativo' =>
                $request->input(
                    '6_nivel_educativo'
                ),

            'objetivo_aprendizaje' =>
                $request->input(
                    '7_objetivo_aprendizaje'
                ),

            'elemento_integrador' =>
                $request->input(
                    '8_elemento_integrador'
                ),

            'nocion_dia' =>
                $request->input(
                    '9_nocion_dia'
                ),

            'tamano_letra_actividades' =>
                $request->input(
                    'tamano_letra_actividades',
                    8
                ),

            // ==========================================
            // BORRADOR / FINALIZADA
            // ==========================================

            'estado' =>
                $finalizar
                    ? 'finalizada'
                    : 'borrador',

            'progreso' =>
                $request->input(
                    'progreso',
                    0
                ),
        ]);


        // ==========================================
        // ELIMINAR ACTIVIDADES ANTERIORES
        // ==========================================

        $planificacion
            ->actividades()
            ->delete();


        // ==========================================
        // ACTIVIDADES PARTE 1
        // ==========================================

        $part1 = $request->input(
            'part1',
            []
        );

        foreach (
            $part1
            as $index => $actividad
        ) {

            Actividad::create([

                'planificacion_id' =>
                    $planificacion->id,

                'seccion' =>
                    'part1',

                'orden' =>
                    $index + 1,

                'ambito' =>
                    $actividad['ambito'] ?? null,

                'destreza' =>
                    $actividad['destreza'] ?? null,

                'estrategias_metologicas' =>
                    $actividad[
                        'estrategias_metologicas'
                    ] ?? null,

                'recursos' =>
                    $actividad['recursos'] ?? null,

                'indicadores_logro' =>
                    $actividad[
                        'indicadores_logro'
                    ] ?? null,
            ]);
        }


        // ==========================================
        // ACTIVIDADES PARTE 2
        // ==========================================

        $part2 = $request->input(
            'part2',
            []
        );

        foreach (
            $part2
            as $index => $actividad
        ) {

            Actividad::create([

                'planificacion_id' =>
                    $planificacion->id,

                'seccion' =>
                    'part2',

                'orden' =>
                    $index + 1,

                'ambito' =>
                    $actividad['ambito'] ?? null,

                'destreza' =>
                    $actividad['destreza'] ?? null,

                'estrategias_metologicas' =>
                    $actividad[
                        'estrategias_metologicas'
                    ] ?? null,

                'recursos' =>
                    $actividad['recursos'] ?? null,

                'indicadores_logro' =>
                    $actividad[
                        'indicadores_logro'
                    ] ?? null,
            ]);
        }


        // ==========================================
        // MANEJAR BORRADOR EN SESIÓN
        // ==========================================

        if ($finalizar) {

            /*
            -----------------------------------------------------
            PLANIFICACIÓN FINALIZADA
            -----------------------------------------------------
            */

            session()->forget([
                'planificacion_borrador_id',
                'planificacion_borrador_plantilla_id'
            ]);

        } else {

            /*
            -----------------------------------------------------
            SIGUE SIENDO BORRADOR
            -----------------------------------------------------
            */

            session([
                'planificacion_borrador_id' =>
                    $planificacion->id,

                /*
                -------------------------------------------------
                Mantener el origen de plantilla si ya existe.
                -------------------------------------------------
                */

                'planificacion_borrador_plantilla_id' =>
                    session(
                        'planificacion_borrador_plantilla_id'
                    )
            ]);
        }


        // ==========================================
        // RESPUESTA
        // ==========================================

        return response()->json([

            'success' =>
                true,

            'message' =>
                $finalizar
                    ? 'Planificación guardada correctamente.'
                    : 'Borrador guardado correctamente.',

            'planificacion_id' =>
                $planificacion->id,

            'estado' =>
                $planificacion->estado,
        ]);
    }


    // ==========================================
    // CONVERTIR PLANIFICACIÓN EN PLANTILLA
    // ==========================================

    public function convertirEnPlantilla($id)
    {
        $planificacion = Auth::user()
            ->planificaciones()
            ->find($id);

        if (!$planificacion) {

            return response()->json([
                'success' => false,
                'message' =>
                    'Planificación no encontrada.'
            ], 404);
        }


        $planificacion->update([
            'es_plantilla' => true
        ]);


        // ==========================================
        // SI ERA EL BORRADOR ACTIVO,
        // QUITARLO DE LA SESIÓN
        // ==========================================

        if (
            session('planificacion_borrador_id')
            == $planificacion->id
        ) {

            session()->forget([
                'planificacion_borrador_id',
                'planificacion_borrador_plantilla_id'
            ]);
        }


        return response()->json([
            'success' => true,
            'message' =>
                'Planificación convertida en plantilla correctamente.'
        ]);
    }


    // ==========================================
    // ELIMINAR PLANIFICACIÓN / PLANTILLA
    // ==========================================

    public function destroy($id)
    {
        $planificacion = Auth::user()
            ->planificaciones()
            ->find($id);

        if (!$planificacion) {

            return response()->json([
                'success' => false,
                'message' =>
                    'Planificación no encontrada.'
            ], 404);
        }


        // ==========================================
        // SI ES EL BORRADOR ACTIVO,
        // QUITARLO DE LA SESIÓN
        // ==========================================

        if (
            session('planificacion_borrador_id')
            == $planificacion->id
        ) {

            session()->forget([
                'planificacion_borrador_id',
                'planificacion_borrador_plantilla_id'
            ]);
        }


        // ==========================================
        // ELIMINAR PLANIFICACIÓN
        // ==========================================

        $planificacion->delete();


        return response()->json([
            'success' => true,
            'message' =>
                'Planificación eliminada correctamente.'
        ]);
    }
}
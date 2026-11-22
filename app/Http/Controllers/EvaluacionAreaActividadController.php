<?php

namespace App\Http\Controllers;

use App\Models\EvaluacionAreaActividad;
use App\Models\EvArea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvaluacionAreaActividadController extends Controller
{
    public function index(Request $request)
    {
        $actividades = $this->consultaDelUsuario()
            ->with('evArea')
            ->when($request->filled('area'), function ($query) use ($request) {
                $query->where('ev_area_id', $request->input('area'));
            })
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        $areas = $this->areasDelUsuario();

        $editar = null;

        if ($request->filled('editar')) {
            $editar = $this->consultaDelUsuario()
                ->findOrFail($request->input('editar'));
        }

        return view('gestion.evaluaciones.actividades.index', compact(
            'actividades',
            'areas',
            'editar'
        ));
    }

    public function porFechas(Request $request)
    {
        $datos = $request->validate([
            'inicio' => 'required|date',
            'fin' => 'required|date|after_or_equal:inicio',
        ]);

        $actividades = $this->consultaDelUsuario()
            ->with('evArea')
            ->whereBetween('fecha', [$datos['inicio'], $datos['fin']])
            ->orderBy('fecha')
            ->orderBy('id')
            ->get(['ev_area_id', 'titulo', 'descripcion']);

        $porArea = [];

        foreach ($actividades as $actividad) {
            $area = trim((string) ($actividad->evArea?->nombre ?? ''));
            $titulo = trim((string) $actividad->titulo);
            $descripcion = trim((string) ($actividad->descripcion ?? ''));

            $claveArea = mb_strtolower($area);

            if (! isset($porArea[$claveArea])) {
                $porArea[$claveArea] = [
                    'area' => $area,
                    'titulos' => [],
                ];
            }

            $claveTitulo = mb_strtolower($titulo);

            if (! isset($porArea[$claveArea]['titulos'][$claveTitulo])) {
                $porArea[$claveArea]['titulos'][$claveTitulo] = [
                    'titulo' => $titulo,
                    'descripciones' => [],
                ];
            }

            $grupo = &$porArea[$claveArea]['titulos'][$claveTitulo];

            if ($descripcion !== ''
                && ! in_array($descripcion, $grupo['descripciones'], true)) {
                $grupo['descripciones'][] = $descripcion;
            }

            unset($grupo);
        }

        $areas = array_values($porArea);

        usort($areas, function (array $a, array $b) {
            return strcasecmp($a['area'], $b['area']);
        });

        $temas = [];

        foreach ($areas as $area) {
            $titulos = array_values($area['titulos']);

            usort($titulos, function (array $a, array $b) {
                return strcasecmp($a['titulo'], $b['titulo']);
            });

            $partes = [];

            foreach ($titulos as $grupo) {
                $texto = $grupo['titulo'];

                if (count($grupo['descripciones']) > 0) {
                    $texto .= ' ('.implode('; ', $grupo['descripciones']).')';
                }

                $partes[] = $texto;
            }

            $tema = implode('; ', $partes);

            if ($area['area'] !== '') {
                $tema = 'Área: '.$area['area'].' | '.$tema;
            }

            // Un tema por línea, sin saltos internos ni comas que rompan el prompt.
            $tema = preg_replace('/\s+/u', ' ', trim((string) $tema));
            $temas[] = str_replace(',', ';', (string) $tema);
        }

        return response()->json([
            'temas' => $temas,
        ]);
    }

    public function store(Request $request)
    {
        $datos = $this->validar($request);

        $area = $this->areaDelUsuario((int) $datos['ev_area_id']);

        EvaluacionAreaActividad::create([
            'ev_area_id' => $area->id,
            'titulo' => $datos['titulo'],
            'descripcion' => $datos['descripcion'] ?? null,
            'fecha' => $datos['fecha'] ?? null,
        ]);

        return redirect()
            ->route('evaluaciones.actividades.index')
            ->with('status', 'Actividad creada correctamente.');
    }

    public function update(Request $request, int $id)
    {
        $actividad = $this->consultaDelUsuario()->findOrFail($id);

        $datos = $this->validar($request);

        $area = $this->areaDelUsuario((int) $datos['ev_area_id']);

        $actividad->update([
            'ev_area_id' => $area->id,
            'titulo' => $datos['titulo'],
            'descripcion' => $datos['descripcion'] ?? null,
            'fecha' => $datos['fecha'] ?? null,
        ]);

        return redirect()
            ->route('evaluaciones.actividades.index')
            ->with('status', 'Actividad actualizada correctamente.');
    }

    public function destroy(int $id)
    {
        $actividad = $this->consultaDelUsuario()->findOrFail($id);

        $actividad->delete();

        return redirect()
            ->route('evaluaciones.actividades.index')
            ->with('status', 'Actividad eliminada correctamente.');
    }

    private function validar(Request $request): array
    {
        return $request->validate([
            'ev_area_id' => 'required|integer',
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha' => 'nullable|date',
        ]);
    }

    private function consultaDelUsuario()
    {
        return EvaluacionAreaActividad::query()
            ->whereHas('evArea', function ($query) {
                $query->where('user_id', Auth::id());
            });
    }

    private function areasDelUsuario()
    {
        return EvArea::query()
            ->where('user_id', Auth::id())
            ->orderBy('nombre')
            ->get();
    }

    private function areaDelUsuario(int $id): EvArea
    {
        return EvArea::query()
            ->where('user_id', Auth::id())
            ->findOrFail($id);
    }
}

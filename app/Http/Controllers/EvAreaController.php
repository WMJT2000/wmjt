<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EvAreaController extends Controller
{
    public function index(Request $request)
    {
        $areas = Auth::user()
            ->evAreas()
            ->withCount('actividades')
            ->orderBy('nombre')
            ->paginate(20);

        $editar = null;

        if ($request->filled('editar')) {
            $editar = Auth::user()
                ->evAreas()
                ->findOrFail($request->input('editar'));
        }

        return view('gestion.ev-areas.index', compact('areas', 'editar'));
    }

    public function store(Request $request)
    {
        $datos = $this->validar($request);

        Auth::user()->evAreas()->create($datos);

        return redirect()
            ->route('ev-areas.index')
            ->with('status', 'Área creada correctamente.');
    }

    public function update(Request $request, int $id)
    {
        $area = Auth::user()
            ->evAreas()
            ->findOrFail($id);

        $area->update($this->validar($request));

        return redirect()
            ->route('ev-areas.index')
            ->with('status', 'Área actualizada correctamente.');
    }

    public function destroy(int $id)
    {
        $area = Auth::user()
            ->evAreas()
            ->findOrFail($id);

        $area->delete();

        return redirect()
            ->route('ev-areas.index')
            ->with('status', 'Área eliminada correctamente.');
    }

    private function validar(Request $request): array
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        if (empty($datos['descripcion'])) {
            $datos['descripcion'] = null;
        }

        return $datos;
    }
}

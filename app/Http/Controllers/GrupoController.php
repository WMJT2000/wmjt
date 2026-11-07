<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class GrupoController extends Controller
{
    public function index(Request $request)
    {
        $grupos = Auth::user()
            ->grupos()
            ->withCount('estudiantes')
            ->orderBy('nombre')
            ->paginate(20);

        $editar = null;

        if ($request->filled('editar')) {
            $editar = Auth::user()
                ->grupos()
                ->findOrFail($request->input('editar'));
        }

        return view('gestion.grupos.index', compact('grupos', 'editar'));
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
                Rule::unique('grupos', 'nombre')->where('user_id', Auth::id()),
            ],
            'activo' => 'nullable|boolean',
        ]);

        Auth::user()->grupos()->create([
            'nombre' => $datos['nombre'],
            'activo' => $request->boolean('activo', true),
        ]);

        return redirect()
            ->route('grupos.index')
            ->with('status', 'Grupo creado correctamente.');
    }

    public function update(Request $request, int $id)
    {
        $grupo = Auth::user()
            ->grupos()
            ->findOrFail($id);

        $datos = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
                Rule::unique('grupos', 'nombre')
                    ->where('user_id', Auth::id())
                    ->ignore($grupo->id),
            ],
            'activo' => 'nullable|boolean',
        ]);

        $grupo->update([
            'nombre' => $datos['nombre'],
            'activo' => $request->boolean('activo'),
        ]);

        return redirect()
            ->route('grupos.index')
            ->with('status', 'Grupo actualizado correctamente.');
    }

    public function destroy(int $id)
    {
        $grupo = Auth::user()
            ->grupos()
            ->findOrFail($id);

        $grupo->update(['activo' => false]);

        return redirect()
            ->route('grupos.index')
            ->with('status', 'Grupo desactivado correctamente.');
    }
}

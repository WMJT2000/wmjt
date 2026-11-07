<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class EstudianteController extends Controller
{
    public function index(Request $request)
    {
        $buscar = trim((string) $request->input('buscar', ''));

        $estudiantes = Auth::user()
            ->estudiantes()
            ->with('grupo')
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($subquery) use ($buscar) {
                    $subquery
                        ->where('nombres', 'like', '%'.$buscar.'%')
                        ->orWhere('apellidos', 'like', '%'.$buscar.'%')
                        ->orWhere('codigo', 'like', '%'.$buscar.'%');
                });
            })
            ->when($request->filled('grupo_id'), function ($query) use ($request) {
                $query->where('grupo_id', $request->input('grupo_id'));
            })
            ->orderBy('apellidos')
            ->orderBy('nombres')
            ->paginate(20)
            ->withQueryString();

        $grupos = Auth::user()
            ->grupos()
            ->orderBy('nombre')
            ->get();

        $editar = null;

        if ($request->filled('editar')) {
            $editar = Auth::user()
                ->estudiantes()
                ->findOrFail($request->input('editar'));
        }

        return view(
            'gestion.estudiantes.index',
            compact('estudiantes', 'grupos', 'editar', 'buscar')
        );
    }

    public function store(Request $request)
    {
        $datos = $this->validar($request);

        Auth::user()->estudiantes()->create([
            'grupo_id' => $datos['grupo_id'] ?? null,
            'nombres' => $datos['nombres'],
            'apellidos' => $datos['apellidos'],
            'codigo' => $datos['codigo'] ?? null,
            'activo' => $request->boolean('activo', true),
        ]);

        return redirect()
            ->route('estudiantes.index')
            ->with('status', 'Estudiante creado correctamente.');
    }

    public function update(Request $request, int $id)
    {
        $estudiante = Auth::user()
            ->estudiantes()
            ->findOrFail($id);

        $datos = $this->validar($request, $estudiante->id);

        $estudiante->update([
            'grupo_id' => $datos['grupo_id'] ?? null,
            'nombres' => $datos['nombres'],
            'apellidos' => $datos['apellidos'],
            'codigo' => $datos['codigo'] ?? null,
            'activo' => $request->boolean('activo'),
        ]);

        return redirect()
            ->route('estudiantes.index')
            ->with('status', 'Estudiante actualizado correctamente.');
    }

    public function destroy(int $id)
    {
        $estudiante = Auth::user()
            ->estudiantes()
            ->findOrFail($id);

        $estudiante->delete();

        return redirect()
            ->route('estudiantes.index')
            ->with('status', 'Estudiante eliminado correctamente.');
    }

    private function validar(Request $request, ?int $ignorarId = null): array
    {
        return $request->validate([
            'grupo_id' => [
                'nullable',
                'integer',
                Rule::exists('grupos', 'id')->where('user_id', Auth::id()),
            ],
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'codigo' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('estudiantes', 'codigo')
                    ->where('user_id', Auth::id())
                    ->ignore($ignorarId),
            ],
            'activo' => 'nullable|boolean',
        ]);
    }
}

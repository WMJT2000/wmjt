<?php

namespace App\Http\Controllers;

use App\Models\Manual;
use Illuminate\Http\Request;

class ManualController extends Controller
{
    // GET /api/manuals
    public function index()
    {
        $manuals = Manual::with('technology')
            ->withCount('sections')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $manuals
        ]);
    }


    // GET /api/manuals/{id}
    public function show($id)
    {
        $manual = Manual::with('technology')
            ->find($id);

        if (!$manual) {
            return response()->json([
                'success' => false,
                'message' => 'Manual no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $manual
        ]);
    }


    // POST /api/manuals
    public function store(Request $request)
    {
        $validated = $request->validate([
            'technology_id' => 'required|integer|exists:technologies,id',

            'title' => 'required|string|max:200',

            'slug' => 'nullable|string|max:200',

            'description' => 'nullable|string',

            'objective' => 'nullable|string',

            'difficulty' => 'nullable|string|max:30',

            'status' => 'nullable|string|max:30',
        ]);

        $manual = Manual::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Manual creado correctamente',
            'data' => $manual
        ], 201);
    }


    // PUT /api/manuals/{id}
    public function update(Request $request, $id)
    {
        $manual = Manual::find($id);

        if (!$manual) {
            return response()->json([
                'success' => false,
                'message' => 'Manual no encontrado'
            ], 404);
        }

        $validated = $request->validate([
            'technology_id' => 'sometimes|required|integer|exists:technologies,id',

            'title' => 'sometimes|required|string|max:200',

            'slug' => 'nullable|string|max:200',

            'description' => 'nullable|string',

            'objective' => 'nullable|string',

            'difficulty' => 'nullable|string|max:30',

            'status' => 'nullable|string|max:30',
        ]);

        $manual->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Manual actualizado correctamente',
            'data' => $manual
        ]);
    }


    // DELETE /api/manuals/{id}
    public function destroy($id)
    {
        $manual = Manual::find($id);

        if (!$manual) {
            return response()->json([
                'success' => false,
                'message' => 'Manual no encontrado'
            ], 404);
        }

        $manual->delete();

        return response()->json([
            'success' => true,
            'message' => 'Manual eliminado correctamente'
        ]);
    }


    // GET /api/manuals/{id}/sections
    public function sections($id)
    {
        $manual = Manual::find($id);

        if (!$manual) {
            return response()->json([
                'success' => false,
                'message' => 'Manual no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $manual->sections
        ]);
    }


    // GET /api/manuals/{id}/full
    public function full($id)
    {
        $manual = Manual::with([
            'technology',
            'sections.steps'
        ])->find($id);

        if (!$manual) {
            return response()->json([
                'success' => false,
                'message' => 'Manual no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $manual
        ]);
    }


    public function page()
    {
        $manuals = Manual::with('technology')
            ->withCount('sections')
            ->orderBy('id', 'asc')
            ->get();

        return view('gestion.manuals', compact('manuals'));
    }
}
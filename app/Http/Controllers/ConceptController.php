<?php

namespace App\Http\Controllers;

use App\Models\Concept;
use Illuminate\Http\Request;

class ConceptController extends Controller
{
    // GET /api/concepts
    public function index()
    {
        $concepts = Concept::with('category')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $concepts
        ]);
    }


    // GET /api/concepts/{id}
    public function show($id)
    {
        $concept = Concept::with('category')
            ->find($id);

        if (!$concept) {
            return response()->json([
                'success' => false,
                'message' => 'Concepto no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $concept
        ]);
    }


    // POST /api/concepts
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:150',
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'how_to_use' => 'nullable|string',
            'example' => 'nullable|string',
        ]);

        $concept = Concept::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Concepto creado correctamente',
            'data' => $concept
        ], 201);
    }


    // PUT /api/concepts/{id}
    public function update(Request $request, $id)
    {
        $concept = Concept::find($id);

        if (!$concept) {
            return response()->json([
                'success' => false,
                'message' => 'Concepto no encontrado'
            ], 404);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|required|integer|exists:categories,id',
            'name' => 'sometimes|required|string|max:150',
            'slug' => 'sometimes|required|string|max:150',
            'type' => 'sometimes|required|string|max:50',
            'description' => 'nullable|string',
            'how_to_use' => 'nullable|string',
            'example' => 'nullable|string',
        ]);

        $concept->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Concepto actualizado correctamente',
            'data' => $concept
        ]);
    }


    // DELETE /api/concepts/{id}
    public function destroy($id)
    {
        $concept = Concept::find($id);

        if (!$concept) {
            return response()->json([
                'success' => false,
                'message' => 'Concepto no encontrado'
            ], 404);
        }

        $concept->delete();

        return response()->json([
            'success' => true,
            'message' => 'Concepto eliminado correctamente'
        ]);
    }
}
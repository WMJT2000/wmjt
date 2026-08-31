<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use Illuminate\Http\Request;

class TechnologyController extends Controller
{
    // GET /api/technologies
    public function index()
    {
        $technologies = Technology::orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $technologies
        ]);
    }


    // GET /api/technologies/{id}
    public function show($id)
    {
        $technology = Technology::find($id);

        if (!$technology) {
            return response()->json([
                'success' => false,
                'message' => 'Tecnología no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $technology
        ]);
    }


    // POST /api/technologies
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $technology = Technology::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tecnología creada correctamente',
            'data' => $technology
        ], 201);
    }


    // PUT /api/technologies/{id}
    public function update(Request $request, $id)
    {
        $technology = Technology::find($id);

        if (!$technology) {
            return response()->json([
                'success' => false,
                'message' => 'Tecnología no encontrada'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $technology->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tecnología actualizada correctamente',
            'data' => $technology
        ]);
    }


    // DELETE /api/technologies/{id}
    public function destroy($id)
    {
        $technology = Technology::find($id);

        if (!$technology) {
            return response()->json([
                'success' => false,
                'message' => 'Tecnología no encontrada'
            ], 404);
        }

        $technology->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tecnología eliminada correctamente......'
        ]);
    }


    // GET /api/technologies/{id}/categories
    public function categories($id)
    {
        $technology = Technology::find($id);

        if (!$technology) {
            return response()->json([
                'success' => false,
                'message' => 'Tecnología no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $technology->categories
        ]);
    }


    // GET /api/technologies/{id}/full
    public function full($id)
    {
        $technology = Technology::with(
            'categories.concepts'
        )->find($id);

        if (!$technology) {
            return response()->json([
                'success' => false,
                'message' => 'Tecnología no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $technology
        ]);
    }
}
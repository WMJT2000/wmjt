<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        $categories = Category::with('technology')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }


    // GET /api/categories/{id}
    public function show($id)
    {
        $category = Category::with('technology')
            ->find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }


    // POST /api/categories
    public function store(Request $request)
    {
        $validated = $request->validate([
            'technology_id' => 'required|integer|exists:technologies,id',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada correctamente',
            'data' => $category
        ], 201);
    }


    // PUT /api/categories/{id}
    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        }

        $validated = $request->validate([
            'technology_id' => 'sometimes|required|integer|exists:technologies,id',
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Categoría actualizada correctamente',
            'data' => $category
        ]);
    }


    // DELETE /api/categories/{id}
    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoría eliminada correctamente'
        ]);
    }


    // GET /api/categories/{id}/concepts
    public function concepts($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Categoría no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category->concepts
        ]);
    }
}
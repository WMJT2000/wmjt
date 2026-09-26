<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Technology;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function page()
    {
        $categories = Category::with('technology')
            ->orderBy('id', 'asc')
            ->get();

        return view('gestion.categories', compact('categories'));
    }

    public function categories(int $technologyId)
    {
        $technology = Technology::findOrFail($technologyId);

        return view('gestion.categories', [
            'technology' => $technology
        ]);
    }

    public function index(Request $request)
    {
        $query = Category::with('technology')
            ->orderBy('id', 'asc');

        if ($request->filled('technology_id')) {
            $query->where(
                'technology_id',
                $request->integer('technology_id')
            );
        }

        $categories = $query->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

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

<?php

namespace App\Http\Controllers;

use App\Models\Concept;
use App\Models\Category;
use Illuminate\Http\Request;

class ConceptController extends Controller
{
    public function page()
    {
        $concepts = Concept::with([
            'category',
            'category.technology'
        ])
            ->orderBy('id', 'asc')
            ->get();

        return view('gestion.concepts', compact('concepts'));
    }

    public function concepts(int $categoryId)
    {
        $category = Category::findOrFail($categoryId);

        return view('gestion.concepts', [
            'category' => $category
        ]);
    }

    public function index(Request $request)
    {
        $query = Concept::with([
            'category',
            'category.technology'
        ])
            ->orderBy('id', 'asc');

        if ($request->filled('category_id')) {
            $query->where(
                'category_id',
                $request->integer('category_id')
            );
        }

        $concepts = $query->get();

        return response()->json([
            'success' => true,
            'data' => $concepts
        ]);
    }

    public function show($id)
    {
        $concept = Concept::with([
            'category',
            'category.technology'
        ])
            ->find($id);

        if (!$concept) {
            return response()->json([
                'success' => false,
                'message' => 'Concepto no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $concept->id,
                'category_id' =>
                $concept->category_id,
                'technology_id' =>
                $concept->category->technology_id,
                'name' =>
                $concept->name,
                'slug' =>
                $concept->slug,
                'type' =>
                $concept->type,
                'description' =>
                $concept->description,
                'how_to_use' =>
                $concept->how_to_use,
                'example' =>
                $concept->example,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' =>
            'required|integer|exists:categories,id',
            'name' =>
            'required|string|max:150',
            'slug' =>
            'required|string|max:150',
            'type' =>
            'required|string|max:50',
            'description' =>
            'nullable|string',
            'how_to_use' =>
            'nullable|string',
            'example' =>
            'nullable|string',
        ]);

        $concept = Concept::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Concepto creado correctamente',
            'data' => $concept
        ], 201);
    }

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
            'category_id' =>
            'sometimes|required|integer|exists:categories,id',
            'name' =>
            'sometimes|required|string|max:150',
            'slug' =>
            'sometimes|required|string|max:150',
            'type' =>
            'sometimes|required|string|max:50',
            'description' =>
            'nullable|string',
            'how_to_use' =>
            'nullable|string',
            'example' =>
            'nullable|string',
        ]);

        $concept->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Concepto actualizado correctamente',
            'data' => $concept
        ]);
    }

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

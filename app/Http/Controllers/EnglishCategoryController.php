<?php

namespace App\Http\Controllers;

use App\Models\EnglishCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EnglishCategoryController extends Controller
{
    public function page(): View
    {
        return view('gestion.english-categories');
    }

    public function index(): JsonResponse
    {
        return response()->json(
            EnglishCategory::orderBy('id', 'desc')->get()
        );
    }

    public function show(int $id): JsonResponse
    {
        $category = EnglishCategory::findOrFail($id);

        return response()->json($category);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $category = EnglishCategory::create($validated);

        return response()->json(
            $category,
            201
        );
    }

    public function update(
        Request $request,
        int $id
    ): JsonResponse {

        $category = EnglishCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],

            'description' => [
                'nullable',
                'string',
            ],
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = EnglishCategory::findOrFail($id);

        $category->delete();

        return response()->json([
            'message' => 'Categoría eliminada correctamente.',
        ]);
    }
}
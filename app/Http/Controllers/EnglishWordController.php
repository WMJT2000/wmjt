<?php

namespace App\Http\Controllers;

use App\Models\EnglishCategory;
use App\Models\EnglishWord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EnglishWordController extends Controller
{
    public function page(): View
    {
        return view('gestion.english-words');
    }

    public function index(): JsonResponse
    {
        $words = EnglishWord::with('category')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($words);
    }

    public function show(int $id): JsonResponse
    {
        $word = EnglishWord::with('category')
            ->findOrFail($id);

        return response()->json($word);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'english_category_id' => [
                'required',
                'integer',
                'exists:english_categories,id',
            ],

            'word' => [
                'required',
                'string',
                'max:100',
            ],

                 'pronunciation_guide' => [
                'required',
                'string',
                'max:100',
            ],

            'example' => [
                'nullable',
                'string',
            ],

            'example_translation' => [
                'nullable',
                'string',
            ],
        ]);

        $word = EnglishWord::create($validated);

        $word->load('category');

        return response()->json(
            $word,
            201
        );
    }

    public function update(
        Request $request,
        int $id
    ): JsonResponse {

        $word = EnglishWord::findOrFail($id);

        $validated = $request->validate([
            'english_category_id' => [
                'required',
                'integer',
                'exists:english_categories,id',
            ],

            'word' => [
                'required',
                'string',
                'max:100',
            ],

              'pronunciation_guide' => [
                'required',
                'string',
                'max:100',
            ],

            'example' => [
                'nullable',
                'string',
            ],

            'example_translation' => [
                'nullable',
                'string',
            ],
        ]);

        $word->update($validated);

        $word->load('category');

        return response()->json($word);
    }

    public function destroy(int $id): JsonResponse
    {
        $word = EnglishWord::findOrFail($id);

        $word->delete();

        return response()->json([
            'message' => 'Palabra eliminada correctamente.',
        ]);
    }

    public function categories(): JsonResponse
    {
        return response()->json(
            EnglishCategory::orderBy('name')->get()
        );
    }
}
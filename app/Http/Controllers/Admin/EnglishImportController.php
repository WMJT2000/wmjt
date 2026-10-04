<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnglishImportRequest;
use App\Models\EnglishCategory;
use App\Models\EnglishMeaning;
use App\Models\EnglishWord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnglishImportController extends Controller
{
    public function index()
    {
        $categories = EnglishCategory::orderBy('name')->get();

        return view('admin.english.import-word', compact('categories'));
    }

    public function getWords(EnglishCategory $category): JsonResponse
    {
        $words = $category->words()
            ->orderBy('word')
            ->get([
                'id',
                'word',
            ]);

        return response()->json([
            'success' => true,
            'data' => $words,
        ]);
    }

    public function importComplete(EnglishImportRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (empty($data['category'])) {
            return response()->json([
                'success' => false,
                'message' => 'La categoría es obligatoria para una importación completa.',
            ], 422);
        }

        if (empty($data['words'])) {
            return response()->json([
                'success' => false,
                'message' => 'Debe existir al menos una palabra.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $category = EnglishCategory::create([
                'name' => $data['category']['name'],
                'description' => $data['category']['description'] ?? null,
            ]);

            $wordCount = 0;
            $meaningCount = 0;

            foreach ($data['words'] as $wordData) {
                $word = $category->words()->create([
                    'word' => $wordData['word'],
                    'pronunciation_guide' => $wordData['pronunciation_guide'] ?? null,
                    'example' => $wordData['example'] ?? null,
                    'example_translation' => $wordData['example_translation'] ?? null,
                ]);

                $wordCount++;

                foreach ($wordData['meanings'] ?? [] as $meaningData) {
                    $word->meanings()->create([
                        'meaning' => $meaningData['meaning'],
                    ]);

                    $meaningCount++;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Importación completa realizada correctamente.',
                'data' => [
                    'category' => $category,
                    'words_count' => $wordCount,
                    'meanings_count' => $meaningCount,
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error durante la importación.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function importWords(
        EnglishImportRequest $request,
        EnglishCategory $category
    ): JsonResponse {
        $data = $request->validated();

        if (empty($data['words'])) {
            return response()->json([
                'success' => false,
                'message' => 'Debe existir al menos una palabra.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $wordCount = 0;
            $meaningCount = 0;

            foreach ($data['words'] as $wordData) {
                $word = $category->words()->create([
                    'word' => $wordData['word'],
                    'pronunciation_guide' => $wordData['pronunciation_guide'] ?? null,
                    'example' => $wordData['example'] ?? null,
                    'example_translation' => $wordData['example_translation'] ?? null,
                ]);

                $wordCount++;

                foreach ($wordData['meanings'] ?? [] as $meaningData) {
                    $word->meanings()->create([
                        'meaning' => $meaningData['meaning'],
                    ]);

                    $meaningCount++;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Palabras importadas correctamente.',
                'data' => [
                    'category' => $category,
                    'words_count' => $wordCount,
                    'meanings_count' => $meaningCount,
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error durante la importación.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function importWord(
        EnglishImportRequest $request,
        EnglishCategory $category
    ): JsonResponse {
        $data = $request->validated();

        if (empty($data['word'])) {
            return response()->json([
                'success' => false,
                'message' => 'La palabra es obligatoria.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $wordData = $data['word'];

            $word = $category->words()->create([
                'word' => $wordData['word'],
                'pronunciation_guide' => $wordData['pronunciation_guide'] ?? null,
                'example' => $wordData['example'] ?? null,
                'example_translation' => $wordData['example_translation'] ?? null,
            ]);

            $meaningCount = 0;

            foreach ($wordData['meanings'] ?? [] as $meaningData) {
                $word->meanings()->create([
                    'meaning' => $meaningData['meaning'],
                ]);

                $meaningCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Palabra importada correctamente.',
                'data' => [
                    'category' => $category,
                    'word' => $word,
                    'meanings_count' => $meaningCount,
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error durante la importación.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function importMeanings(
        EnglishImportRequest $request,
        EnglishWord $word
    ): JsonResponse {
        $data = $request->validated();

        if (empty($data['meanings'])) {
            return response()->json([
                'success' => false,
                'message' => 'Debe existir al menos un significado.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $meaningCount = 0;

            foreach ($data['meanings'] as $meaningData) {
                $word->meanings()->create([
                    'meaning' => $meaningData['meaning'],
                ]);

                $meaningCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Significados importados correctamente.',
                'data' => [
                    'word' => $word,
                    'meanings_count' => $meaningCount,
                ],
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error durante la importación.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
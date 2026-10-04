<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\GrammarImportRequest;
use App\Models\GrammarCategory;
use App\Models\GrammarLesson;
use App\Models\GrammarTopic;
use App\Services\GrammarImportService;
use Illuminate\Http\JsonResponse;

class GrammarImportController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | PANTALLA PRINCIPAL
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $categories = GrammarCategory::query()
            ->where('status', 1)
            ->orderBy('level')
            ->orderBy('sort_order')
            ->get();

        return view(
            'admin.grammar.import',
            compact('categories')
        );
    }


    /*
    |--------------------------------------------------------------------------
    | LISTAR TOPICS DE UNA CATEGORÍA
    |--------------------------------------------------------------------------
    |
    | Se utiliza desde JavaScript para llenar el selector
    | cuando queremos importar:
    |
    | - Lessons
    | - Una Lesson
    |
    */

    public function topicsList(
        GrammarCategory $category
    ): JsonResponse {

        $topics = GrammarTopic::query()
            ->where(
                'category_id',
                $category->id
            )
            ->where(
                'status',
                1
            )
            ->orderBy(
                'sort_order'
            )
            ->get([
                'id',
                'name',
                'level',
            ]);

        return response()->json([
            'success' => true,
            'data' => $topics,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | LISTAR LESSONS DE UNA CATEGORÍA
    |--------------------------------------------------------------------------
    |
    | Se utiliza desde JavaScript para llenar el selector
    | cuando queremos importar:
    |
    | - Rules
    | - Examples
    |
    */

    public function lessonsList(
        GrammarCategory $category
    ): JsonResponse {

        $lessons = GrammarLesson::query()
            ->whereHas(
                'topic',
                function ($query) use ($category) {

                    $query->where(
                        'category_id',
                        $category->id
                    );

                }
            )
            ->orderBy(
                'topic_id'
            )
            ->orderBy(
                'sort_order'
            )
            ->get([
                'id',
                'topic_id',
                'title',
            ]);

        return response()->json([
            'success' => true,
            'data' => $lessons,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | IMPORTACIÓN COMPLETA
    |--------------------------------------------------------------------------
    */

    public function store(
        GrammarImportRequest $request,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->import(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' =>
                'La importación se completó correctamente.',
            'data' => $result,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | IMPORTAR TOPICS
    |--------------------------------------------------------------------------
    */

    public function topics(
        GrammarImportRequest $request,
        GrammarCategory $category,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importTopics(
            $category,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' =>
                'Los topics se importaron correctamente.',
            'data' => $result,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | IMPORTAR LESSONS
    |--------------------------------------------------------------------------
    */

    public function lessons(
        GrammarImportRequest $request,
        GrammarTopic $topic,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importLessons(
            $topic,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' =>
                'Las lessons se importaron correctamente.',
            'data' => $result,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | IMPORTAR UNA LESSON COMPLETA
    |--------------------------------------------------------------------------
    */

    public function lesson(
        GrammarImportRequest $request,
        GrammarTopic $topic,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importLesson(
            $topic,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' =>
                'La lesson se importó correctamente.',
            'data' => $result,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | IMPORTAR RULES
    |--------------------------------------------------------------------------
    */

    public function rules(
        GrammarImportRequest $request,
        GrammarLesson $lesson,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importRules(
            $lesson,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' =>
                'Las reglas se importaron correctamente.',
            'data' => $result,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | IMPORTAR EXAMPLES
    |--------------------------------------------------------------------------
    */

    public function examples(
        GrammarImportRequest $request,
        GrammarLesson $lesson,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importExamples(
            $lesson,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' =>
                'Los ejemplos se importaron correctamente.',
            'data' => $result,
        ]);
    }
}
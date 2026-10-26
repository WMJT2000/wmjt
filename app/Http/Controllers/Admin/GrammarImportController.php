<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\GrammarImportRequest;
use App\Models\GrammarCategory;
use App\Models\GrammarExercise;
use App\Models\GrammarLesson;
use App\Models\GrammarTopic;
use App\Services\GrammarImportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            ->withCount([
                'topics',
                'lessons',
            ])
            ->orderBy('id')
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
            ->withCount('lessons')
            ->orderBy('id')
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
    | VALIDAR TOPICS POR NOMBRE
    |--------------------------------------------------------------------------
    |
    | Comprueba que los nombres de Topic enviados existan dentro
    | de la categoría seleccionada.
    |
    */

    public function validateTopicsByName(
        Request $request,
        GrammarCategory $category
    ): JsonResponse {

        $validated = $request->validate([
            'names' => [
                'required',
                'array',
                'min:1',
            ],
            'names.*' => [
                'required',
                'string',
                'max:150',
            ],
        ]);

        $requestedNames = collect($validated['names'])
            ->map(
                fn ($name) => trim((string) $name)
            )
            ->filter()
            ->unique(
                fn ($name) => mb_strtolower($name)
            )
            ->values();

        $topics = GrammarTopic::query()
            ->where(
                'category_id',
                $category->id
            )
            ->whereIn(
                'name',
                $requestedNames->all()
            )
            ->get([
                'id',
                'name',
            ]);

        $foundNames = $topics
            ->pluck('name')
            ->map(
                fn ($name) => mb_strtolower(
                    trim((string) $name)
                )
            )
            ->all();

        $missing = $requestedNames
            ->reject(
                fn ($name) => in_array(
                    mb_strtolower($name),
                    $foundNames,
                    true
                )
            )
            ->values()
            ->all();

        return response()->json([
            'success' => true,
            'data' => [
                'found' => $topics,
                'missing' => $missing,
            ],
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
            ->orderBy('id')
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
    | LISTAR EXERCISES DE UNA CATEGORÍA
    |--------------------------------------------------------------------------
    |
    | Se utiliza desde JavaScript para llenar el selector
    | cuando queremos importar:
    |
    | - Options
    |
    */

    public function exercisesList(
        GrammarCategory $category
    ): JsonResponse {

        $exercises = GrammarExercise::query()
            ->whereHas(
                'topic',
                function ($query) use ($category) {

                    $query->where(
                        'category_id',
                        $category->id
                    );

                }
            )
            ->with('topic:id,name')
            ->orderBy('id')
            ->get([
                'id',
                'topic_id',
                'type',
                'question',
            ]);

        return response()->json([
            'success' => true,
            'data' => $exercises,
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
            'message' => 'La importación se completó correctamente.',
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
            'message' => 'Los topics se importaron correctamente.',
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
            'message' => 'Las lessons se importaron correctamente.',
            'data' => $result,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR LESSONS EN VARIOS TOPICS (POR NOMBRE)
    |--------------------------------------------------------------------------
    |
    | El JSON incluye lecciones con el campo "topic" (o "topic_name").
    | Cada Topic se busca por nombre dentro de la categoría.
    |
    */

    public function lessonsByTopic(
        GrammarImportRequest $request,
        GrammarCategory $category,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importLessonsByTopic(
            $category,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Las lessons se importaron correctamente.',
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
            'message' => 'La lesson se importó correctamente.',
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
            'message' => 'Las reglas se importaron correctamente.',
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
            'message' => 'Los ejemplos se importaron correctamente.',
            'data' => $result,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR EXERCISES
    |--------------------------------------------------------------------------
    */

    public function exercises(
        GrammarImportRequest $request,
        GrammarTopic $topic,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importExercises(
            $topic,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Los exercises se importaron correctamente.',
            'data' => $result,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR EXERCISES EN VARIOS TOPICS (POR NOMBRE)
    |--------------------------------------------------------------------------
    |
    | Cada exercise del JSON indica el nombre del Topic al que pertenece.
    | El Topic se busca dentro de la categoría seleccionada.
    |
    */

    public function exercisesByTopic(
        GrammarImportRequest $request,
        GrammarCategory $category,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importExercisesByTopic(
            $category,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Los exercises se importaron correctamente.',
            'data' => $result,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR UN EXERCISE COMPLETO
    |--------------------------------------------------------------------------
    */

    public function exercise(
        GrammarImportRequest $request,
        GrammarTopic $topic,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importExercise(
            $topic,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'El exercise se importó correctamente.',
            'data' => $result,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR OPTIONS
    |--------------------------------------------------------------------------
    */

    public function options(
        GrammarImportRequest $request,
        GrammarExercise $exercise,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->importOptions(
            $exercise,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Las opciones se importaron correctamente.',
            'data' => $result,
        ]);
    }
}

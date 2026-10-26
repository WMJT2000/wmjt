<?php

namespace App\Services;

use App\Models\ExerciseOption;
use App\Models\GrammarCategory;
use App\Models\GrammarExample;
use App\Models\GrammarExercise;
use App\Models\GrammarLesson;
use App\Models\GrammarRule;
use App\Models\GrammarTopic;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GrammarImportService
{
    /*
    |--------------------------------------------------------------------------
    | IMPORTACIÓN COMPLETA
    |--------------------------------------------------------------------------
    |
    | JSON de una categoría:
    |
    | {
    |     "category": {},
    |     "topics": [
    |         {
    |             "lessons": [
    |                 {
    |                     "rules": [],
    |                     "examples": []
    |                 }
    |             ]
    |         }
    |     ]
    | }
    |
    | JSON de varias categorías:
    |
    | {
    |     "categories": [
    |         {
    |             "category": {},
    |             "topics": []
    |         },
    |         {
    |             "category": {},
    |             "topics": []
    |         }
    |     ]
    | }
    |
    | Cada elemento de "categories" también puede incluir los datos
    | de la categoría directamente, sin el objeto "category":
    |
    | {
    |     "categories": [
    |         {
    |             "name": "...",
    |             "level": "...",
    |             "sort_order": 1,
    |             "status": 1,
    |             "topics": []
    |         }
    |     ]
    | }
    |
    |--------------------------------------------------------------------------
    */

    public function import(array $data): array
    {
        return DB::transaction(function () use ($data) {

            if (
                array_key_exists(
                    'categories',
                    $data
                )
            ) {

                return $this->importMultipleCategories(
                    $data['categories']
                );

            }

            return $this->createCategoryComplete(
                $data
            );
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR VARIAS CATEGORÍAS
    |--------------------------------------------------------------------------
    */

    private function importMultipleCategories(
        array $categories
    ): array {

        $categoryResults = [];

        $topicsCount = 0;
        $lessonsCount = 0;
        $rulesCount = 0;
        $examplesCount = 0;
        $exercisesCount = 0;
        $optionsCount = 0;

        foreach (
            $categories as $item
        ) {

            $payload = $item;

            /*
            |--------------------------------------------------------------------------
            | Datos de la categoría
            |--------------------------------------------------------------------------
            |
            | Soporta:
            |
            | { "category": {}, "topics": [] }
            |
            | y también:
            |
            | { "name": "...", "topics": [] }
            |
            */

            if (
                isset($item['category']) &&
                is_array($item['category'])
            ) {

                $payload = array_merge(
                    $item['category'],
                    [
                        'topics' => $item['topics'] ?? [],
                    ]
                );

            }

            $result = $this->createCategoryComplete(
                $payload
            );

            $categoryResults[] = $result;

            $topicsCount += $result['topics'];
            $lessonsCount += $result['lessons'];
            $rulesCount += $result['rules'];
            $examplesCount += $result['examples'];
            $exercisesCount += $result['exercises'];
            $optionsCount += $result['options'];
        }

        return [

            'categories' => count($categoryResults),

            'category_list' => $categoryResults,

            'topics' => $topicsCount,

            'lessons' => $lessonsCount,

            'rules' => $rulesCount,

            'examples' => $examplesCount,

            'exercises' => $exercisesCount,

            'options' => $optionsCount,

        ];
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR CATEGORÍA COMPLETA
    |--------------------------------------------------------------------------
    */

    private function createCategoryComplete(
        array $data
    ): array {

        /*
        |--------------------------------------------------------------------------
        | CATEGORY
        |--------------------------------------------------------------------------
        */

        $categoryData =
            isset($data['category']) &&
            is_array($data['category'])
                ? $data['category']
                : $data;

        $category = GrammarCategory::create([

            'name' => $categoryData['name'],

            'description' => $categoryData['description'] ?? null,

            'level' => $categoryData['level'],

            'sort_order' => $categoryData['sort_order'],

            'status' => $categoryData['status'],

        ]);

        $topicsCount = 0;
        $lessonsCount = 0;
        $rulesCount = 0;
        $examplesCount = 0;
        $exercisesCount = 0;
        $optionsCount = 0;

        /*
        |--------------------------------------------------------------------------
        | TOPICS
        |--------------------------------------------------------------------------
        */

        foreach (
            $data['topics'] ?? [] as $topicData
        ) {

            $topic = $this->createTopic(
                $category,
                $topicData
            );

            $topicsCount++;

            /*
            |--------------------------------------------------------------------------
            | LESSONS DEL TOPIC
            |--------------------------------------------------------------------------
            */

            foreach (
                $topicData['lessons'] ?? [] as $lessonData
            ) {

                $result = $this->createLessonComplete(
                    $topic,
                    $lessonData
                );

                $lessonsCount += $result['lessons'];
                $rulesCount += $result['rules'];
                $examplesCount += $result['examples'];
            }

            /*
            |--------------------------------------------------------------------------
            | EXERCISES DEL TOPIC
            |--------------------------------------------------------------------------
            */

            $exerciseResult = $this->createExercises(
                $topic,
                $topicData['exercises'] ?? []
            );

            $exercisesCount += $exerciseResult['exercises'];
            $optionsCount += $exerciseResult['options'];
        }

        return [

            'category_id' => $category->id,

            'category' => $category->name,

            'topics' => $topicsCount,

            'lessons' => $lessonsCount,

            'rules' => $rulesCount,

            'examples' => $examplesCount,

            'exercises' => $exercisesCount,

            'options' => $optionsCount,

        ];
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR TOPICS EN CATEGORÍA EXISTENTE
    |--------------------------------------------------------------------------
    |
    | AHORA:
    |
    | topics
    |   └── lessons
    |       ├── rules
    |       └── examples
    |
    |--------------------------------------------------------------------------
    */

    public function importTopics(
        GrammarCategory $category,
        array $data
    ): array {

        return DB::transaction(function () use (
            $category,
            $data
        ) {

            $topicsCount = 0;
            $lessonsCount = 0;
            $rulesCount = 0;
            $examplesCount = 0;
            $exercisesCount = 0;
            $optionsCount = 0;

            foreach (
                $data['topics'] as $topicData
            ) {

                /*
                |--------------------------------------------------------------------------
                | CREAR TOPIC
                |--------------------------------------------------------------------------
                */

                $topic = $this->createTopic(
                    $category,
                    $topicData
                );

                $topicsCount++;

                /*
                |--------------------------------------------------------------------------
                | CREAR LESSONS DEL TOPIC
                |--------------------------------------------------------------------------
                */

                foreach (
                    $topicData['lessons'] ?? [] as $lessonData
                ) {

                    $result = $this->createLessonComplete(
                        $topic,
                        $lessonData
                    );

                    $lessonsCount += $result['lessons'];
                    $rulesCount += $result['rules'];
                    $examplesCount += $result['examples'];
                }

                /*
                |--------------------------------------------------------------------------
                | CREAR EXERCISES DEL TOPIC
                |--------------------------------------------------------------------------
                */

                $exerciseResult = $this->createExercises(
                    $topic,
                    $topicData['exercises'] ?? []
                );

                $exercisesCount += $exerciseResult['exercises'];
                $optionsCount += $exerciseResult['options'];
            }

            return [

                'category_id' => $category->id,

                'category' => $category->name,

                'topics' => $topicsCount,

                'lessons' => $lessonsCount,

                'rules' => $rulesCount,

                'examples' => $examplesCount,

                'exercises' => $exercisesCount,

                'options' => $optionsCount,

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR LESSONS EN TOPIC EXISTENTE
    |--------------------------------------------------------------------------
    |
    | AHORA:
    |
    | lessons
    |   ├── rules
    |   └── examples
    |
    |--------------------------------------------------------------------------
    */

    public function importLessons(
        GrammarTopic $topic,
        array $data
    ): array {

        return DB::transaction(function () use (
            $topic,
            $data
        ) {

            $lessonsCount = 0;
            $rulesCount = 0;
            $examplesCount = 0;

            foreach (
                $data['lessons'] as $lessonData
            ) {

                $result = $this->createLessonComplete(
                    $topic,
                    $lessonData
                );

                $lessonsCount += $result['lessons'];
                $rulesCount += $result['rules'];
                $examplesCount += $result['examples'];
            }

            return [

                'topic_id' => $topic->id,

                'topic' => $topic->name,

                'lessons' => $lessonsCount,

                'rules' => $rulesCount,

                'examples' => $examplesCount,

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR LESSONS EN VARIOS TOPICS (POR NOMBRE)
    |--------------------------------------------------------------------------
    |
    | JSON:
    |
    | {
    |     "lessons": [
    |         {
    |             "topic": "Nombre del Topic",
    |             "title": "...",
    |             "rules": [],
    |             "examples": []
    |         }
    |     ]
    | }
    |
    | También acepta "topic_name" en lugar de "topic".
    | El Topic se busca por nombre dentro de la categoría.
    |
    |--------------------------------------------------------------------------
    */

    public function importLessonsByTopic(
        GrammarCategory $category,
        array $data
    ): array {

        return DB::transaction(function () use (
            $category,
            $data
        ) {

            $lessonsCount = 0;
            $rulesCount = 0;
            $examplesCount = 0;

            $topicsCache = [];
            $topicResults = [];

            foreach (
                $data['lessons'] as $index => $lessonData
            ) {

                $topicName = trim(
                    (string) (
                        $lessonData['topic'] ??
                        $lessonData['topic_name'] ??
                        ''
                    )
                );

                if ($topicName === '') {

                    throw ValidationException::withMessages([
                        "lessons.{$index}.topic" => 'Indica el nombre del Topic para esta lesson.',
                    ]);
                }

                $cacheKey = mb_strtolower($topicName);

                if (
                    ! isset($topicsCache[$cacheKey])
                ) {

                    $topic = GrammarTopic::query()
                        ->where(
                            'category_id',
                            $category->id
                        )
                        ->where(
                            'name',
                            $topicName
                        )
                        ->first();

                    if (! $topic) {

                        throw ValidationException::withMessages([
                            "lessons.{$index}.topic" => "No existe un Topic llamado \"{$topicName}\" en la categoría \"{$category->name}\".",
                        ]);
                    }

                    $topicsCache[$cacheKey] = $topic;
                }

                $topic = $topicsCache[$cacheKey];

                $result = $this->createLessonComplete(
                    $topic,
                    $lessonData
                );

                $lessonsCount += $result['lessons'];
                $rulesCount += $result['rules'];
                $examplesCount += $result['examples'];

                if (! isset($topicResults[$topic->id])) {

                    $topicResults[$topic->id] = [
                        'topic_id' => $topic->id,
                        'topic' => $topic->name,
                        'lessons' => 0,
                        'rules' => 0,
                        'examples' => 0,
                    ];
                }

                $topicResults[$topic->id]['lessons'] += $result['lessons'];
                $topicResults[$topic->id]['rules'] += $result['rules'];
                $topicResults[$topic->id]['examples'] += $result['examples'];
            }

            return [

                'category_id' => $category->id,

                'category' => $category->name,

                'topics' => count($topicResults),

                'topic_list' => array_values($topicResults),

                'lessons' => $lessonsCount,

                'rules' => $rulesCount,

                'examples' => $examplesCount,

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR UNA LESSON COMPLETA
    |--------------------------------------------------------------------------
    |
    | JSON:
    |
    | {
    |     "lesson": {
    |         ...
    |         "rules": [],
    |         "examples": []
    |     }
    | }
    |
    |--------------------------------------------------------------------------
    */

    public function importLesson(
        GrammarTopic $topic,
        array $data
    ): array {

        return DB::transaction(function () use (
            $topic,
            $data
        ) {

            $lessonData =
                $data['lesson'];

            $result = $this->createLessonComplete(
                $topic,
                $lessonData
            );

            return [

                'topic_id' => $topic->id,

                'topic' => $topic->name,

                'lesson_id' => $result['lesson']->id,

                'lesson' => $result['lesson']->title,

                'rules' => $result['rules'],

                'examples' => $result['examples'],

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR RULES
    |--------------------------------------------------------------------------
    */

    public function importRules(
        GrammarLesson $lesson,
        array $data
    ): array {

        return DB::transaction(function () use (
            $lesson,
            $data
        ) {

            $rulesCount = 0;

            foreach (
                $data['rules'] as $ruleData
            ) {

                $this->createRule(
                    $lesson,
                    $ruleData
                );

                $rulesCount++;
            }

            return [

                'lesson_id' => $lesson->id,

                'lesson' => $lesson->title,

                'rules' => $rulesCount,

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR EXAMPLES
    |--------------------------------------------------------------------------
    */

    public function importExamples(
        GrammarLesson $lesson,
        array $data
    ): array {

        return DB::transaction(function () use (
            $lesson,
            $data
        ) {

            $examplesCount = 0;

            foreach (
                $data['examples'] as $exampleData
            ) {

                $this->createExample(
                    $lesson,
                    $exampleData
                );

                $examplesCount++;
            }

            return [

                'lesson_id' => $lesson->id,

                'lesson' => $lesson->title,

                'examples' => $examplesCount,

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR EXERCISES
    |--------------------------------------------------------------------------
    */

    public function importExercises(
        GrammarTopic $topic,
        array $data
    ): array {

        return DB::transaction(function () use (
            $topic,
            $data
        ) {

            $result = $this->createExercises(
                $topic,
                $data['exercises']
            );

            return [

                'topic_id' => $topic->id,

                'topic' => $topic->name,

                'exercises' => $result['exercises'],

                'options' => $result['options'],

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR EXERCISES EN VARIOS TOPICS (POR NOMBRE)
    |--------------------------------------------------------------------------
    |
    | JSON:
    |
    | {
    |     "exercises": [
    |         {
    |             "topic": "Nombre del Topic",
    |             "type": "multiple_choice",
    |             "question": "...",
    |             "options": []
    |         }
    |     ]
    | }
    |
    | También acepta "topic_name" en lugar de "topic".
    | El Topic se busca por nombre dentro de la categoría.
    |
    |--------------------------------------------------------------------------
    */

    public function importExercisesByTopic(
        GrammarCategory $category,
        array $data
    ): array {

        return DB::transaction(function () use (
            $category,
            $data
        ) {

            $exercisesCount = 0;
            $optionsCount = 0;

            $topicsCache = [];
            $topicResults = [];

            foreach (
                $data['exercises'] as $index => $exerciseData
            ) {

                $topicName = trim(
                    (string) (
                        $exerciseData['topic'] ??
                        $exerciseData['topic_name'] ??
                        ''
                    )
                );

                if ($topicName === '') {

                    throw ValidationException::withMessages([
                        "exercises.{$index}.topic" => 'Indica el nombre del Topic para este exercise.',
                    ]);
                }

                $cacheKey = mb_strtolower($topicName);

                if (
                    ! isset($topicsCache[$cacheKey])
                ) {

                    $topic = GrammarTopic::query()
                        ->where(
                            'category_id',
                            $category->id
                        )
                        ->where(
                            'name',
                            $topicName
                        )
                        ->first();

                    if (! $topic) {

                        throw ValidationException::withMessages([
                            "exercises.{$index}.topic" => "No existe un Topic llamado \"{$topicName}\" en la categoría \"{$category->name}\".",
                        ]);
                    }

                    $topicsCache[$cacheKey] = $topic;
                }

                $topic = $topicsCache[$cacheKey];

                $result = $this->createExerciseComplete(
                    $topic,
                    $exerciseData
                );

                $exercisesCount++;

                $optionsCount += $result['options'];

                if (! isset($topicResults[$topic->id])) {

                    $topicResults[$topic->id] = [
                        'topic_id' => $topic->id,
                        'topic' => $topic->name,
                        'exercises' => 0,
                        'options' => 0,
                    ];
                }

                $topicResults[$topic->id]['exercises']++;
                $topicResults[$topic->id]['options'] += $result['options'];
            }

            return [

                'category_id' => $category->id,

                'category' => $category->name,

                'topics' => count($topicResults),

                'topic_list' => array_values($topicResults),

                'exercises' => $exercisesCount,

                'options' => $optionsCount,

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR UN EXERCISE COMPLETO
    |--------------------------------------------------------------------------
    |
    | JSON:
    |
    | {
    |     "exercise": {
    |         ...
    |         "options": []
    |     }
    | }
    |
    |--------------------------------------------------------------------------
    */

    public function importExercise(
        GrammarTopic $topic,
        array $data
    ): array {

        return DB::transaction(function () use (
            $topic,
            $data
        ) {

            $result = $this->createExerciseComplete(
                $topic,
                $data['exercise']
            );

            return [

                'topic_id' => $topic->id,

                'topic' => $topic->name,

                'exercise_id' => $result['exercise']->id,

                'exercise' => $result['exercise']->question,

                'options' => $result['options'],

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTAR OPTIONS
    |--------------------------------------------------------------------------
    */

    public function importOptions(
        GrammarExercise $exercise,
        array $data
    ): array {

        return DB::transaction(function () use (
            $exercise,
            $data
        ) {

            $optionsCount = 0;

            foreach (
                $data['options'] as $optionData
            ) {

                $this->createOption(
                    $exercise,
                    $optionData
                );

                $optionsCount++;
            }

            return [

                'exercise_id' => $exercise->id,

                'exercise' => $exercise->question,

                'options' => $optionsCount,

            ];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR TOPIC
    |--------------------------------------------------------------------------
    */

    private function createTopic(
        GrammarCategory $category,
        array $topicData
    ): GrammarTopic {

        return GrammarTopic::create([

            'category_id' => $category->id,

            'name' => $topicData['name'],

            'description' => $topicData['description'] ?? null,

            'level' => $topicData['level'],

            'sort_order' => $topicData['sort_order'],

            'status' => $topicData['status'],

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR LESSON COMPLETA
    |--------------------------------------------------------------------------
    |
    | Crea:
    |
    | Lesson
    | Rules
    | Examples
    |
    | Y devuelve los contadores.
    |--------------------------------------------------------------------------
    */

    private function createLessonComplete(
        GrammarTopic $topic,
        array $lessonData
    ): array {

        $lesson = $this->createLesson(
            $topic,
            $lessonData
        );

        $rulesCount = 0;
        $examplesCount = 0;

        /*
        |--------------------------------------------------------------------------
        | RULES
        |--------------------------------------------------------------------------
        */

        foreach (
            $lessonData['rules'] ?? [] as $ruleData
        ) {

            $this->createRule(
                $lesson,
                $ruleData
            );

            $rulesCount++;
        }

        /*
        |--------------------------------------------------------------------------
        | EXAMPLES
        |--------------------------------------------------------------------------
        */

        foreach (
            $lessonData['examples'] ?? [] as $exampleData
        ) {

            $this->createExample(
                $lesson,
                $exampleData
            );

            $examplesCount++;
        }

        return [

            'lesson' => $lesson,

            'lessons' => 1,

            'rules' => $rulesCount,

            'examples' => $examplesCount,

        ];
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR EXERCISES
    |--------------------------------------------------------------------------
    |
    | Cada Exercise puede incluir sus Options.
    |--------------------------------------------------------------------------
    */

    private function createExercises(
        GrammarTopic $topic,
        array $exercises
    ): array {

        $exercisesCount = 0;
        $optionsCount = 0;

        foreach (
            $exercises as $exerciseData
        ) {

            $result = $this->createExerciseComplete(
                $topic,
                $exerciseData
            );

            $exercisesCount++;

            $optionsCount += $result['options'];
        }

        return [

            'exercises' => $exercisesCount,

            'options' => $optionsCount,

        ];
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR EXERCISE COMPLETO
    |--------------------------------------------------------------------------
    |
    | Crea:
    |
    | Exercise
    | Options
    |
    | Y devuelve los contadores.
    |--------------------------------------------------------------------------
    */

    private function createExerciseComplete(
        GrammarTopic $topic,
        array $exerciseData
    ): array {

        $exercise = $this->createExercise(
            $topic,
            $exerciseData
        );

        $optionsCount = 0;

        /*
        |--------------------------------------------------------------------------
        | OPTIONS
        |--------------------------------------------------------------------------
        */

        foreach (
            $exerciseData['options'] ?? [] as $optionData
        ) {

            $this->createOption(
                $exercise,
                $optionData
            );

            $optionsCount++;
        }

        return [

            'exercise' => $exercise,

            'options' => $optionsCount,

        ];
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR EXERCISE
    |--------------------------------------------------------------------------
    */

    private function createExercise(
        GrammarTopic $topic,
        array $exerciseData
    ): GrammarExercise {

        return GrammarExercise::create([

            'topic_id' => $topic->id,

            'type' => $exerciseData['type'],

            'question' => $exerciseData['question'],

            'instruction' => $exerciseData['instruction'] ?? null,

            'correct_answer' => $exerciseData['correct_answer'] ?? null,

            'explanation' => $exerciseData['explanation'] ?? null,

            'difficulty' => $exerciseData['difficulty'] ?? 'medium',

            'points' => $exerciseData['points'] ?? 1,

            'sort_order' => $exerciseData['sort_order'] ?? 0,

            'status' => $exerciseData['status'] ?? 1,

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR OPTION
    |--------------------------------------------------------------------------
    */

    private function createOption(
        GrammarExercise $exercise,
        array $optionData
    ): ExerciseOption {

        return ExerciseOption::create([

            'exercise_id' => $exercise->id,

            'option_text' => $optionData['option_text'],

            'is_correct' => ! empty($optionData['is_correct'])
                ? 1
                : 0,

            'sort_order' => $optionData['sort_order'] ?? 0,

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR LESSON
    |--------------------------------------------------------------------------
    */

    private function createLesson(
        GrammarTopic $topic,
        array $lessonData
    ): GrammarLesson {

        return GrammarLesson::create([

            'topic_id' => $topic->id,

            'title' => $lessonData['title'],

            'introduction' => $lessonData['introduction'] ?? null,

            'uses' => $lessonData['uses'] ?? null,

            'affirmative_structure' => $lessonData['affirmative_structure'] ?? null,

            'negative_structure' => $lessonData['negative_structure'] ?? null,

            'question_structure' => $lessonData['question_structure'] ?? null,

            'short_answers' => $lessonData['short_answers'] ?? null,

            'common_mistakes' => $lessonData['common_mistakes'] ?? null,

            'summary' => $lessonData['summary'] ?? null,

            'sort_order' => $lessonData['sort_order'],

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR RULE
    |--------------------------------------------------------------------------
    */

    private function createRule(
        GrammarLesson $lesson,
        array $ruleData
    ): GrammarRule {

        return GrammarRule::create([

            'lesson_id' => $lesson->id,

            'title' => $ruleData['title'],

            'explanation' => $ruleData['explanation'],

            'examples' => $ruleData['examples'] ?? null,

            'sort_order' => $ruleData['sort_order'],

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR EXAMPLE
    |--------------------------------------------------------------------------
    */

    private function createExample(
        GrammarLesson $lesson,
        array $exampleData
    ): GrammarExample {

        return GrammarExample::create([

            'lesson_id' => $lesson->id,

            'type' => $exampleData['type'],

            'english' => $exampleData['english'],

            'spanish' => $exampleData['spanish'] ?? null,

            'explanation' => $exampleData['explanation'] ?? null,

            'sort_order' => $exampleData['sort_order'],

        ]);
    }
}

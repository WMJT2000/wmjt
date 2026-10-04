<?php

namespace App\Services;

use App\Models\GrammarCategory;
use App\Models\GrammarExample;
use App\Models\GrammarLesson;
use App\Models\GrammarRule;
use App\Models\GrammarTopic;
use Illuminate\Support\Facades\DB;

class GrammarImportService
{
    /*
    |--------------------------------------------------------------------------
    | IMPORTACIÓN COMPLETA
    |--------------------------------------------------------------------------
    |
    | JSON:
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
    |--------------------------------------------------------------------------
    */

    public function import(array $data): array
    {
        return DB::transaction(function () use ($data) {

            /*
            |--------------------------------------------------------------------------
            | CATEGORY
            |--------------------------------------------------------------------------
            */

            $category = GrammarCategory::create([

                'name' =>
                    $data['category']['name'],

                'description' =>
                    $data['category']['description'] ?? null,

                'level' =>
                    $data['category']['level'],

                'sort_order' =>
                    $data['category']['sort_order'],

                'status' =>
                    $data['category']['status'],

            ]);


            $topicsCount = 0;
            $lessonsCount = 0;
            $rulesCount = 0;
            $examplesCount = 0;


            /*
            |--------------------------------------------------------------------------
            | TOPICS
            |--------------------------------------------------------------------------
            */

            foreach (
                $data['topics'] ?? []
                as $topicData
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
                    $topicData['lessons'] ?? []
                    as $lessonData
                ) {

                    $result = $this->createLessonComplete(
                        $topic,
                        $lessonData
                    );

                    $lessonsCount += $result['lessons'];
                    $rulesCount += $result['rules'];
                    $examplesCount += $result['examples'];
                }
            }


            return [

                'category_id' =>
                    $category->id,

                'category' =>
                    $category->name,

                'topics' =>
                    $topicsCount,

                'lessons' =>
                    $lessonsCount,

                'rules' =>
                    $rulesCount,

                'examples' =>
                    $examplesCount,

            ];
        });
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


            foreach (
                $data['topics']
                as $topicData
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
                    $topicData['lessons'] ?? []
                    as $lessonData
                ) {

                    $result = $this->createLessonComplete(
                        $topic,
                        $lessonData
                    );

                    $lessonsCount += $result['lessons'];
                    $rulesCount += $result['rules'];
                    $examplesCount += $result['examples'];
                }
            }


            return [

                'category_id' =>
                    $category->id,

                'category' =>
                    $category->name,

                'topics' =>
                    $topicsCount,

                'lessons' =>
                    $lessonsCount,

                'rules' =>
                    $rulesCount,

                'examples' =>
                    $examplesCount,

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
                $data['lessons']
                as $lessonData
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

                'topic_id' =>
                    $topic->id,

                'topic' =>
                    $topic->name,

                'lessons' =>
                    $lessonsCount,

                'rules' =>
                    $rulesCount,

                'examples' =>
                    $examplesCount,

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

                'topic_id' =>
                    $topic->id,

                'topic' =>
                    $topic->name,

                'lesson_id' =>
                    $result['lesson']->id,

                'lesson' =>
                    $result['lesson']->title,

                'rules' =>
                    $result['rules'],

                'examples' =>
                    $result['examples'],

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
                $data['rules']
                as $ruleData
            ) {

                $this->createRule(
                    $lesson,
                    $ruleData
                );

                $rulesCount++;
            }


            return [

                'lesson_id' =>
                    $lesson->id,

                'lesson' =>
                    $lesson->title,

                'rules' =>
                    $rulesCount,

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
                $data['examples']
                as $exampleData
            ) {

                $this->createExample(
                    $lesson,
                    $exampleData
                );

                $examplesCount++;
            }


            return [

                'lesson_id' =>
                    $lesson->id,

                'lesson' =>
                    $lesson->title,

                'examples' =>
                    $examplesCount,

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

            'category_id' =>
                $category->id,

            'name' =>
                $topicData['name'],

            'description' =>
                $topicData['description'] ?? null,

            'level' =>
                $topicData['level'],

            'sort_order' =>
                $topicData['sort_order'],

            'status' =>
                $topicData['status'],

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
            $lessonData['rules'] ?? []
            as $ruleData
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
            $lessonData['examples'] ?? []
            as $exampleData
        ) {

            $this->createExample(
                $lesson,
                $exampleData
            );

            $examplesCount++;
        }


        return [

            'lesson' =>
                $lesson,

            'lessons' =>
                1,

            'rules' =>
                $rulesCount,

            'examples' =>
                $examplesCount,

        ];
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

            'topic_id' =>
                $topic->id,

            'title' =>
                $lessonData['title'],

            'introduction' =>
                $lessonData['introduction'] ?? null,

            'uses' =>
                $lessonData['uses'] ?? null,

            'affirmative_structure' =>
                $lessonData['affirmative_structure'] ?? null,

            'negative_structure' =>
                $lessonData['negative_structure'] ?? null,

            'question_structure' =>
                $lessonData['question_structure'] ?? null,

            'short_answers' =>
                $lessonData['short_answers'] ?? null,

            'common_mistakes' =>
                $lessonData['common_mistakes'] ?? null,

            'summary' =>
                $lessonData['summary'] ?? null,

            'sort_order' =>
                $lessonData['sort_order'],

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

            'lesson_id' =>
                $lesson->id,

            'title' =>
                $ruleData['title'],

            'explanation' =>
                $ruleData['explanation'],

            'examples' =>
                $ruleData['examples'] ?? null,

            'sort_order' =>
                $ruleData['sort_order'],

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

            'lesson_id' =>
                $lesson->id,

            'type' =>
                $exampleData['type'],

            'english' =>
                $exampleData['english'],

            'spanish' =>
                $exampleData['spanish'] ?? null,

            'explanation' =>
                $exampleData['explanation'] ?? null,

            'sort_order' =>
                $exampleData['sort_order'],

        ]);
    }
}
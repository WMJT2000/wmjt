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
    public function import(array $data): array
    {
        return DB::transaction(function () use ($data) {

            /*
            |--------------------------------------------------------------------------
            | Category
            |--------------------------------------------------------------------------
            */

            $category = GrammarCategory::create([
                'name' => $data['category']['name'],
                'description' => $data['category']['description'] ?? null,
                'level' => $data['category']['level'],
                'sort_order' => $data['category']['sort_order'],
                'status' => $data['category']['status'],
            ]);


            $topicsCount = 0;
            $lessonsCount = 0;
            $rulesCount = 0;
            $examplesCount = 0;


            /*
            |--------------------------------------------------------------------------
            | Topics
            |--------------------------------------------------------------------------
            */

            foreach ($data['topics'] as $topicData) {

                $topic = GrammarTopic::create([
                    'category_id' => $category->id,
                    'name' => $topicData['name'],
                    'description' => $topicData['description'] ?? null,
                    'level' => $topicData['level'],
                    'sort_order' => $topicData['sort_order'],
                    'status' => $topicData['status'],
                ]);

                $topicsCount++;


                /*
                |--------------------------------------------------------------------------
                | Lessons
                |--------------------------------------------------------------------------
                */

                foreach ($topicData['lessons'] as $lessonData) {

                    $lesson = GrammarLesson::create([
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

                    $lessonsCount++;


                    /*
                    |--------------------------------------------------------------------------
                    | Rules
                    |--------------------------------------------------------------------------
                    */

                    foreach ($lessonData['rules'] ?? [] as $ruleData) {

                        GrammarRule::create([
                            'lesson_id' => $lesson->id,
                            'title' => $ruleData['title'],
                            'explanation' => $ruleData['explanation'],
                            'examples' => $ruleData['examples'] ?? null,
                            'sort_order' => $ruleData['sort_order'],
                        ]);

                        $rulesCount++;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Examples
                    |--------------------------------------------------------------------------
                    */

                    foreach ($lessonData['examples'] ?? [] as $exampleData) {

                        GrammarExample::create([
                            'lesson_id' => $lesson->id,
                            'type' => $exampleData['type'],
                            'english' => $exampleData['english'],
                            'spanish' => $exampleData['spanish'] ?? null,
                            'explanation' => $exampleData['explanation'] ?? null,
                            'sort_order' => $exampleData['sort_order'],
                        ]);

                        $examplesCount++;
                    }
                }
            }


            /*
            |--------------------------------------------------------------------------
            | Resultado
            |--------------------------------------------------------------------------
            */

            return [
                'category_id' => $category->id,
                'category' => $category->name,
                'topics' => $topicsCount,
                'lessons' => $lessonsCount,
                'rules' => $rulesCount,
                'examples' => $examplesCount,
            ];
        });
    }
}
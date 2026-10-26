<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GrammarImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [

            /*
            |--------------------------------------------------------------------------
            | IMPORTACIÓN COMPLETA
            |--------------------------------------------------------------------------
            */

            'category' => [
                'sometimes',
                'array',
            ],

            'category.name' => [
                'required_with:category',
                'string',
                'max:150',
            ],

            'category.description' => [
                'nullable',
                'string',
            ],

            'category.level' => [
                'required_with:category',
                'string',
                'max:10',
            ],

            'category.sort_order' => [
                'required_with:category',
                'integer',
            ],

            'category.status' => [
                'required_with:category',
                'boolean',
            ],

            /*
            |--------------------------------------------------------------------------
            | TOPICS
            |--------------------------------------------------------------------------
            */

            'topics' => [
                'sometimes',
                'array',
                'min:1',
            ],

            'topics.*.name' => [
                'required_with:topics',
                'string',
                'max:150',
            ],

            'topics.*.description' => [
                'nullable',
                'string',
            ],

            'topics.*.level' => [
                'required_with:topics',
                'string',
                'max:10',
            ],

            'topics.*.sort_order' => [
                'required_with:topics',
                'integer',
            ],

            'topics.*.status' => [
                'required_with:topics',
                'boolean',
            ],

            /*
            |--------------------------------------------------------------------------
            | LESSONS DENTRO DE TOPICS
            |--------------------------------------------------------------------------
            */

            'topics.*.lessons' => [
                'nullable',
                'array',
            ],

            'topics.*.lessons.*.title' => [
                'required',
                'string',
                'max:200',
            ],

            'topics.*.lessons.*.introduction' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.uses' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.affirmative_structure' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.negative_structure' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.question_structure' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.short_answers' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.common_mistakes' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.summary' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.sort_order' => [
                'required',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | RULES DENTRO DE LESSONS DENTRO DE TOPICS
            |--------------------------------------------------------------------------
            */

            'topics.*.lessons.*.rules' => [
                'nullable',
                'array',
            ],

            'topics.*.lessons.*.rules.*.title' => [
                'required',
                'string',
                'max:200',
            ],

            'topics.*.lessons.*.rules.*.explanation' => [
                'required',
                'string',
            ],

            'topics.*.lessons.*.rules.*.examples' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.rules.*.sort_order' => [
                'required',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | EXAMPLES DENTRO DE LESSONS DENTRO DE TOPICS
            |--------------------------------------------------------------------------
            */

            'topics.*.lessons.*.examples' => [
                'nullable',
                'array',
            ],

            'topics.*.lessons.*.examples.*.type' => [
                'required',
                'string',
                'max:50',
            ],

            'topics.*.lessons.*.examples.*.english' => [
                'required',
                'string',
            ],

            'topics.*.lessons.*.examples.*.spanish' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.examples.*.explanation' => [
                'nullable',
                'string',
            ],

            'topics.*.lessons.*.examples.*.sort_order' => [
                'required',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | EXERCISES DENTRO DE TOPICS
            |--------------------------------------------------------------------------
            */

            'topics.*.exercises' => [
                'nullable',
                'array',
            ],

            'topics.*.exercises.*.type' => [
                'required',
                'string',
                'max:50',
            ],

            'topics.*.exercises.*.question' => [
                'required',
                'string',
            ],

            'topics.*.exercises.*.instruction' => [
                'nullable',
                'string',
            ],

            'topics.*.exercises.*.correct_answer' => [
                'nullable',
                'string',
            ],

            'topics.*.exercises.*.explanation' => [
                'nullable',
                'string',
            ],

            'topics.*.exercises.*.difficulty' => [
                'nullable',
                'string',
                'max:20',
            ],

            'topics.*.exercises.*.points' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'topics.*.exercises.*.sort_order' => [
                'nullable',
                'integer',
            ],

            'topics.*.exercises.*.status' => [
                'nullable',
                'boolean',
            ],

            /*
            |--------------------------------------------------------------------------
            | OPTIONS DENTRO DE EXERCISES DENTRO DE TOPICS
            |--------------------------------------------------------------------------
            */

            'topics.*.exercises.*.options' => [
                'nullable',
                'array',
            ],

            'topics.*.exercises.*.options.*.option_text' => [
                'required',
                'string',
            ],

            'topics.*.exercises.*.options.*.is_correct' => [
                'nullable',
                'boolean',
            ],

            'topics.*.exercises.*.options.*.sort_order' => [
                'nullable',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | IMPORTACIÓN DE LESSONS
            |--------------------------------------------------------------------------
            |
            | lessons
            |   └── rules
            |   └── examples
            |
            |--------------------------------------------------------------------------
            */

            'lessons' => [
                'sometimes',
                'array',
                'min:1',
            ],

            'lessons.*.title' => [
                'required_with:lessons',
                'string',
                'max:200',
            ],

            'lessons.*.topic' => [
                'nullable',
                'string',
                'max:150',
            ],

            'lessons.*.topic_name' => [
                'nullable',
                'string',
                'max:150',
            ],

            'lessons.*.introduction' => [
                'nullable',
                'string',
            ],

            'lessons.*.uses' => [
                'nullable',
                'string',
            ],

            'lessons.*.affirmative_structure' => [
                'nullable',
                'string',
            ],

            'lessons.*.negative_structure' => [
                'nullable',
                'string',
            ],

            'lessons.*.question_structure' => [
                'nullable',
                'string',
            ],

            'lessons.*.short_answers' => [
                'nullable',
                'string',
            ],

            'lessons.*.common_mistakes' => [
                'nullable',
                'string',
            ],

            'lessons.*.summary' => [
                'nullable',
                'string',
            ],

            'lessons.*.sort_order' => [
                'required_with:lessons',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | RULES DENTRO DE LESSONS
            |--------------------------------------------------------------------------
            */

            'lessons.*.rules' => [
                'nullable',
                'array',
            ],

            'lessons.*.rules.*.title' => [
                'required',
                'string',
                'max:200',
            ],

            'lessons.*.rules.*.explanation' => [
                'required',
                'string',
            ],

            'lessons.*.rules.*.examples' => [
                'nullable',
                'string',
            ],

            'lessons.*.rules.*.sort_order' => [
                'required',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | EXAMPLES DENTRO DE LESSONS
            |--------------------------------------------------------------------------
            */

            'lessons.*.examples' => [
                'nullable',
                'array',
            ],

            'lessons.*.examples.*.type' => [
                'required',
                'string',
                'max:50',
            ],

            'lessons.*.examples.*.english' => [
                'required',
                'string',
            ],

            'lessons.*.examples.*.spanish' => [
                'nullable',
                'string',
            ],

            'lessons.*.examples.*.explanation' => [
                'nullable',
                'string',
            ],

            'lessons.*.examples.*.sort_order' => [
                'required',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | LESSON COMPLETA
            |--------------------------------------------------------------------------
            |
            | lesson
            |   ├── rules
            |   └── examples
            |
            |--------------------------------------------------------------------------
            */

            'lesson' => [
                'sometimes',
                'array',
            ],

            'lesson.title' => [
                'required_with:lesson',
                'string',
                'max:200',
            ],

            'lesson.introduction' => [
                'nullable',
                'string',
            ],

            'lesson.uses' => [
                'nullable',
                'string',
            ],

            'lesson.affirmative_structure' => [
                'nullable',
                'string',
            ],

            'lesson.negative_structure' => [
                'nullable',
                'string',
            ],

            'lesson.question_structure' => [
                'nullable',
                'string',
            ],

            'lesson.short_answers' => [
                'nullable',
                'string',
            ],

            'lesson.common_mistakes' => [
                'nullable',
                'string',
            ],

            'lesson.summary' => [
                'nullable',
                'string',
            ],

            'lesson.sort_order' => [
                'required_with:lesson',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | RULES DE LESSON
            |--------------------------------------------------------------------------
            */

            'lesson.rules' => [
                'nullable',
                'array',
            ],

            'lesson.rules.*.title' => [
                'required',
                'string',
                'max:200',
            ],

            'lesson.rules.*.explanation' => [
                'required',
                'string',
            ],

            'lesson.rules.*.examples' => [
                'nullable',
                'string',
            ],

            'lesson.rules.*.sort_order' => [
                'required',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | EXAMPLES DE LESSON
            |--------------------------------------------------------------------------
            */

            'lesson.examples' => [
                'nullable',
                'array',
            ],

            'lesson.examples.*.type' => [
                'required',
                'string',
                'max:50',
            ],

            'lesson.examples.*.english' => [
                'required',
                'string',
            ],

            'lesson.examples.*.spanish' => [
                'nullable',
                'string',
            ],

            'lesson.examples.*.explanation' => [
                'nullable',
                'string',
            ],

            'lesson.examples.*.sort_order' => [
                'required',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | RULES POR SEPARADO
            |--------------------------------------------------------------------------
            */

            'rules' => [
                'sometimes',
                'array',
                'min:1',
            ],

            'rules.*.title' => [
                'required_with:rules',
                'string',
                'max:200',
            ],

            'rules.*.explanation' => [
                'required_with:rules',
                'string',
            ],

            'rules.*.examples' => [
                'nullable',
                'string',
            ],

            'rules.*.sort_order' => [
                'required_with:rules',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | EXAMPLES POR SEPARADO
            |--------------------------------------------------------------------------
            */

            'examples' => [
                'sometimes',
                'array',
                'min:1',
            ],

            'examples.*.type' => [
                'required_with:examples',
                'string',
                'max:50',
            ],

            'examples.*.english' => [
                'required_with:examples',
                'string',
            ],

            'examples.*.spanish' => [
                'nullable',
                'string',
            ],

            'examples.*.explanation' => [
                'nullable',
                'string',
            ],

            'examples.*.sort_order' => [
                'required_with:examples',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | EXERCISES POR SEPARADO
            |--------------------------------------------------------------------------
            */

            'exercises' => [
                'sometimes',
                'array',
                'min:1',
            ],

            'exercises.*.type' => [
                'required_with:exercises',
                'string',
                'max:50',
            ],

            'exercises.*.question' => [
                'required_with:exercises',
                'string',
            ],

            'exercises.*.topic' => [
                'nullable',
                'string',
                'max:150',
            ],

            'exercises.*.topic_name' => [
                'nullable',
                'string',
                'max:150',
            ],

            'exercises.*.instruction' => [
                'nullable',
                'string',
            ],

            'exercises.*.correct_answer' => [
                'nullable',
                'string',
            ],

            'exercises.*.explanation' => [
                'nullable',
                'string',
            ],

            'exercises.*.difficulty' => [
                'nullable',
                'string',
                'max:20',
            ],

            'exercises.*.points' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'exercises.*.sort_order' => [
                'nullable',
                'integer',
            ],

            'exercises.*.status' => [
                'nullable',
                'boolean',
            ],

            'exercises.*.options' => [
                'nullable',
                'array',
            ],

            'exercises.*.options.*.option_text' => [
                'required',
                'string',
            ],

            'exercises.*.options.*.is_correct' => [
                'nullable',
                'boolean',
            ],

            'exercises.*.options.*.sort_order' => [
                'nullable',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | UN EXERCISE COMPLETO
            |--------------------------------------------------------------------------
            */

            'exercise' => [
                'sometimes',
                'array',
            ],

            'exercise.type' => [
                'required_with:exercise',
                'string',
                'max:50',
            ],

            'exercise.question' => [
                'required_with:exercise',
                'string',
            ],

            'exercise.instruction' => [
                'nullable',
                'string',
            ],

            'exercise.correct_answer' => [
                'nullable',
                'string',
            ],

            'exercise.explanation' => [
                'nullable',
                'string',
            ],

            'exercise.difficulty' => [
                'nullable',
                'string',
                'max:20',
            ],

            'exercise.points' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'exercise.sort_order' => [
                'nullable',
                'integer',
            ],

            'exercise.status' => [
                'nullable',
                'boolean',
            ],

            'exercise.options' => [
                'nullable',
                'array',
            ],

            'exercise.options.*.option_text' => [
                'required',
                'string',
            ],

            'exercise.options.*.is_correct' => [
                'nullable',
                'boolean',
            ],

            'exercise.options.*.sort_order' => [
                'nullable',
                'integer',
            ],

            /*
            |--------------------------------------------------------------------------
            | OPTIONS POR SEPARADO
            |--------------------------------------------------------------------------
            */

            'options' => [
                'sometimes',
                'array',
                'min:1',
            ],

            'options.*.option_text' => [
                'required_with:options',
                'string',
            ],

            'options.*.is_correct' => [
                'nullable',
                'boolean',
            ],

            'options.*.sort_order' => [
                'nullable',
                'integer',
            ],

        ];

        return array_merge(
            $rules,
            $this->multipleCategoriesRules(
                $rules
            )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | IMPORTACIÓN DE VARIAS CATEGORÍAS
    |--------------------------------------------------------------------------
    |
    | Cada categoría acepta:
    |
    | {
    |     "category": { ... },
    |     "topics": []
    | }
    |
    | o los datos de la categoría directamente:
    |
    | {
    |     "name": "...",
    |     "level": "...",
    |     "sort_order": 1,
    |     "status": 1,
    |     "topics": []
    | }
    |
    |--------------------------------------------------------------------------
    */

    private function multipleCategoriesRules(
        array $baseRules
    ): array {

        $rules = [

            'categories' => [
                'sometimes',
                'array',
                'min:1',
            ],

            'categories.*' => [
                'array',
            ],

            /*
            |--------------------------------------------------------------------------
            | CATEGORÍA ANIDADA
            |--------------------------------------------------------------------------
            */

            'categories.*.category' => [
                'sometimes',
                'array',
            ],

            'categories.*.category.name' => [
                'required_with:categories.*.category',
                'string',
                'max:150',
            ],

            'categories.*.category.description' => [
                'nullable',
                'string',
            ],

            'categories.*.category.level' => [
                'required_with:categories.*.category',
                'string',
                'max:10',
            ],

            'categories.*.category.sort_order' => [
                'required_with:categories.*.category',
                'integer',
            ],

            'categories.*.category.status' => [
                'required_with:categories.*.category',
                'boolean',
            ],

            /*
            |--------------------------------------------------------------------------
            | CATEGORÍA DIRECTA
            |--------------------------------------------------------------------------
            */

            'categories.*.name' => [
                'required_without:categories.*.category',
                'string',
                'max:150',
            ],

            'categories.*.description' => [
                'nullable',
                'string',
            ],

            'categories.*.level' => [
                'required_without:categories.*.category',
                'string',
                'max:10',
            ],

            'categories.*.sort_order' => [
                'required_without:categories.*.category',
                'integer',
            ],

            'categories.*.status' => [
                'required_without:categories.*.category',
                'boolean',
            ],

        ];

        /*
        |--------------------------------------------------------------------------
        | TOPICS DENTRO DE CADA CATEGORÍA
        |--------------------------------------------------------------------------
        */

        foreach (
            $baseRules as $key => $value
        ) {

            if (
                $key === 'topics' ||
                str_starts_with(
                    $key,
                    'topics.'
                )
            ) {

                $rules[
                    'categories.*.'.$key
                ] = array_map(
                    function ($rule) {

                        if (
                            ! is_string($rule)
                        ) {

                            return $rule;

                        }

                        return str_replace(
                            'required_with:topics',
                            'required_with:categories.*.topics',
                            $rule
                        );
                    },
                    $value
                );

            }
        }

        return $rules;
    }
}

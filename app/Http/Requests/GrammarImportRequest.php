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
        return [

            /*
            |--------------------------------------------------------------------------
            | IMPORTACIÓN COMPLETA
            |--------------------------------------------------------------------------
            */

            'category' => [
                'sometimes',
                'array'
            ],

            'category.name' => [
                'required_with:category',
                'string',
                'max:150'
            ],

            'category.description' => [
                'nullable',
                'string'
            ],

            'category.level' => [
                'required_with:category',
                'string',
                'max:10'
            ],

            'category.sort_order' => [
                'required_with:category',
                'integer'
            ],

            'category.status' => [
                'required_with:category',
                'boolean'
            ],


            /*
            |--------------------------------------------------------------------------
            | TOPICS
            |--------------------------------------------------------------------------
            */

            'topics' => [
                'sometimes',
                'array',
                'min:1'
            ],

            'topics.*.name' => [
                'required_with:topics',
                'string',
                'max:150'
            ],

            'topics.*.description' => [
                'nullable',
                'string'
            ],

            'topics.*.level' => [
                'required_with:topics',
                'string',
                'max:10'
            ],

            'topics.*.sort_order' => [
                'required_with:topics',
                'integer'
            ],

            'topics.*.status' => [
                'required_with:topics',
                'boolean'
            ],


            /*
            |--------------------------------------------------------------------------
            | LESSONS DENTRO DE TOPICS
            |--------------------------------------------------------------------------
            */

            'topics.*.lessons' => [
                'nullable',
                'array'
            ],

            'topics.*.lessons.*.title' => [
                'required',
                'string',
                'max:200'
            ],

            'topics.*.lessons.*.introduction' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.uses' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.affirmative_structure' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.negative_structure' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.question_structure' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.short_answers' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.common_mistakes' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.summary' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.sort_order' => [
                'required',
                'integer'
            ],


            /*
            |--------------------------------------------------------------------------
            | RULES DENTRO DE LESSONS DENTRO DE TOPICS
            |--------------------------------------------------------------------------
            */

            'topics.*.lessons.*.rules' => [
                'nullable',
                'array'
            ],

            'topics.*.lessons.*.rules.*.title' => [
                'required',
                'string',
                'max:200'
            ],

            'topics.*.lessons.*.rules.*.explanation' => [
                'required',
                'string'
            ],

            'topics.*.lessons.*.rules.*.examples' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.rules.*.sort_order' => [
                'required',
                'integer'
            ],


            /*
            |--------------------------------------------------------------------------
            | EXAMPLES DENTRO DE LESSONS DENTRO DE TOPICS
            |--------------------------------------------------------------------------
            */

            'topics.*.lessons.*.examples' => [
                'nullable',
                'array'
            ],

            'topics.*.lessons.*.examples.*.type' => [
                'required',
                'string',
                'max:50'
            ],

            'topics.*.lessons.*.examples.*.english' => [
                'required',
                'string'
            ],

            'topics.*.lessons.*.examples.*.spanish' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.examples.*.explanation' => [
                'nullable',
                'string'
            ],

            'topics.*.lessons.*.examples.*.sort_order' => [
                'required',
                'integer'
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
                'min:1'
            ],

            'lessons.*.title' => [
                'required_with:lessons',
                'string',
                'max:200'
            ],

            'lessons.*.introduction' => [
                'nullable',
                'string'
            ],

            'lessons.*.uses' => [
                'nullable',
                'string'
            ],

            'lessons.*.affirmative_structure' => [
                'nullable',
                'string'
            ],

            'lessons.*.negative_structure' => [
                'nullable',
                'string'
            ],

            'lessons.*.question_structure' => [
                'nullable',
                'string'
            ],

            'lessons.*.short_answers' => [
                'nullable',
                'string'
            ],

            'lessons.*.common_mistakes' => [
                'nullable',
                'string'
            ],

            'lessons.*.summary' => [
                'nullable',
                'string'
            ],

            'lessons.*.sort_order' => [
                'required_with:lessons',
                'integer'
            ],


            /*
            |--------------------------------------------------------------------------
            | RULES DENTRO DE LESSONS
            |--------------------------------------------------------------------------
            */

            'lessons.*.rules' => [
                'nullable',
                'array'
            ],

            'lessons.*.rules.*.title' => [
                'required',
                'string',
                'max:200'
            ],

            'lessons.*.rules.*.explanation' => [
                'required',
                'string'
            ],

            'lessons.*.rules.*.examples' => [
                'nullable',
                'string'
            ],

            'lessons.*.rules.*.sort_order' => [
                'required',
                'integer'
            ],


            /*
            |--------------------------------------------------------------------------
            | EXAMPLES DENTRO DE LESSONS
            |--------------------------------------------------------------------------
            */

            'lessons.*.examples' => [
                'nullable',
                'array'
            ],

            'lessons.*.examples.*.type' => [
                'required',
                'string',
                'max:50'
            ],

            'lessons.*.examples.*.english' => [
                'required',
                'string'
            ],

            'lessons.*.examples.*.spanish' => [
                'nullable',
                'string'
            ],

            'lessons.*.examples.*.explanation' => [
                'nullable',
                'string'
            ],

            'lessons.*.examples.*.sort_order' => [
                'required',
                'integer'
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
                'array'
            ],

            'lesson.title' => [
                'required_with:lesson',
                'string',
                'max:200'
            ],

            'lesson.introduction' => [
                'nullable',
                'string'
            ],

            'lesson.uses' => [
                'nullable',
                'string'
            ],

            'lesson.affirmative_structure' => [
                'nullable',
                'string'
            ],

            'lesson.negative_structure' => [
                'nullable',
                'string'
            ],

            'lesson.question_structure' => [
                'nullable',
                'string'
            ],

            'lesson.short_answers' => [
                'nullable',
                'string'
            ],

            'lesson.common_mistakes' => [
                'nullable',
                'string'
            ],

            'lesson.summary' => [
                'nullable',
                'string'
            ],

            'lesson.sort_order' => [
                'required_with:lesson',
                'integer'
            ],


            /*
            |--------------------------------------------------------------------------
            | RULES DE LESSON
            |--------------------------------------------------------------------------
            */

            'lesson.rules' => [
                'nullable',
                'array'
            ],

            'lesson.rules.*.title' => [
                'required',
                'string',
                'max:200'
            ],

            'lesson.rules.*.explanation' => [
                'required',
                'string'
            ],

            'lesson.rules.*.examples' => [
                'nullable',
                'string'
            ],

            'lesson.rules.*.sort_order' => [
                'required',
                'integer'
            ],


            /*
            |--------------------------------------------------------------------------
            | EXAMPLES DE LESSON
            |--------------------------------------------------------------------------
            */

            'lesson.examples' => [
                'nullable',
                'array'
            ],

            'lesson.examples.*.type' => [
                'required',
                'string',
                'max:50'
            ],

            'lesson.examples.*.english' => [
                'required',
                'string'
            ],

            'lesson.examples.*.spanish' => [
                'nullable',
                'string'
            ],

            'lesson.examples.*.explanation' => [
                'nullable',
                'string'
            ],

            'lesson.examples.*.sort_order' => [
                'required',
                'integer'
            ],


            /*
            |--------------------------------------------------------------------------
            | RULES POR SEPARADO
            |--------------------------------------------------------------------------
            */

            'rules' => [
                'sometimes',
                'array',
                'min:1'
            ],

            'rules.*.title' => [
                'required_with:rules',
                'string',
                'max:200'
            ],

            'rules.*.explanation' => [
                'required_with:rules',
                'string'
            ],

            'rules.*.examples' => [
                'nullable',
                'string'
            ],

            'rules.*.sort_order' => [
                'required_with:rules',
                'integer'
            ],


            /*
            |--------------------------------------------------------------------------
            | EXAMPLES POR SEPARADO
            |--------------------------------------------------------------------------
            */

            'examples' => [
                'sometimes',
                'array',
                'min:1'
            ],

            'examples.*.type' => [
                'required_with:examples',
                'string',
                'max:50'
            ],

            'examples.*.english' => [
                'required_with:examples',
                'string'
            ],

            'examples.*.spanish' => [
                'nullable',
                'string'
            ],

            'examples.*.explanation' => [
                'nullable',
                'string'
            ],

            'examples.*.sort_order' => [
                'required_with:examples',
                'integer'
            ],

        ];
    }
}
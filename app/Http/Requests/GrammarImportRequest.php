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
            | Category
            |--------------------------------------------------------------------------
            */

            'category' => [
                'required',
                'array',
            ],

            'category.name' => [
                'required',
                'string',
                'max:150',
            ],

            'category.description' => [
                'nullable',
                'string',
            ],

            'category.level' => [
                'required',
                'string',
                'max:10',
            ],

            'category.sort_order' => [
                'required',
                'integer',
            ],

            'category.status' => [
                'required',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Topics
            |--------------------------------------------------------------------------
            */

            'topics' => [
                'required',
                'array',
                'min:1',
            ],

            'topics.*.name' => [
                'required',
                'string',
                'max:150',
            ],

            'topics.*.description' => [
                'nullable',
                'string',
            ],

            'topics.*.level' => [
                'required',
                'string',
                'max:10',
            ],

            'topics.*.sort_order' => [
                'required',
                'integer',
            ],

            'topics.*.status' => [
                'required',
                'boolean',
            ],


            /*
            |--------------------------------------------------------------------------
            | Lessons
            |--------------------------------------------------------------------------
            */

            'topics.*.lessons' => [
                'required',
                'array',
                'min:1',
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
            | Rules
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
            | Examples
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

        ];
    }
}
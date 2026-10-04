<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EnglishImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category' => ['nullable', 'array'],
            'category.name' => ['required_with:category', 'string', 'max:255'],
            'category.description' => ['nullable', 'string'],

            'words' => ['nullable', 'array', 'min:1'],

            'words.*.word' => ['required', 'string', 'max:255'],
            'words.*.pronunciation_guide' => ['nullable', 'string', 'max:255'],
            'words.*.example' => ['nullable', 'string'],
            'words.*.example_translation' => ['nullable', 'string'],

            'words.*.meanings' => ['nullable', 'array'],

            'words.*.meanings.*.meaning' => [
                'required',
                'string'
            ],

            'word' => ['nullable', 'array'],

            'word.word' => ['required_with:word', 'string', 'max:255'],
            'word.pronunciation_guide' => ['nullable', 'string', 'max:255'],
            'word.example' => ['nullable', 'string'],
            'word.example_translation' => ['nullable', 'string'],

            'word.meanings' => ['nullable', 'array'],

            'word.meanings.*.meaning' => [
                'required',
                'string'
            ],

            'meanings' => ['nullable', 'array', 'min:1'],

            'meanings.*.meaning' => [
                'required',
                'string'
            ],
        ];
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\EnglishCategory;
use Illuminate\View\View;

class EnglishLearningController extends Controller
{
    public function index(): View
    {
        $categories = EnglishCategory::withCount('words')
            ->orderBy('name', 'asc')
            ->get();

        return view('english.index', compact('categories'));
    }

    public function study(EnglishCategory $category, $word = 0): View
    {
        $words = $category->words()
            ->with('meanings')
            ->orderBy('id', 'asc')
            ->get();

        if ($words->isEmpty()) {
            return view('english.study', [
                'category' => $category,
                'words' => $words,
                'currentWord' => null,
                'currentIndex' => 0,
            ]);
        }

        $currentIndex = (int) $word;

        if ($currentIndex < 0) {
            $currentIndex = 0;
        }

        if ($currentIndex >= $words->count()) {
            $currentIndex = $words->count() - 1;
        }

        $currentWord = $words[$currentIndex];

        return view('english.study', compact(
            'category',
            'words',
            'currentWord',
            'currentIndex'
        ));
    }
}
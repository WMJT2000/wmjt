<?php

namespace App\Http\Controllers;

use App\Models\EnglishCategory;
use App\Models\EnglishPracticeResult;
use App\Models\EnglishPracticeSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    public function practice(EnglishCategory $category): View
    {
        $words = $category->words()
            ->with('meanings')
            ->orderBy('id', 'asc')
            ->get();

        return view('english.practice', compact(
            'category',
            'words'
        ));
    }


    public function startPractice(
    Request $request,
    EnglishCategory $category
): JsonResponse {
    $validated = $request->validate([
        'practice_session_id' => ['required', 'string', 'max:36'],
        'practice_mode' => ['required', 'string', 'max:50'],
    ]);

    $session = EnglishPracticeSession::create([
        'user_id' => auth()->id(),
        'english_category_id' => $category->id,
        'practice_session_id' => $validated['practice_session_id'],
        'practice_mode' => $validated['practice_mode'],
        'total_questions' => 0,
        'correct_answers' => 0,
        'incorrect_answers' => 0,
        'score' => 0,
        'started_at' => now(),
    ]);

    return response()->json([
        'success' => true,
        'session_id' => $session->id,
        'practice_session_id' => $session->practice_session_id,
    ]);
}

    public function savePracticeResult(
        Request $request,
        EnglishCategory $category
    ): JsonResponse {
        $validated = $request->validate([
            'english_word_id' => ['required', 'integer'],
            'practice_session_id' => ['required', 'string', 'max:36'],
            'question_type' => ['required', 'string', 'max:50'],
            'user_answer' => ['nullable', 'string'],
            'correct_answer' => ['required', 'string', 'max:255'],
            'is_correct' => ['required', 'boolean'],
        ]);

        $wordExists = $category->words()
            ->where('id', $validated['english_word_id'])
            ->exists();

        if (!$wordExists) {
            return response()->json([
                'message' => 'La palabra no pertenece a esta categoría.',
            ], 422);
        }

        $result = EnglishPracticeResult::create([
            'user_id' => auth()->id(),
            'english_category_id' => $category->id,
            'english_word_id' => $validated['english_word_id'],
            'practice_session_id' => $validated['practice_session_id'],
            'question_type' => $validated['question_type'],
            'user_answer' => $validated['user_answer'] ?? null,
            'correct_answer' => $validated['correct_answer'],
            'is_correct' => $validated['is_correct'],
        ]);

        return response()->json([
            'success' => true,
            'result_id' => $result->id,
        ]);
    }



   public function finishPractice(
    Request $request,
    EnglishCategory $category
): JsonResponse {
    $validated = $request->validate([
        'practice_session_id' => [
            'required',
            'string',
            'max:36',
        ],
    ]);

    $session = EnglishPracticeSession::where(
        'practice_session_id',
        $validated['practice_session_id']
    )
        ->where('user_id', auth()->id())
        ->where('english_category_id', $category->id)
        ->firstOrFail();

    $results = $session->results()->get();

    $total = $results->count();

    $correct = $results
        ->where('is_correct', true)
        ->count();

    $incorrect = $results
        ->where('is_correct', false)
        ->count();

    $score = $total > 0
        ? (int) round(($correct / $total) * 100)
        : 0;

    $session->update([
        'total_questions' => $total,
        'correct_answers' => $correct,
        'incorrect_answers' => $incorrect,
        'score' => $score,
        'completed_at' => now(),
    ]);

    return response()->json([
        'success' => true,
        'session_id' => $session->id,
        'total_questions' => $total,
        'correct_answers' => $correct,
        'incorrect_answers' => $incorrect,
        'score' => $score,
    ]);
}
}
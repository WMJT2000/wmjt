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
        $categories = EnglishCategory::with('words')
            ->withCount('words')
            ->orderBy('name', 'asc')
            ->get();
        /*
        |--------------------------------------------------------------------------
        | PROGRESO POR CATEGORÍA
        |--------------------------------------------------------------------------
        */

        $progressByCategory = [];

        foreach ($categories as $category) {

            $totalQuestions = EnglishPracticeResult::where(
                'user_id',
                auth()->id()
            )
                ->where(
                    'english_category_id',
                    $category->id
                )
                ->count();

            $correctAnswers = EnglishPracticeResult::where(
                'user_id',
                auth()->id()
            )
                ->where(
                    'english_category_id',
                    $category->id
                )
                ->where(
                    'is_correct',
                    true
                )
                ->count();

            $percentage = $totalQuestions > 0
                ? (int) round(
                    ($correctAnswers / $totalQuestions) * 100
                )
                : 0;

            $progressByCategory[$category->id] = [
                'category' => $category,
                'percentage' => $percentage,
            ];
        }



        /*
    |--------------------------------------------------------------------------
    | DOMINIO DE PALABRAS
    |--------------------------------------------------------------------------
    */

        $practiceResults = EnglishPracticeResult::where(
            'user_id',
            auth()->id()
        )
            ->get([
                'english_category_id',
                'english_word_id',
                'is_correct',
            ]);

        $wordMasteryByCategory = [];

        foreach ($categories as $category) {

            $categoryResults = $practiceResults->where(
                'english_category_id',
                $category->id
            );

            $mastery = [];

            foreach ($category->words as $word) {

                $wordResults = $categoryResults->where(
                    'english_word_id',
                    $word->id
                );

                $total = $wordResults->count();

                $correct = $wordResults
                    ->where('is_correct', true)
                    ->count();

                $accuracy = $total > 0
                    ? (int) round(
                        ($correct / $total) * 100
                    )
                    : 0;

                if ($total === 0) {

                    $level = 'not_started';
                    $label = 'Sin practicar';
                    $icon = '⚪';

                } elseif ($total < 3) {

                    $level = 'learning';
                    $label = 'En aprendizaje';
                    $icon = '🟡';

                } elseif ($accuracy < 50) {

                    $level = 'needs_practice';
                    $label = 'Necesita práctica';
                    $icon = '🔴';

                } elseif ($accuracy < 80) {

                    $level = 'learning';
                    $label = 'En aprendizaje';
                    $icon = '🟡';

                } elseif ($total < 5) {

                    $level = 'learning';
                    $label = 'En aprendizaje';
                    $icon = '🟡';

                } else {

                    $level = 'mastered';
                    $label = 'Dominada';
                    $icon = '🟢';
                }

                $mastery[$word->id] = [
                    'word' => $word,
                    'total' => $total,
                    'correct' => $correct,
                    'accuracy' => $accuracy,
                    'level' => $level,
                    'label' => $label,
                    'icon' => $icon,
                ];
            }

            $wordMasteryByCategory[$category->id] = $mastery;
        }




        /*
        |--------------------------------------------------------------------------
        | ÚLTIMAS PRÁCTICAS
        |--------------------------------------------------------------------------
        */

        $latestPractices = EnglishPracticeSession::with('category')
            ->where(
                'user_id',
                auth()->id()
            )
            ->whereNotNull('completed_at')
            ->orderByDesc('completed_at')
            ->limit(10)
            ->get();

        return view('english.index', compact(
            'categories',
            'progressByCategory',
            'latestPractices',
            'wordMasteryByCategory'
        ));
    }


    


    public function statistics(): View
    {
        /*
        |--------------------------------------------------------------------------
        | ESTADÍSTICAS GENERALES
        |--------------------------------------------------------------------------
        */

        $totalQuestions = EnglishPracticeResult::where(
            'user_id',
            auth()->id()
        )->count();

        $correctAnswers = EnglishPracticeResult::where(
            'user_id',
            auth()->id()
        )
            ->where('is_correct', true)
            ->count();

        $incorrectAnswers = EnglishPracticeResult::where(
            'user_id',
            auth()->id()
        )
            ->where('is_correct', false)
            ->count();

        $accuracy = $totalQuestions > 0
            ? (int) round(
                ($correctAnswers / $totalQuestions) * 100
            )
            : 0;

        /*
        |--------------------------------------------------------------------------
        | PRÁCTICAS COMPLETADAS
        |--------------------------------------------------------------------------
        */

        $totalPractices = EnglishPracticeSession::where(
            'user_id',
            auth()->id()
        )
            ->whereNotNull('completed_at')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | MEJOR PUNTUACIÓN
        |--------------------------------------------------------------------------
        */

        $bestScore = EnglishPracticeSession::where(
            'user_id',
            auth()->id()
        )
            ->whereNotNull('completed_at')
            ->max('score') ?? 0;

        /*
        |--------------------------------------------------------------------------
        | PALABRAS INCORRECTAS
        |--------------------------------------------------------------------------
        */

        $incorrectWords = EnglishPracticeResult::where(
            'user_id',
            auth()->id()
        )
            ->where('is_correct', false)
            ->distinct('english_word_id')
            ->count('english_word_id');

        /*
        |--------------------------------------------------------------------------
        | ESTADÍSTICAS POR CATEGORÍA
        |--------------------------------------------------------------------------
        */

        $categoryStatistics = EnglishPracticeResult::where(
            'user_id',
            auth()->id()
        )
            ->with('category')
            ->get()
            ->groupBy('english_category_id')
            ->map(function ($results) {

                $total = $results->count();

                $correct = $results
                    ->where('is_correct', true)
                    ->count();

                $accuracy = $total > 0
                    ? (int) round(
                        ($correct / $total) * 100
                    )
                    : 0;

                return [
                    'category' => $results->first()->category,
                    'total' => $total,
                    'correct' => $correct,
                    'incorrect' => $total - $correct,
                    'accuracy' => $accuracy,
                ];
            })
            ->sortByDesc('accuracy')
            ->values();


        /*
|--------------------------------------------------------------------------
| RACHA DE ESTUDIO
|--------------------------------------------------------------------------
*/

        $studyDates = EnglishPracticeSession::where(
            'user_id',
            auth()->id()
        )
            ->whereNotNull('completed_at')
            ->orderBy('completed_at', 'desc')
            ->pluck('completed_at')
            ->map(function ($date) {
                return $date->format('Y-m-d');
            })
            ->unique()
            ->values();


        /*
        |--------------------------------------------------------------------------
        | RACHA ACTUAL
        |--------------------------------------------------------------------------
        */

        $currentStreak = 0;

        $today = now()->startOfDay();

        foreach ($studyDates as $index => $date) {

            $studyDate = \Carbon\Carbon::parse($date)->startOfDay();

            if ($index === 0) {

                if (
                    $studyDate->equalTo($today) ||
                    $studyDate->equalTo(
                        $today->copy()->subDay()
                    )
                ) {
                    $currentStreak = 1;
                } else {
                    break;
                }

                continue;
            }

            $previousDate = \Carbon\Carbon::parse(
                $studyDates[$index - 1]
            )->startOfDay();

            if (
                $previousDate->diffInDays($studyDate) === 1
            ) {
                $currentStreak++;
            } else {
                break;
            }
        }


        /*
        |--------------------------------------------------------------------------
        | MEJOR RACHA
        |--------------------------------------------------------------------------
        */

        $bestStreak = 0;
        $streak = 0;
        $previousDate = null;

        foreach ($studyDates->sort() as $date) {

            $studyDate = \Carbon\Carbon::parse($date)->startOfDay();

            if ($previousDate === null) {

                $streak = 1;

            } elseif (
                $previousDate->diffInDays($studyDate) === 1
            ) {

                $streak++;

            } else {

                $streak = 1;
            }

            $bestStreak = max(
                $bestStreak,
                $streak
            );

            $previousDate = $studyDate;
        }


        /*
        |--------------------------------------------------------------------------
        | DÍAS ESTUDIADOS
        |--------------------------------------------------------------------------
        */

        $totalStudyDays = $studyDates->count();

        return view('english.statistics', compact(
            'totalQuestions',
            'correctAnswers',
            'incorrectAnswers',
            'accuracy',
            'totalPractices',
            'bestScore',
            'incorrectWords',
            'categoryStatistics',
            'currentStreak',
            'bestStreak',
            'totalStudyDays'
        ));
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
        /*
        |--------------------------------------------------------------------------
        | TODAS LAS PALABRAS DE LA CATEGORÍA
        |--------------------------------------------------------------------------
        */

        $words = $category->words()
            ->with('meanings')
            ->orderBy('id', 'asc')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | RESULTADOS DEL USUARIO EN ESTA CATEGORÍA
        |--------------------------------------------------------------------------
        */

        $practiceResults = EnglishPracticeResult::where(
            'user_id',
            auth()->id()
        )
            ->where(
                'english_category_id',
                $category->id
            )
            ->get();


        $wordPracticeStats = [];

        foreach ($words as $word) {

            $wordResults = $practiceResults->where(
                'english_word_id',
                $word->id
            );

            $total = $wordResults->count();

            $correct = $wordResults
                ->where('is_correct', true)
                ->count();

            $accuracy = $total > 0
                ? (int) round(($correct / $total) * 100)
                : 0;

            $wordPracticeStats[$word->id] = [
                'total' => $total,
                'correct' => $correct,
                'accuracy' => $accuracy,
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | FILTRO DE PRÁCTICA SEGÚN DOMINIO
        |--------------------------------------------------------------------------
        */

        $focus = request()->query('focus');

        if (
            $focus === 'not_started' ||
            $focus === 'learning' ||
            $focus === 'needs_practice'
        ) {

            $words = $words->filter(function ($word) use ($practiceResults, $focus) {

                $wordResults = $practiceResults->where(
                    'english_word_id',
                    $word->id
                );

                $total = $wordResults->count();

                $correct = $wordResults
                    ->where('is_correct', true)
                    ->count();

                $accuracy = $total > 0
                    ? (int) round(
                        ($correct / $total) * 100
                    )
                    : 0;

                /*
                |--------------------------------------------------------------------------
                | DETERMINAR NIVEL
                |--------------------------------------------------------------------------
                */

                if ($total === 0) {

                    $level = 'not_started';

                } elseif ($total < 3) {

                    $level = 'learning';

                } elseif ($accuracy < 50) {

                    $level = 'needs_practice';

                } elseif ($accuracy < 80) {

                    $level = 'learning';

                } elseif ($total < 5) {

                    $level = 'learning';

                } else {

                    $level = 'mastered';
                }

                return $level === $focus;
            })->values();
        }



        $practiceEmptyMessage = null;

        if ($words->isEmpty()) {

            if ($focus === 'not_started') {

                $practiceEmptyMessage =
                    'No tienes palabras nuevas para practicar en esta categoría.';

            } elseif ($focus === 'learning') {

                $practiceEmptyMessage =
                    'No tienes palabras en aprendizaje para practicar en esta categoría.';

            } elseif ($focus === 'needs_practice') {

                $practiceEmptyMessage =
                    'No tienes palabras que necesiten práctica en esta categoría.';

            }
        }

        /*
        |--------------------------------------------------------------------------
        | PALABRAS QUE EL USUARIO HA FALLADO
        |--------------------------------------------------------------------------
        */

        $incorrectWordIds = $practiceResults
            ->where('is_correct', false)
            ->pluck('english_word_id')
            ->unique()
            ->values()
            ->toArray();

        return view('english.practice', compact(
            'category',
            'words',
            'incorrectWordIds',
            'practiceEmptyMessage',
            'wordPracticeStats'
        ));
    }

    public function mastery(EnglishCategory $category): View
    {
        /*
        |--------------------------------------------------------------------------
        | PALABRAS DE LA CATEGORÍA
        |--------------------------------------------------------------------------
        */

        $words = $category->words()
            ->with('meanings')
            ->orderBy('id', 'asc')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | RESULTADOS DEL USUARIO
        |--------------------------------------------------------------------------
        */

        $results = EnglishPracticeResult::where(
            'user_id',
            auth()->id()
        )
            ->where(
                'english_category_id',
                $category->id
            )
            ->get();

        /*
        |--------------------------------------------------------------------------
        | CALCULAR DOMINIO DE CADA PALABRA
        |--------------------------------------------------------------------------
        */

        $wordMastery = [];

        foreach ($words as $word) {

            $wordResults = $results->where(
                'english_word_id',
                $word->id
            );

            $total = $wordResults->count();

            $correct = $wordResults
                ->where('is_correct', true)
                ->count();

            $incorrect = $wordResults
                ->where('is_correct', false)
                ->count();

            $accuracy = $total > 0
                ? (int) round(
                    ($correct / $total) * 100
                )
                : 0;

            /*
            |--------------------------------------------------------------------------
            | ESTADO DE LA PALABRA
            |--------------------------------------------------------------------------
            */

            if ($total === 0) {

                $level = 'not_started';
                $label = 'Sin practicar';
                $icon = '⚪';

            } elseif ($total < 3) {

                $level = 'learning';
                $label = 'En aprendizaje';
                $icon = '🟡';

            } elseif ($accuracy < 50) {

                $level = 'needs_practice';
                $label = 'Necesita práctica';
                $icon = '🔴';

            } elseif ($accuracy < 80) {

                $level = 'learning';
                $label = 'En aprendizaje';
                $icon = '🟡';

            } elseif ($total < 5) {

                $level = 'learning';
                $label = 'En aprendizaje';
                $icon = '🟡';

            } else {

                $level = 'mastered';
                $label = 'Dominada';
                $icon = '🟢';
            }

            $wordMastery[] = [
                'word' => $word,
                'total' => $total,
                'correct' => $correct,
                'incorrect' => $incorrect,
                'accuracy' => $accuracy,
                'level' => $level,
                'label' => $label,
                'icon' => $icon,
            ];
        }

        return view('english.mastery', compact(
            'category',
            'wordMastery'
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
<?php

namespace App\Http\Controllers;

use App\Models\GrammarCategory;
use App\Models\GrammarExercise;
use App\Models\GrammarLesson;
use App\Models\GrammarTopic;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class GrammarController extends Controller
{
    /**
     * Página principal de Grammar.
     */
    public function index(Request $request)
    {
        $level = $request->get('level', 'A1');

        $categories = GrammarCategory::query()
            ->where('level', $level)
            ->where('status', 1)
            ->withCount([
                'topics' => function ($query) {
                    $query->where('status', 1);
                },
            ])
            ->orderBy('id')
            ->get();

        return view(
            'grammar.index',
            compact(
                'categories',
                'level'
            )
        );
    }

    /**
     * Muestra los Topics de una categoría.
     */
    public function category($id)
    {
        $category = GrammarCategory::query()
            ->where('id', $id)
            ->where('status', 1)
            ->firstOrFail();

        $topics = GrammarTopic::query()
            ->where('category_id', $category->id)
            ->where('status', 1)
            ->withCount([
                'lessons',
            ])
            ->orderBy('sort_order')
            ->get();

        return view(
            'grammar.category',
            compact(
                'category',
                'topics'
            )
        );
    }

    /**
     * Muestra la información de un Topic.
     */
    public function topic($id)
    {
        $topic = GrammarTopic::query()
            ->where('id', $id)
            ->where('status', 1)
            ->with([
                'category',
                'lessons',
            ])
            ->firstOrFail();

        return view(
            'grammar.topic',
            compact('topic')
        );
    }

    /**
     * Muestra una Lesson completa.
     */
    public function lesson($id)
    {
        $lesson = GrammarLesson::query()
            ->where('id', $id)
            ->with([
                'topic.category',
                'rules',
                'examples',
            ])
            ->firstOrFail();

        return view(
            'grammar.lesson',
            compact('lesson')
        );
    }

    /**
     * Pantalla para elegir el tipo de ejercicio.
     */
    public function practice($id)
    {
        $category = GrammarCategory::query()
            ->where('id', $id)
            ->where('status', 1)
            ->firstOrFail();

        $counts = GrammarExercise::query()
            ->join(
                'grammar_topics',
                'grammar_topics.id',
                '=',
                'grammar_exercises.topic_id'
            )
            ->where('grammar_topics.category_id', $category->id)
            ->where('grammar_topics.status', 1)
            ->where('grammar_exercises.status', 1)
            ->selectRaw(
                'grammar_exercises.type, COUNT(*) as total'
            )
            ->groupBy('grammar_exercises.type')
            ->pluck('total', 'type')
            ->map(fn ($total) => (int) $total)
            ->all();

        $topicsCount = GrammarTopic::query()
            ->where('category_id', $category->id)
            ->where('status', 1)
            ->count();

        $exerciseTypes = $this->exerciseTypes();

        return view(
            'grammar.practice',
            compact(
                'category',
                'counts',
                'topicsCount',
                'exerciseTypes'
            )
        );
    }

    /**
     * Devuelve 10 ejercicios del tipo elegido, repartidos
     * entre los temas de la categoría.
     */
    public function practiceStart(Request $request, $id)
    {
        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                'in:'.implode(',', array_keys($this->exerciseTypes())),
            ],
        ]);

        $category = GrammarCategory::query()
            ->where('id', $id)
            ->where('status', 1)
            ->firstOrFail();

        $exercises = $this->pickExercises(
            $category->id,
            $validated['type'],
            10
        );

        if ($exercises->isEmpty()) {
            return response()->json([
                'message' => 'Todavía no hay ejercicios de este tipo en la categoría.',
            ], 422);
        }

        return response()->json([
            'category_id' => $category->id,
            'category' => $category->name,
            'type' => $validated['type'],
            'total' => $exercises->count(),
            'exercises' => $exercises
                ->map(fn (GrammarExercise $exercise) => $this->exercisePayload($exercise))
                ->values(),
        ]);
    }

    /**
     * Comprueba una respuesta y devuelve la explicación.
     */
    public function practiceCheck(Request $request, $id)
    {
        $validated = $request->validate([
            'exercise_id' => ['required', 'integer'],
            'answer' => ['present'],
        ]);

        $category = GrammarCategory::query()
            ->where('id', $id)
            ->where('status', 1)
            ->firstOrFail();

        $exercise = GrammarExercise::query()
            ->where('id', $validated['exercise_id'])
            ->whereHas('topic', function ($query) use ($category) {
                $query
                    ->where('category_id', $category->id)
                    ->where('status', 1);
            })
            ->with('options')
            ->firstOrFail();

        return response()->json(
            $this->evaluateExercise(
                $exercise,
                $validated['answer']
            )
        );
    }

    /**
     * Tipos de ejercicio disponibles.
     */
    private function exerciseTypes(): array
    {
        return [
            'multiple_choice' => [
                'label' => 'Selección múltiple',
                'description' => 'Elige la opción correcta entre varias alternativas.',
                'symbol' => 'A',
            ],
            'fill_in_the_blank' => [
                'label' => 'Completar el espacio',
                'description' => 'Escribe la palabra que falta en la oración.',
                'symbol' => '_',
            ],
            'word_order' => [
                'label' => 'Ordenar palabras',
                'description' => 'Ordena las palabras hasta formar la oración correcta.',
                'symbol' => '↔',
            ],
            'matching' => [
                'label' => 'Relacionar',
                'description' => 'Une cada palabra o expresión con su pareja.',
                'symbol' => '⇄',
            ],
        ];
    }

    /**
     * Selecciona ejercicios en orden circular para repartirlos
     * de forma equitativa entre los temas de la categoría.
     */
    private function pickExercises(
        int $categoryId,
        string $type,
        int $limit
    ): Collection {
        $topics = GrammarTopic::query()
            ->where('category_id', $categoryId)
            ->where('status', 1)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id']);

        if ($topics->isEmpty()) {
            return collect();
        }

        $candidates = GrammarExercise::query()
            ->whereIn('topic_id', $topics->pluck('id'))
            ->where('type', $type)
            ->where('status', 1)
            ->with([
                'topic:id,name',
                'options',
            ])
            ->get()
            ->groupBy('topic_id');

        $buckets = [];

        foreach ($topics as $topic) {
            $buckets[$topic->id] = isset($candidates[$topic->id])
                ? $candidates[$topic->id]->shuffle()->values()->all()
                : [];
        }

        $selected = collect();

        while ($selected->count() < $limit) {
            $added = false;

            foreach ($topics as $topic) {
                if ($selected->count() >= $limit) {
                    break;
                }

                if (! empty($buckets[$topic->id])) {
                    $selected->push(
                        array_shift($buckets[$topic->id])
                    );

                    $added = true;
                }
            }

            if (! $added) {
                break;
            }
        }

        return $selected;
    }

    /**
     * Datos públicos de un ejercicio (sin respuestas).
     */
    private function exercisePayload(GrammarExercise $exercise): array
    {
        $payload = [
            'id' => $exercise->id,
            'type' => $exercise->type,
            'question' => $exercise->question,
            'instruction' => $exercise->instruction,
            'topic' => $exercise->topic?->name,
            'options' => $exercise->options
                ->map(fn ($option) => [
                    'id' => $option->id,
                    'text' => $option->option_text,
                ])
                ->values()
                ->all(),
        ];

        if ($exercise->type === 'word_order') {
            $payload['tokens'] = $this->shuffleTokens(
                $this->wordTokens($exercise->question)
            );
        }

        if ($exercise->type === 'matching') {
            $pairs = $this->matchingPairs($exercise);

            $rightItems = array_column($pairs, 'right');
            shuffle($rightItems);

            $payload['left_items'] = array_column($pairs, 'left');
            $payload['right_items'] = $rightItems;
        }

        return $payload;
    }

    /**
     * Evalúa la respuesta enviada por el estudiante.
     */
    private function evaluateExercise(
        GrammarExercise $exercise,
        mixed $answer
    ): array {
        $correctAnswer = trim((string) $exercise->correct_answer);

        if ($exercise->type === 'multiple_choice') {
            $isCorrect = $this->evaluateMultipleChoice(
                $exercise,
                $answer
            );

            $correctOptions = $exercise->options
                ->where('is_correct', true)
                ->pluck('option_text')
                ->filter()
                ->values();

            if ($correctOptions->isNotEmpty()) {
                $correctAnswer = $correctOptions->implode(' / ');
            }
        } elseif ($exercise->type === 'fill_in_the_blank') {
            $isCorrect = $this->evaluateFillInTheBlank(
                $exercise,
                $answer
            );
        } elseif ($exercise->type === 'word_order') {
            $isCorrect = $this->evaluateWordOrder(
                $exercise,
                $answer
            );
        } elseif ($exercise->type === 'matching') {
            $isCorrect = $this->evaluateMatching(
                $exercise,
                $answer
            );

            $pairs = $this->matchingPairs($exercise);

            if (! empty($pairs)) {
                $correctAnswer = collect($pairs)
                    ->map(fn ($pair) => $pair['left'].' → '.$pair['right'])
                    ->implode('; ');
            }
        } else {
            $isCorrect = false;
        }

        return [
            'correct' => $isCorrect,
            'correct_answer' => $correctAnswer,
            'explanation' => $exercise->explanation,
        ];
    }

    private function evaluateMultipleChoice(
        GrammarExercise $exercise,
        mixed $answer
    ): bool {
        $answers = is_array($answer) ? $answer : [$answer];

        foreach ($exercise->options as $option) {
            if (! $option->is_correct) {
                continue;
            }

            foreach ($answers as $item) {
                if (
                    is_scalar($item) &&
                    (
                        (string) $item === (string) $option->id ||
                        trim((string) $item) ===
                            trim((string) $option->option_text)
                    )
                ) {
                    return true;
                }
            }
        }

        if (! $exercise->options->contains('is_correct', true)) {
            return $this->matchesExactAnswers(
                $exercise,
                $this->answerToText($answer)
            );
        }

        return false;
    }

    private function evaluateFillInTheBlank(
        GrammarExercise $exercise,
        mixed $answer
    ): bool {
        return $this->matchesAcceptedAnswers(
            $exercise,
            $this->answerToText($answer)
        );
    }

    private function evaluateWordOrder(
        GrammarExercise $exercise,
        mixed $answer
    ): bool {
        return $this->matchesAcceptedAnswers(
            $exercise,
            $this->answerToText($answer)
        );
    }

    private function evaluateMatching(
        GrammarExercise $exercise,
        mixed $answer
    ): bool {
        $realPairs = $this->matchingPairs($exercise);

        if (empty($realPairs)) {
            return $this->matchesAcceptedAnswers(
                $exercise,
                $this->answerToText($answer)
            );
        }

        $submittedPairs = [];

        if (is_array($answer)) {
            $isList = array_keys($answer) === range(0, count($answer) - 1);

            if ($isList) {
                foreach ($answer as $item) {
                    if (! is_string($item)) {
                        continue;
                    }

                    $parts = preg_split(
                        '/\s*\|\|\|\s*/u',
                        $item,
                        2
                    );

                    if (count($parts) === 2) {
                        $submittedPairs[] =
                            $this->normalizeAnswer($parts[0]).
                            '|'.
                            $this->normalizeAnswer($parts[1]);
                    }
                }
            } else {
                foreach ($answer as $left => $right) {
                    if (! is_scalar($right)) {
                        continue;
                    }

                    $submittedPairs[] =
                        $this->normalizeAnswer($left).
                        '|'.
                        $this->normalizeAnswer($right);
                }
            }
        }

        $realPairs = array_map(
            fn ($pair) => $this->normalizeAnswer($pair['left']).
                '|'.
                $this->normalizeAnswer($pair['right']),
            $realPairs
        );

        sort($realPairs);
        sort($submittedPairs);

        return $submittedPairs === $realPairs;
    }

    private function matchesExactAnswers(
        GrammarExercise $exercise,
        string $answer
    ): bool {
        $accepted = collect(
            preg_split('/\s*\|\s*/u', (string) $exercise->correct_answer) ?: []
        );

        $accepted = $accepted->merge(
            $exercise->options
                ->where('is_correct', true)
                ->pluck('option_text')
        );

        $answer = trim($answer);

        return $accepted
            ->filter(fn ($item) => trim((string) $item) !== '')
            ->contains(
                fn ($item) => trim((string) $item) === $answer
            );
    }

    private function matchesAcceptedAnswers(
        GrammarExercise $exercise,
        string $answer
    ): bool {
        $accepted = collect(
            preg_split('/\s*\|\s*/u', (string) $exercise->correct_answer) ?: []
        );

        $accepted = $accepted->merge(
            $exercise->options
                ->where('is_correct', true)
                ->pluck('option_text')
        );

        $answer = $this->normalizeAnswer($answer);

        return $accepted
            ->filter(fn ($item) => trim((string) $item) !== '')
            ->contains(
                fn ($item) => $this->normalizeAnswer($item) === $answer
            );
    }

    private function answerToText(mixed $answer): string
    {
        if (is_array($answer)) {
            if (isset($answer['text'])) {
                return (string) $answer['text'];
            }

            return implode(' ', array_filter(
                $answer,
                fn ($item) => is_scalar($item)
            ));
        }

        return (string) $answer;
    }

    private function normalizeAnswer(mixed $value): string
    {
        $value = trim((string) $value);

        $value = preg_replace('/\s+/u', ' ', $value) ?? $value;

        $value = preg_replace(
            '/[^\p{L}\p{N}\'’\s]/u',
            ' ',
            $value
        ) ?? $value;

        return trim(
            preg_replace('/\s+/u', ' ', $value) ?? $value
        );
    }

    private function wordTokens(?string $question): array
    {
        $question = trim((string) $question);

        if ($question === '') {
            return [];
        }

        if (preg_match('/\s*(?:\/|\|)\s*/u', $question)) {
            $tokens = preg_split('/\s*(?:\/|\|)\s*/u', $question) ?: [];
        } else {
            $tokens = preg_split('/\s+/u', $question) ?: [];
        }

        return array_values(array_filter(
            array_map('trim', $tokens),
            fn ($token) => $token !== ''
        ));
    }

    private function shuffleTokens(array $tokens): array
    {
        if (count($tokens) < 2) {
            return $tokens;
        }

        $original = $tokens;

        for ($attempt = 0; $attempt < 5; $attempt++) {
            shuffle($tokens);

            if ($tokens !== $original) {
                break;
            }
        }

        return $tokens;
    }

    private function matchingPairs(GrammarExercise $exercise): array
    {
        $pairs = [];

        foreach ($exercise->options as $option) {
            $parts = $this->splitPair($option->option_text);

            if ($parts !== null) {
                $pairs[] = [
                    'left' => $parts[0],
                    'right' => $parts[1],
                ];
            }
        }

        if (! empty($pairs)) {
            return $pairs;
        }

        $segments = preg_split(
            '/\s*;\s*/u',
            (string) $exercise->correct_answer
        ) ?: [];

        foreach ($segments as $segment) {
            $parts = $this->splitPair($segment);

            if ($parts !== null) {
                $pairs[] = [
                    'left' => $parts[0],
                    'right' => $parts[1],
                ];
            }
        }

        return $pairs;
    }

    private function splitPair(mixed $value): ?array
    {
        $parts = preg_split(
            '/\s*(?:→|↔|->|=>|=|:)\s*/u',
            trim((string) $value),
            2
        ) ?: [];

        if (count($parts) !== 2) {
            return null;
        }

        $left = trim($parts[0]);
        $right = trim($parts[1]);

        if ($left === '' || $right === '') {
            return null;
        }

        return [$left, $right];
    }
}

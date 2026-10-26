<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrammarExercise extends Model
{
    protected $table = 'grammar_exercises';

    protected $fillable = [
        'topic_id',
        'type',
        'question',
        'instruction',
        'correct_answer',
        'explanation',
        'difficulty',
        'points',
        'sort_order',
        'status',
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(
            GrammarTopic::class,
            'topic_id'
        );
    }

    public function options(): HasMany
    {
        return $this->hasMany(
            ExerciseOption::class,
            'exercise_id'
        )->orderBy('sort_order');
    }
}

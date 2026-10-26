<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExerciseOption extends Model
{
    protected $table = 'exercise_options';

    protected $fillable = [
        'exercise_id',
        'option_text',
        'is_correct',
        'sort_order',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(
            GrammarExercise::class,
            'exercise_id'
        );
    }
}

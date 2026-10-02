<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrammarExample extends Model
{
    protected $table = 'grammar_examples';

    protected $fillable = [
        'lesson_id',
        'type',
        'english',
        'spanish',
        'explanation',
        'sort_order',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(
            GrammarLesson::class,
            'lesson_id'
        );
    }
}
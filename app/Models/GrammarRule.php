<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrammarRule extends Model
{
    protected $table = 'grammar_rules';

    protected $fillable = [
        'lesson_id',
        'title',
        'explanation',
        'examples',
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
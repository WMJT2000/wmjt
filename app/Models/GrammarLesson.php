<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrammarLesson extends Model
{
    protected $table = 'grammar_lessons';

    protected $fillable = [
        'topic_id',
        'title',
        'introduction',
        'uses',
        'affirmative_structure',
        'negative_structure',
        'question_structure',
        'short_answers',
        'common_mistakes',
        'summary',
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(
            GrammarTopic::class,
            'topic_id'
        );
    }
}
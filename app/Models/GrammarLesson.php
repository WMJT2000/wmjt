<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'sort_order',
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(
            GrammarTopic::class,
            'topic_id'
        );
    }

    public function rules(): HasMany
    {
        return $this->hasMany(
            GrammarRule::class,
            'lesson_id'
        )->orderBy('sort_order');
    }

    public function examples(): HasMany
    {
        return $this->hasMany(
            GrammarExample::class,
            'lesson_id'
        )->orderBy('sort_order');
    }
}
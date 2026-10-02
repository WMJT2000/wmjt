<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrammarTopic extends Model
{
    protected $table = 'grammar_topics';

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'level',
        'sort_order',
        'status',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            GrammarCategory::class,
            'category_id'
        );
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(
            GrammarLesson::class,
            'topic_id'
        )->orderBy('sort_order');
    }
}
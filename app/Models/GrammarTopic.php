<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
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

    public function lesson(): HasOne
    {
        return $this->hasOne(
            GrammarLesson::class,
            'topic_id'
        );
    }

    public function rules(): HasMany
    {
        return $this->hasMany(
            GrammarRule::class,
            'topic_id'
        )->orderBy('sort_order');
    }

    public function examples(): HasMany
    {
        return $this->hasMany(
            GrammarExample::class,
            'topic_id'
        )->orderBy('sort_order');
    }
}
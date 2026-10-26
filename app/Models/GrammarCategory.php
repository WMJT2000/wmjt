<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class GrammarCategory extends Model
{
    protected $table = 'grammar_categories';

    protected $fillable = [
        'name',
        'description',
        'level',
        'sort_order',
        'status',
    ];

    public function topics(): HasMany
    {
        return $this->hasMany(
            GrammarTopic::class,
            'category_id'
        )->orderBy('sort_order');
    }

    public function lessons(): HasManyThrough
    {
        return $this->hasManyThrough(
            GrammarLesson::class,
            GrammarTopic::class,
            'category_id',
            'topic_id',
            'id',
            'id'
        );
    }
}

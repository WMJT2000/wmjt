<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        );
    }
}
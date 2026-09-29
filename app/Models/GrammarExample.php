<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrammarExample extends Model
{
    protected $table = 'grammar_examples';

    protected $fillable = [
        'topic_id',
        'type',
        'english',
        'spanish',
        'explanation',
        'sort_order',
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(
            GrammarTopic::class,
            'topic_id'
        );
    }
}
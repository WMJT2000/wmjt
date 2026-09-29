<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrammarRule extends Model
{
    protected $table = 'grammar_rules';

    protected $fillable = [
        'topic_id',
        'title',
        'explanation',
        'examples',
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
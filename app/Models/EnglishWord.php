<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnglishWord extends Model
{
    protected $table = 'english_words';

    protected $fillable = [
        'english_category_id',
        'word',
        'example',
        'example_translation',
    ];

    public function category()
    {
        return $this->belongsTo(
            EnglishCategory::class,
            'english_category_id'
        );
    }

    public function meanings()
    {
        return $this->hasMany(
            EnglishMeaning::class,
            'english_word_id'
        );
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnglishMeaning extends Model
{
    protected $table = 'english_meanings';

    protected $fillable = [
        'english_word_id',
        'meaning',
    ];

    public function word()
    {
        return $this->belongsTo(
            EnglishWord::class,
            'english_word_id'
        );
    }
}
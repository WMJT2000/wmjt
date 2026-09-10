<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnglishPracticeResult extends Model
{
    protected $table = 'english_practice_results';

    protected $fillable = [
        'user_id',
        'english_category_id',
        'english_word_id',
        'practice_session_id',
        'question_type',
        'user_answer',
        'correct_answer',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

    public function category()
    {
        return $this->belongsTo(
            EnglishCategory::class,
            'english_category_id'
        );
    }

    public function word()
    {
        return $this->belongsTo(
            EnglishWord::class,
            'english_word_id'
        );
    }


    public function session()
{
    return $this->belongsTo(
        EnglishPracticeSession::class,
        'practice_session_id',
        'practice_session_id'
    );
}
}
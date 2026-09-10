<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnglishPracticeSession extends Model
{
    protected $table = 'english_practice_sessions';

    protected $fillable = [
        'user_id',
        'english_category_id',
        'practice_session_id',
        'practice_mode',
        'total_questions',
        'correct_answers',
        'incorrect_answers',
        'score',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
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

    public function results()
    {
        return $this->hasMany(
            EnglishPracticeResult::class,
            'practice_session_id',
            'practice_session_id'
        );
    }
}
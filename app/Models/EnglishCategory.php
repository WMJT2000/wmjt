<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnglishCategory extends Model
{
    protected $table = 'english_categories';

    protected $fillable = [
        'name',
        'description',
    ];

    public function words()
    {
        return $this->hasMany(
            EnglishWord::class,
            'english_category_id'
        );
    }
}
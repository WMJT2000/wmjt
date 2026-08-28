<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Concept extends Model
{
    protected $table = 'concepts';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'type',
        'description',
        'how_to_use',
        'example',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
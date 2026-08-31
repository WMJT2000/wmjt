<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
////
///
class Technology extends Model
{
    protected $table = 'technologies';

    protected $fillable = [
        'name',
        'description',
    ];

    public function categories()
    {
        return $this->hasMany(Category::class, 'technology_id');
    }
}
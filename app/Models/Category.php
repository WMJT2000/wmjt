<?php
///
namespace App\Models;
//
use Illuminate\Database\Eloquent\Model;
///
class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'technology_id',
        'name',
        'description',
    ];

    public function technology()
    {
        return $this->belongsTo(Technology::class, 'technology_id');
    }

    public function concepts()
    {
        return $this->hasMany(Concept::class, 'category_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Manual extends Model
{
    protected $table = 'manuals';

    protected $fillable = [
        'technology_id',
        'title',
        'slug',
        'description',
        'objective',
        'difficulty',
        'status',
    ];

    public function technology()
    {
        return $this->belongsTo(Technology::class, 'technology_id');
    }

    public function sections()
    {
        return $this->hasMany(ManualSection::class, 'manual_id')
            ->orderBy('position', 'asc');
    }

    public function executions()
    {
        return $this->hasMany(
            ManualExecution::class,
            'manual_id'
        );
    }
}
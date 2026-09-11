<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualSection extends Model
{
    protected $table = 'manual_sections';

    protected $fillable = [
        'manual_id',
        'title',
        'description',
        'position',
    ];

    public function manual()
    {
        return $this->belongsTo(Manual::class, 'manual_id');
    }

    public function steps()
    {
        return $this->hasMany(ManualStep::class, 'section_id')
            ->orderBy('position', 'asc');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualStep extends Model
{
    protected $table = 'manual_steps';

    protected $fillable = [
        'section_id',
        'title',
        'description',
        'instructions',
        'command',
        'code',
        'expected_result',
        'notes',
        'position',
    ];

    public function section()
    {
        return $this->belongsTo(ManualSection::class, 'section_id');
    }

    public function progress()
    {
        return $this->hasMany(
            ManualStepProgress::class,
            'step_id'
        );
    }
}
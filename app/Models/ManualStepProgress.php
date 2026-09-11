<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualStepProgress extends Model
{
    protected $table = 'manual_step_progress';

    protected $fillable = [
        'execution_id',
        'step_id',
        'status',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function execution()
    {
        return $this->belongsTo(
            ManualExecution::class,
            'execution_id'
        );
    }

    public function step()
    {
        return $this->belongsTo(
            ManualStep::class,
            'step_id'
        );
    }
}
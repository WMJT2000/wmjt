<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ManualExecution extends Model
{
    protected $table = 'manual_executions';

    protected $fillable = [
        'manual_id',
        'user_id',
        'current_step_id',
        'status',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function manual()
    {
        return $this->belongsTo(Manual::class, 'manual_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function stepProgress()
    {
        return $this->hasMany(
            ManualStepProgress::class,
            'execution_id'
        );
    }
}
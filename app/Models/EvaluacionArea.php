<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluacionArea extends Model
{
    protected $table = 'evaluacion_areas';

    protected $fillable = [
        'evaluacion_id',
        'nombre',
        'orden',
    ];

    public function evaluacion(): BelongsTo
    {
        return $this->belongsTo(Evaluacion::class);
    }

    public function subareas(): HasMany
    {
        return $this->hasMany(EvaluacionSubarea::class, 'evaluacion_area_id')
            ->orderBy('orden');
    }
}

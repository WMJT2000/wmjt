<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluacionSubarea extends Model
{
    protected $table = 'evaluacion_subareas';

    protected $fillable = [
        'evaluacion_area_id',
        'nombre',
        'orden',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(EvaluacionArea::class, 'evaluacion_area_id');
    }

    public function resultados(): HasMany
    {
        return $this->hasMany(EvaluacionResultado::class, 'evaluacion_subarea_id');
    }
}

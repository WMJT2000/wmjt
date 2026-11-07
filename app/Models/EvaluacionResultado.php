<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluacionResultado extends Model
{
    protected $table = 'evaluacion_resultados';

    protected $fillable = [
        'evaluacion_aplicacion_id',
        'evaluacion_subarea_id',
        'valoracion',
        'observacion',
    ];

    public function aplicacion(): BelongsTo
    {
        return $this->belongsTo(
            EvaluacionAplicacion::class,
            'evaluacion_aplicacion_id'
        );
    }

    public function subarea(): BelongsTo
    {
        return $this->belongsTo(
            EvaluacionSubarea::class,
            'evaluacion_subarea_id'
        );
    }
}

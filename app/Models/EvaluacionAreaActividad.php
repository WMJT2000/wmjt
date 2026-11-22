<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvaluacionAreaActividad extends Model
{
    protected $table = 'evaluacion_areas_actividades';

    protected $fillable = [
        'ev_area_id',
        'titulo',
        'descripcion',
        'fecha',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function evArea(): BelongsTo
    {
        return $this->belongsTo(EvArea::class, 'ev_area_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Actividad extends Model
{
    protected $table = 'actividades';

    protected $fillable = [
        'planificacion_id',
        'seccion',
        'orden',
        'ambito',
        'destreza',
        'estrategias_metologicas',
        'recursos',
        'indicadores_logro',
    ];

    public function planificacion(): BelongsTo
    {
        return $this->belongsTo(Planificacion::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subactividad extends Model
{
    protected $table = 'subactividades';

    protected $fillable = [
        'actividad_id',
        'orden',
        'destreza',
        'estrategias_metologicas',
        'recursos',
        'indicadores_logro',
    ];

    public function actividad(): BelongsTo
    {
        return $this->belongsTo(Actividad::class);
    }
}
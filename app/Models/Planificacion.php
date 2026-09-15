<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Planificacion extends Model
{
    protected $table = 'planificaciones';

    protected $fillable = [
        'user_id',
        'experiencia_aprendizaje',
        'descripcion_general_experiencia',
        'nombre_maestra',
        'tiempo_estimado',
        'fecha',
        'nivel_educativo',
        'objetivo_aprendizaje',
        'elemento_integrador',
        'nocion_dia',
        'tamano_letra_actividades',
        'estado',
        'progreso',
        'es_plantilla',
    ];

    protected $casts = [
        'es_plantilla' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function actividades(): HasMany
    {
        return $this->hasMany(Actividad::class);
    }
}
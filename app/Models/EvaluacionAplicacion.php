<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvaluacionAplicacion extends Model
{
    protected $table = 'evaluacion_aplicaciones';

    protected $fillable = [
        'evaluacion_id',
        'estudiante_id',
        'evaluador_id',
        'intento',
        'estado',
        'fecha_evaluacion',
        'iniciada_en',
        'completada_en',
        'observaciones',
        'recomendaciones',
    ];

    protected $casts = [
        'fecha_evaluacion' => 'date',
        'iniciada_en' => 'datetime',
        'completada_en' => 'datetime',
    ];

    public function evaluacion(): BelongsTo
    {
        return $this->belongsTo(Evaluacion::class);
    }

    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(Estudiante::class)->withTrashed();
    }

    public function evaluador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluador_id');
    }

    public function resultados(): HasMany
    {
        return $this->hasMany(EvaluacionResultado::class);
    }

    public function estaCompleta(): bool
    {
        $totalSubareas = $this->evaluacion->totalSubareas();

        return $this->resultados()
            ->whereNotNull('valoracion')
            ->count() === $totalSubareas;
    }
}

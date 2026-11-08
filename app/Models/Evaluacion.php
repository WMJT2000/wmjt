<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evaluacion extends Model
{
    use SoftDeletes;

    protected $table = 'evaluaciones';

    protected $fillable = [
        'user_id',
        'nombre',
        'tipo_evaluacion',
        'proyecto',
        'docente',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function areas(): HasMany
    {
        return $this->hasMany(EvaluacionArea::class)->orderBy('orden');
    }

    public function subareas(): HasManyThrough
    {
        return $this->hasManyThrough(
            EvaluacionSubarea::class,
            EvaluacionArea::class,
            'evaluacion_id',
            'evaluacion_area_id',
            'id',
            'id'
        );
    }

    public function aplicaciones(): HasMany
    {
        return $this->hasMany(EvaluacionAplicacion::class);
    }

    public function tienePuntuaciones(): bool
    {
        return $this->aplicaciones()
            ->whereHas('resultados')
            ->exists();
    }

    public function puedeEditarse(): bool
    {
        return $this->estado !== 'archivada';
    }

    /**
     * Reabre las aplicaciones completadas que ya no tienen una valoración
     * para todas las subáreas actuales (por ejemplo, al agregar subáreas).
     *
     * @return int Cantidad de aplicaciones reabiertas.
     */
    public function reabrirAplicacionesIncompletas(): int
    {
        $totalSubareas = $this->subareas()->count();

        $reabiertas = 0;

        $this->aplicaciones()
            ->where('estado', 'completada')
            ->withCount('resultados')
            ->get()
            ->each(function (EvaluacionAplicacion $aplicacion) use (
                $totalSubareas,
                &$reabiertas
            ) {
                if ($aplicacion->resultados_count < $totalSubareas) {
                    $aplicacion->update([
                        'estado' => 'en_progreso',
                        'completada_en' => null,
                    ]);

                    $reabiertas++;
                }
            });

        return $reabiertas;
    }

    public function totalSubareas(): int
    {
        $this->loadMissing('areas.subareas');

        return $this->areas->sum(function (EvaluacionArea $area) {
            return $area->subareas->count();
        });
    }
}

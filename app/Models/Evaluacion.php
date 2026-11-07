<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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

    public function aplicaciones(): HasMany
    {
        return $this->hasMany(EvaluacionAplicacion::class);
    }

    public function totalSubareas(): int
    {
        $this->loadMissing('areas.subareas');

        return $this->areas->sum(function (EvaluacionArea $area) {
            return $area->subareas->count();
        });
    }
}

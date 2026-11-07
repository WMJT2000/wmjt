<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estudiante extends Model
{
    use SoftDeletes;

    protected $table = 'estudiantes';

    protected $fillable = [
        'user_id',
        'grupo_id',
        'nombres',
        'apellidos',
        'codigo',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'grupo_id');
    }

    public function aplicaciones(): HasMany
    {
        return $this->hasMany(EvaluacionAplicacion::class, 'estudiante_id');
    }

    public function getNombreCompletoAttribute(): string
    {
        return trim($this->nombres.' '.$this->apellidos);
    }
}

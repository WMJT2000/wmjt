<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EvArea extends Model
{
    protected $table = 'ev_areas';

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function actividades(): HasMany
    {
        return $this->hasMany(EvaluacionAreaActividad::class, 'ev_area_id');
    }
}

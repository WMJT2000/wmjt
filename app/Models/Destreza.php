<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destreza extends Model
{
    protected $table = 'destrezas';

    protected $fillable = [
        'objetivo_aprendizaje_id',
        'edad_min_meses',
        'edad_max_meses',
        'descripcion',
    ];

    public function objetivo()
    {
        return $this->belongsTo(
            'App\\Models\\ObjetivoAprendizaje',
            'objetivo_aprendizaje_id'
        );
    }
}
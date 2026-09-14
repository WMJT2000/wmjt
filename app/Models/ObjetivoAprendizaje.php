<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ambito;
use App\Models\Destreza;

class ObjetivoAprendizaje extends Model
{
    protected $table = 'objetivos_aprendizaje';

    protected $fillable = [
        'ambito_id',
        'descripcion',
    ];

    public function ambito()
    {
        return $this->belongsTo(
            Ambito::class,
            'ambito_id'
        );
    }

    public function destrezas()
    {
        return $this->hasMany(
            Destreza::class,
            'objetivo_aprendizaje_id'
        );
    }
}
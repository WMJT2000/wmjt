<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Version extends Model
{
    protected $table = 'versiones';

    protected $fillable = [
        'nombre',
        'anio',
        'descripcion',
        'activa',
    ];

    protected $casts = [
        'anio' => 'integer',
        'activa' => 'boolean',
    ];

    public function ejes()
    {
        return $this->hasMany(EjeDesarrolloAprendizaje::class, 'version_id');
    }

    public function ambitos()
    {
        return $this->hasMany(Ambito::class, 'version_id');
    }
}
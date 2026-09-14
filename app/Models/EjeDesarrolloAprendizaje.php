<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EjeDesarrolloAprendizaje extends Model
{
    protected $table = 'ejes_desarrollo_aprendizaje';

    protected $fillable = [
        'version_id',
        'nombre',
    ];

    public function version()
    {
        return $this->belongsTo(Version::class, 'version_id');
    }

    public function ambitos()
    {
        return $this->hasMany(Ambito::class, 'eje_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ambito extends Model
{
    protected $table = 'ambitos';

    protected $fillable = [
        'version_id',
        'eje_id',
        'nombre',
        '0_3',
        '3_5',
        'objetivo_subnivel',
    ];

    protected $casts = [
        '0_3' => 'boolean',
        '3_5' => 'boolean',
    ];

    public function version()
    {
        return $this->belongsTo(Version::class, 'version_id');
    }

    public function eje()
    {
        return $this->belongsTo(
            EjeDesarrolloAprendizaje::class,
            'eje_id'
        );
    }

    public function objetivos()
    {
        return $this->hasMany(
            'App\\Models\\ObjetivoAprendizaje',
            'ambito_id'
        );
    }
}
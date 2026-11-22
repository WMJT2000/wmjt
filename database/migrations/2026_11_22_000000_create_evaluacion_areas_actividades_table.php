<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('evaluacion_areas_actividades')) {
            Schema::create('evaluacion_areas_actividades', function (Blueprint $table) {
                $table->id();

                $table->foreignId('evaluacion_area_id')
                    ->constrained('evaluacion_areas')
                    ->cascadeOnDelete();

                $table->string('titulo');
                $table->text('descripcion')->nullable();
                $table->date('fecha')->nullable();

                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluacion_areas_actividades');
    }
};

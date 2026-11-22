<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('evaluacion_areas_actividades', 'evaluacion_area_id')) {
            return;
        }

        Schema::table('evaluacion_areas_actividades', function (Blueprint $table) {
            $table->dropForeign(['evaluacion_area_id']);
        });

        Schema::table('evaluacion_areas_actividades', function (Blueprint $table) {
            $table->renameColumn('evaluacion_area_id', 'ev_area_id');
        });

        Schema::table('evaluacion_areas_actividades', function (Blueprint $table) {
            $table->foreign('ev_area_id')
                ->references('id')
                ->on('ev_areas')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('evaluacion_areas_actividades', 'ev_area_id')) {
            return;
        }

        Schema::table('evaluacion_areas_actividades', function (Blueprint $table) {
            $table->dropForeign(['ev_area_id']);
        });

        Schema::table('evaluacion_areas_actividades', function (Blueprint $table) {
            $table->renameColumn('ev_area_id', 'evaluacion_area_id');
        });

        Schema::table('evaluacion_areas_actividades', function (Blueprint $table) {
            $table->foreign('evaluacion_area_id')
                ->references('id')
                ->on('evaluacion_areas')
                ->cascadeOnDelete();
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('evaluacion_aplicaciones')
            && ! Schema::hasColumn('evaluacion_aplicaciones', 'recomendaciones')) {
            Schema::table('evaluacion_aplicaciones', function (Blueprint $table) {
                $table->text('recomendaciones')
                    ->nullable()
                    ->after('observaciones');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('evaluacion_aplicaciones')
            && Schema::hasColumn('evaluacion_aplicaciones', 'recomendaciones')) {
            Schema::table('evaluacion_aplicaciones', function (Blueprint $table) {
                $table->dropColumn('recomendaciones');
            });
        }
    }
};

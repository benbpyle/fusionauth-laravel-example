<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users',  function (Blueprint $table) {
            $table->text('given_name')->nullable();
            $table->text('family_name')->nullable();
            $table->text('middle_name')->nullable();
            $table->text('zoneinfo')->nullable();
            $table->text('birthdate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users',  function (Blueprint $table) {
            $table->dropColumn('given_name');
            $table->dropColumn('family_name');
            $table->dropColumn('zoneinfo');
            $table->dropColumn('middle_name');
            $table->dropColumn('birthdate');
        });
    }
};

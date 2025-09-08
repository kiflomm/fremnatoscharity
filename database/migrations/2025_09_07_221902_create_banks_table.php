<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->string('display_name_en'); // Display name in English
            $table->string('display_name_am'); // Display name in Amharic
            $table->string('display_name_ti'); // Display name in Tigrinya
            $table->string('logo_url')->nullable(); // URL to bank logo 
            $table->integer('sort_order')->default(0); // Display order
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banks');
    }
};
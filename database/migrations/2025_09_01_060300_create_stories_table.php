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
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('story_title');
            $table->enum('attachment_type', ['image', 'video', 'none'])->default('none');
            $table->string('attachment_url')->nullable();
            $table->longText('story_description');
            $table->string('beneficiary_name')->nullable();
            $table->enum('beneficiary_age_group', ['child', 'youth', 'elder']);
            $table->enum('beneficiary_gender', ['male', 'female']);
            $table->foreignId('created_by')->constrained('users')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};



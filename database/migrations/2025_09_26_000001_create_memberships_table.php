<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('father_name')->nullable();
            $table->string('gender')->nullable();
            $table->unsignedSmallInteger('age')->nullable();
            $table->string('country')->nullable();
            $table->string('region')->nullable();
            $table->string('city')->nullable();
            $table->string('woreda')->nullable();
            $table->string('kebele')->nullable();
            $table->string('profession')->nullable();
            $table->string('education_level')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('help_profession')->nullable();
            $table->decimal('donation_amount', 12, 2)->nullable();
            $table->string('donation_currency', 8)->nullable();
            $table->string('donation_time')->nullable();
            $table->string('property_type')->nullable();
            $table->text('additional_property')->nullable();
            $table->string('property_donation_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};



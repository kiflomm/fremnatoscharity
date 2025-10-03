<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, let's check if there are any existing records with help_profession data
        $existingRecords = DB::table('memberships')
            ->whereNotNull('help_profession')
            ->where('help_profession', '!=', '')
            ->get();

        // Convert existing string data to JSON format
        foreach ($existingRecords as $record) {
            $helpProfession = $record->help_profession;
            
            // If it's already a JSON string, decode and re-encode it
            if (is_string($helpProfession) && $this->isJson($helpProfession)) {
                $decoded = json_decode($helpProfession, true);
                $jsonData = json_encode($decoded);
            } else {
                // If it's a plain string, convert it to a JSON array
                $jsonData = json_encode([$helpProfession]);
            }
            
            DB::table('memberships')
                ->where('id', $record->id)
                ->update(['help_profession' => $jsonData]);
        }

        // Now safely change the column type to JSON
        Schema::table('memberships', function (Blueprint $table) {
            $table->json('help_profession')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert JSON data back to string format
        $existingRecords = DB::table('memberships')
            ->whereNotNull('help_profession')
            ->get();

        foreach ($existingRecords as $record) {
            $helpProfession = $record->help_profession;
            
            if (is_string($helpProfession) && $this->isJson($helpProfession)) {
                $decoded = json_decode($helpProfession, true);
                if (is_array($decoded)) {
                    $stringData = implode(', ', $decoded);
                } else {
                    $stringData = $helpProfession;
                }
            } else {
                $stringData = $helpProfession;
            }
            
            DB::table('memberships')
                ->where('id', $record->id)
                ->update(['help_profession' => $stringData]);
        }

        Schema::table('memberships', function (Blueprint $table) {
            $table->string('help_profession')->nullable()->change();
        });
    }

    /**
     * Check if a string is valid JSON
     */
    private function isJson($string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
};

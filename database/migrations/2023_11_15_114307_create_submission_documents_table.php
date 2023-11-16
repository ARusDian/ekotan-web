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
        Schema::create('submission_documents', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->foreignId('submission_id')->constrained('submissions');
            $table->foreignId('photo_id')->constrained('document_files');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submission_documents');
    }
};

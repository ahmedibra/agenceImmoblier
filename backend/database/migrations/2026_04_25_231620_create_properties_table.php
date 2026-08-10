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
       // database/migrations/xxxx_create_properties_table.php
    Schema::create('properties', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('description');
    $table->string('location');
    $table->decimal('price_per_night', 10, 2);
    $table->integer('bedrooms');
    $table->integer('bathrooms');
    $table->integer('max_guests');
    $table->json('images')->nullable();  // Stocker les chemins des images
    $table->json('amenities')->nullable();
    $table->enum('status', ['available', 'booked', 'maintenance','hidden'])->default('hidden');
    $table->timestamps();
    });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }


};

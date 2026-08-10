<?php
// database/migrations/xxxx_xx_xx_add_hidden_to_properties_status_enum.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Modifier la colonne status pour accepter 'hidden'
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM('available', 'booked', 'maintenance', 'hidden') DEFAULT 'available'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE properties MODIFY COLUMN status ENUM('available', 'booked', 'maintenance') DEFAULT 'available'");
    }
};

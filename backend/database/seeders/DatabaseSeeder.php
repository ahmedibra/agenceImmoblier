<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        // Host user
        $host = User::create([
            'name' => 'Host User',
            'email' => 'host@example.com',
            'password' => Hash::make('password'),
            'role' => 'host'
        ]);

        // Normal user
        User::create([
            'name' => 'Normal User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user'
        ]);

        // Sample properties
        Property::create([
            'user_id' => $host->id,
            'title' => 'Magnifique villa à Casablanca',
            'description' => 'Superbe villa avec piscine, 4 chambres, salon spacieux...',
            'location' => 'Casablanca, Maroc',
            'price_per_night' => 1500,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'max_guests' => 8,
            'images' => ['https://via.placeholder.com/800x500'],
            'amenities' => ['WiFi', 'Piscine', 'Parking', 'Climatisation'],
            'status' => 'available'
        ]);

        Property::create([
            'user_id' => $host->id,
            'title' => 'Bel appartement vue mer à Tanger',
            'description' => 'Appartement moderne avec vue imprenable sur le détroit...',
            'location' => 'Tanger, Maroc',
            'price_per_night' => 800,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'max_guests' => 4,
            'images' => ['https://via.placeholder.com/800x500'],
            'amenities' => ['WiFi', 'Climatisation', 'Cuisine équipée'],
            'status' => 'available'
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\CanResetPassword;
use App\Notifications\CustomResetPasswordNotification;

class User extends Authenticatable implements CanResetPassword
{
    use HasApiTokens, HasFactory, Notifiable, \Illuminate\Auth\Passwords\CanResetPassword;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'phone','address'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relations
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(Property::class, 'favorites')->withTimestamps();
    }

    // Methods
    public function hasFavorited($propertyId)
    {
        return $this->favorites()->where('property_id', $propertyId)->exists();
    }

    public function isHost()
    {
        return $this->role === 'host';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    // Nouvelle méthode pour vérifier si l'utilisateur peut ajouter des biens
    public function canAddProperties()
    {
        // Tous les utilisateurs authentifiés peuvent ajouter des biens
        return true;
    }
public function sendPasswordResetNotification($token)
{
    $email = $this->email;
    // URL de votre frontend React (port 3000)
    $url = 'http://localhost:3000/reset-password?token=' . $token . '&email=' . urlencode($email);

    $this->notify(new CustomResetPasswordNotification($url));
}
}

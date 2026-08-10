<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'location', 'price_per_night',
        'bedrooms', 'bathrooms', 'max_guests', 'images', 'amenities',
        'status', 'latitude', 'longitude', 'availability_text',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'price_per_night' => 'decimal:2',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    // Accessors
    public function getAverageRatingAttribute()
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    public function getReviewsCountAttribute()
    {
        return $this->reviews()->count();
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

      // Solution 2: Ajouter un accesseur pour forcer la conversion
    public function getImagesAttribute($value)
    {
        // Si la valeur est déjà un tableau, la retourner
        if (is_array($value)) {
            return $value;
        }

        // Si c'est une chaîne JSON, la décoder
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }

        // Valeur par défaut
        return [];
    }

    // Solution 3: Ajouter un mutateur pour assurer le bon stockage
    public function setImagesAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['images'] = json_encode($value);
        } else {
            $this->attributes['images'] = $value;
        }
    }

    public function scopeAvailableBetween($query, $startDate, $endDate)
    {
        return $query->whereDoesntHave('bookings', function ($q) use ($startDate, $endDate) {
            $q->where('status', 'confirmed')
              ->where(function ($q) use ($startDate, $endDate) {
                  $q->whereBetween('check_in', [$startDate, $endDate])
                    ->orWhereBetween('check_out', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('check_in', '<=', $startDate)
                          ->where('check_out', '>=', $endDate);
                    });
              });
        });
    }

    // Methods
    public function isAvailableForDates($checkIn, $checkOut)
    {
        if ($this->status !== 'available') return false;

        return !$this->bookings()
            ->where('status', 'confirmed')
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut])
                    ->orWhereBetween('check_out', [$checkIn, $checkOut])
                    ->orWhere(function ($q) use ($checkIn, $checkOut) {
                        $q->where('check_in', '<=', $checkIn)
                          ->where('check_out', '>=', $checkOut);
                    });
            })->exists();
    }

    // Supprimer les images physiquement
    public function deleteImages()
    {
        foreach ($this->images as $image) {
            $path = str_replace('/storage/', 'public/', $image);
            if (Storage::exists($path)) {
                Storage::delete($path);
            }
        }
    }

    // Surcharger la méthode delete pour supprimer les images
    protected static function booted()
    {
        static::deleting(function ($property) {
            $property->deleteImages();
        });
    }
}

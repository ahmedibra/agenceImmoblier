<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        // Vérifier que l'utilisateur a bien terminé son séjour
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($booking->check_out > now()->toDateString()) {
            return response()->json(['message' => 'Vous ne pouvez laisser un avis qu\'après votre séjour'], 400);
        }

        $review = Review::create([
            'booking_id' => $validated['booking_id'],
            'user_id' => $request->user()->id,
            'property_id' => $booking->property_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null
        ]);

        return response()->json($review, 201);
    }
}

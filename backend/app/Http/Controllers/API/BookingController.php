<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = $request->user()->bookings()
            ->with('property')
            ->latest()
            ->paginate(10);

        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'total_price' => 'required|numeric|min:0',
        ]);

        $property = Property::findOrFail($validated['property_id']);

        // Vérifier la disponibilité
        if (!$property->isAvailableForDates($validated['check_in'], $validated['check_out'])) {
            return response()->json(['message' => 'Propriété non disponible pour ces dates'], 400);
        }

        $booking = Booking::create([
            'property_id' => $validated['property_id'],
            'user_id' => $request->user()->id,
            'check_in' => $validated['check_in'],
            'check_out' => $validated['check_out'],
            'total_price' => $validated['total_price'],
            'status' => 'pending'
        ]);

        return response()->json($booking, 201);
    }

    public function show(Booking $booking, Request $request)
    {
        if ($booking->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $booking->load(['property', 'user']);
        return response()->json($booking);
    }

    public function cancel(Booking $booking, Request $request)
    {
        if ($booking->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if ($booking->status !== 'pending') {
            return response()->json(['message' => 'Seules les réservations en attente peuvent être annulées'], 400);
        }

        $booking->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Réservation annulée']);
    }

    public function hostBookings(Request $request)
    {
        $propertyIds = $request->user()->properties()->pluck('id');
        $bookings = Booking::whereIn('property_id', $propertyIds)
            ->with(['property', 'user'])
            ->latest()
            ->paginate(10);

        return response()->json($bookings);
    }

    public function confirmBooking(Booking $booking, Request $request)
    {
        $property = $booking->property;

        if ($property->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $booking->update(['status' => 'confirmed']);
        return response()->json(['message' => 'Réservation confirmée']);
    }

    public function rejectBooking(Booking $booking, Request $request)
    {
        $property = $booking->property;

        if ($property->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $booking->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Réservation refusée']);
    }
}

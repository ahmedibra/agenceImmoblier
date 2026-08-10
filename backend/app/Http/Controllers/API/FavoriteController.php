<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()->favorites()->with('user')->get();
        return response()->json($favorites);
    }

    public function add(Request $request, $propertyId)
    {
        $property = Property::findOrFail($propertyId);

        if ($request->user()->hasFavorited($propertyId)) {
            return response()->json(['message' => 'Déjà dans les favoris'], 400);
        }

        $request->user()->favorites()->attach($propertyId);

        return response()->json(['message' => 'Ajouté aux favoris']);
    }

    public function remove(Request $request, $propertyId)
    {
        $request->user()->favorites()->detach($propertyId);
        return response()->json(['message' => 'Retiré des favoris']);
    }
}

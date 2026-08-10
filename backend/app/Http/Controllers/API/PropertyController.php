<?php
// app/Http/Controllers/API/PropertyController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Mail\NewPropertyNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    /**
     * Afficher la liste des propriétés
     */
    public function index(Request $request)
    {
        try {
            $query = Property::with('user');

            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            } else {
                $query->where('status', 'available');
            }

            if ($request->has('location') && !empty($request->location)) {
                $query->where('location', 'LIKE', "%{$request->location}%");
            }

            if ($request->has('min_price') && is_numeric($request->min_price)) {
                $query->where('price_per_night', '>=', $request->min_price);
            }

            if ($request->has('max_price') && is_numeric($request->max_price)) {
                $query->where('price_per_night', '<=', $request->max_price);
            }

            if ($request->has('bedrooms') && is_numeric($request->bedrooms)) {
                $query->where('bedrooms', '>=', $request->bedrooms);
            }

            if ($request->has('max_guests') && is_numeric($request->max_guests)) {
                $query->where('max_guests', '>=', $request->max_guests);
            }
             // Tri (optionnel)
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);


            $properties = $query->latest()->paginate($request->per_page ?? 12);


        return response()->json([
            'success' => true,
            'data' => $properties
        ]);



        } catch (\Exception $e) {
            Log::error('Erreur index properties: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement',
                'data' => []
            ], 500);
        }
    }

    /**
     * Ajouter une nouvelle propriété
     */
    public function store(Request $request)
    {
        try {
            // Remplacer Auth::check() par $request->user()
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Veuillez vous connecter pour ajouter une propriété'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'location' => 'required|string|max:255',
                'price_per_night' => 'required|numeric|min:0',
                'bedrooms' => 'required|integer|min:1',
                'bathrooms' => 'required|integer|min:1',
                'max_guests' => 'required|integer|min:1',
                'images' => 'nullable|array',
                'amenities' => 'nullable|array',
                'availability_text' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,

                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors(),
                     Log::error('Erreur store property: ' . $validator->errors())
                ], 422);
            }

            $data = $validator->validated();
            $data['user_id'] = $user->id;
            $data['status'] = 'hidden';

            // Les images sont déjà des URLs, on les garde telles quelles
            if (isset($data['images']) && is_array($data['images'])) {
                $data['images'] = json_encode($data['images']);
            }

            $property = Property::create($data);

            // Décoder les images pour la réponse
            if ($property->images && is_string($property->images)) {
                $property->images = json_decode($property->images, true);
            }
            try {
        // Récupérer l'email de l'administrateur (le premier admin ou config)
        $adminEmail = config('mail.admin_email', 'elibrahimihmed@gmail.com');
        Mail::to($adminEmail)->send(new NewPropertyNotification($property, $request->user()));

        Log::info('Email d\'alerte envoyé à l\'administrateur pour la propriété ID ' . $property->id);
    } catch (\Exception $e) {
        Log::error('Erreur lors de l\'envoi de l\'email admin: ' . $e->getMessage());
    }

            return response()->json([
                'success' => true,
                'data' => $property,
                'message' => 'Propriété créée avec succès !'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Erreur store property: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher une propriété spécifique
     */
    public function show($id)
{
    try {
        $property = Property::with('user')->findOrFail($id);

        // FORCER la conversion des images
        if (is_string($property->images)) {
            $property->images = json_decode($property->images, true);
        }

        if (!is_array($property->images)) {
            $property->images = [];
        }

        // Nettoyer les URLs
        $property->images = array_map(function($image) {
            if ($image && !str_starts_with($image, 'http')) {
                return url($image);
            }
            return $image;
        }, $property->images);

        // Faire pareil pour les amenities
        if (is_string($property->amenities)) {
            $property->amenities = json_decode($property->amenities, true);
        }

        return response()->json([
            'success' => true,
            'data' => $property
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Propriété non trouvée'
        ], 404);
    }
}

/**
 * Mettre à jour une propriété avec gestion des images
 */
public function update(Request $request, $id)
{
    try {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez vous connecter'
            ], 401);
        }

        $property = Property::findOrFail($id);

        if ($property->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'price_per_night' => 'sometimes|numeric|min:0',
            'bedrooms' => 'sometimes|integer|min:1',
            'bathrooms' => 'sometimes|integer|min:1',
            'max_guests' => 'sometimes|integer|min:1',
            'amenities' => 'nullable|array',
            'status' => 'sometimes|string|in:available,booked,maintenance',
            'new_images' => 'nullable|array',
            'images_to_delete' => 'nullable|array',
            'availability_text' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Récupérer les images actuelles
        $currentImages = $property->images;
        if (!is_array($currentImages)) {
            if (is_string($currentImages)) {
                $currentImages = json_decode($currentImages, true) ?: [];
            } else {
                $currentImages = [];
            }
        }

        // Nettoyer les URLs - enlever http://localhost:8000 si présent
        $cleanUrl = function($url) {
            if (!$url) return '';
            // Enlever http://localhost:8000
            $url = str_replace('http://localhost:8000', '', $url);
            // Enlever http://127.0.0.1:8000
            $url = str_replace('http://127.0.0.1:8000', '', $url);
            // S'assurer que le chemin commence par /storage/
            if ($url && !str_starts_with($url, '/storage/') && !str_starts_with($url, 'storage/')) {
                if (str_starts_with($url, '/')) {
                    $url = '/storage' . $url;
                } else if (!str_starts_with($url, 'storage')) {
                    $url = '/storage/properties/' . basename($url);
                }
            }
            return $url;
        };

        // 1. Supprimer les images marquées
        if (isset($data['images_to_delete']) && is_array($data['images_to_delete'])) {
            foreach ($data['images_to_delete'] as $imageToDelete) {
                $cleanImage = $cleanUrl($imageToDelete);
                Log::info('Suppression image:', ['original' => $imageToDelete, 'clean' => $cleanImage]);

                // Supprimer le fichier physique
                $path = str_replace('/storage/', 'public/', $cleanImage);
                if (Storage::exists($path)) {
                    Storage::delete($path);
                    Log::info('Fichier supprimé:', ['path' => $path]);
                }

                // Retirer de la liste
                $currentImages = array_values(array_filter($currentImages, function($img) use ($cleanImage) {
                    return $img !== $cleanImage;
                }));
            }
        }

        // 2. Ajouter les nouvelles images
        if (isset($data['new_images']) && is_array($data['new_images'])) {
            foreach ($data['new_images'] as $newImage) {
                $cleanImage = $cleanUrl($newImage);
                Log::info('Ajout image:', ['original' => $newImage, 'clean' => $cleanImage]);
                if (!in_array($cleanImage, $currentImages)) {
                    $currentImages[] = $cleanImage;
                }
            }
        }

        // 3. Mettre à jour les images
        $data['images'] = $currentImages;

        // Nettoyer les champs qu'on ne veut pas envoyer directement
        unset($data['new_images']);
        unset($data['images_to_delete']);

        Log::info('Images finales:', $data['images']);

        // 4. Mettre à jour la propriété
        $property->update($data);

        return response()->json([
            'success' => true,
            'data' => $property,
            'message' => 'Propriété mise à jour avec succès'
        ]);

    } catch (\Exception $e) {
        Log::error('Erreur update: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
        ], 500);
    }
}
      /**
     * Supprimer une propriété et ses images
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Veuillez vous connecter'
                ], 401);
            }

            $property = Property::findOrFail($id);

            // Vérifier que l'utilisateur est le propriétaire
            if ($property->user_id !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Non autorisé'
                ], 403);
            }

            // Supprimer les images physiquement (déclenché par le booted dans le modèle)
            $property->delete();

            return response()->json([
                'success' => true,
                'message' => 'Propriété et ses images supprimées avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur destroy: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les propriétés de l'utilisateur connecté
     */
    public function myProperties(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Veuillez vous connecter'
                ], 401);
            }

            $properties = Property::where('user_id', $user->id)
                ->latest()
                ->paginate(10);

            // Décoder les images pour chaque propriété
            foreach ($properties as $property) {
                if ($property->images && is_string($property->images)) {
                    $property->images = json_decode($property->images, true);
                }
            }

            return response()->json([
                'success' => true,
                'data' => $properties
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur myProperties: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
{
    try {
        $property = Property::findOrFail($id);

        $request->validate([
            'status' => 'required|in:available,booked,maintenance,hidden'
        ]);

        $property->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la mise à jour'
        ], 500);
    }
}
}

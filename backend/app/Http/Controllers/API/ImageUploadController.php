<?php
// app/Http/Controllers/API/ImageUploadController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'images' => 'required|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120'
            ]);

            $uploadedImages = [];

            foreach ($request->file('images') as $image) {
                $filename = Str::random(40) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('properties', $filename, 'public');
                $url = Storage::url($path);
                $uploadedImages[] = $url;
            }

            return response()->json([
                'success' => true,
                'images' => $uploadedImages,
                'message' => count($uploadedImages) . ' image(s) uploadée(s)'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

   public function delete(Request $request)
{
    try {
        $request->validate([
            'image_url' => 'required|string'
        ]);

        $imageUrl = $request->image_url;

        // Extraire le nom du fichier
        $filename = basename($imageUrl);

        // Chemin vers le fichier dans public/storage/properties
        $filePath = public_path('storage/properties/' . $filename);



        if (file_exists($filePath)) {
            unlink($filePath);
            return response()->json([
                'success' => true,
                'message' => 'Image supprimée avec succès'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Fichier non trouvé'
        ], 404);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur: ' . $e->getMessage()
        ], 500);
    }
}
}

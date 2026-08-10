<?php
// app/Http/Controllers/API/ContactController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;
use Illuminate\Support\Facades\Log;


class ContactController extends Controller
{
    /**
     * Envoyer un message de contact
     */
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fullname' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        // Envoi de l'email (optionnel)
       try {
        Log::info('Tentative d\'envoi d\'email', ['to' => config('mail.contact_email')]);
        Mail::to(config('CONTACT_EMAIL', 'elibrahimihmed@gmail.com'))->send(new ContactMail($request->all()));
        Log::info('Email envoyé avec succès');
    } catch (\Exception $e) {
        Log::error('Erreur lors de l\'envoi: ' . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Erreur interne'], 500);
    }

    return response()->json(['success' => true, 'message' => 'Message envoyé']);
}
}

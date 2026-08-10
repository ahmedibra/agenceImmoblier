<?php
// app/Http/Controllers/API/PasswordResetController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Validator;

class PasswordResetController extends Controller
{/**
     * Envoyer le lien de réinitialisation par email
     */
  public function sendResetLinkEmail(Request $request)
{
    $request->validate(['email' => 'required|email|exists:users,email']);

    $response = Password::broker()->sendResetLink(
        $request->only('email')
    );

    return $response === Password::RESET_LINK_SENT
        ? response()->json(['success' => true, 'message' => 'Lien envoyé'])
        : response()->json(['success' => false, 'message' => 'Impossible d\'envoyer le lien'], 500);
}

    /**
     * Réinitialiser le mot de passe
     */
    /**
     * Étape 2 : Réinitialiser le mot de passe
     * POST /api/reset-password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'                 => ['required'],
            'email'                 => ['required', 'email'],
            'password'              => ['required', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password'       => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Mot de passe réinitialisé avec succès.',
            ]);
        }

        return response()->json([
            'message' => __($status),
        ], 422);
    }
}

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;  // ← Ajouter cet import

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Utiliser Auth::check() au lieu de auth()->check()
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return $next($request);
    }
}

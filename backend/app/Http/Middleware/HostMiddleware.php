<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HostMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        if (!in_array($user->role, ['host', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Accès réservé aux hôtes'
            ], 403);
        }

        return $next($request);
    }
}

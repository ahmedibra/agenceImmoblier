<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\HostMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Ajouter Sanctum aux API
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class, \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Exclure les routes API de la vérification CSRF (IMPORTANT)
        $middleware->validateCsrfTokens(except: [
            'api/*',        // Toutes les routes API
            'sanctum/*',    // Routes Sanctum
            'login',        // Connexion
            'register',     // Inscription
            'logout',       // Déconnexion
        ]);

        // Alias des middlewares personnalisés
        $middleware->alias([
            'admin' => AdminMiddleware::class,
            'host' => HostMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();

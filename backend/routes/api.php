<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\FavoriteController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ImageUploadController;
use App\Http\Controllers\API\PasswordResetController;
use App\Http\Controllers\API\ContactController;
// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/contact', [ContactController::class, 'send']);


Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
// Routes protégées
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);

     Route::post('/upload-images', [ImageUploadController::class, 'upload']);
    Route::delete('/delete-image', [ImageUploadController::class, 'delete']);



    Route::get('/my-properties', [PropertyController::class, 'myProperties']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);

    // Properties (host only)
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{property}', [PropertyController::class, 'update']);
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy']);
    Route::patch('/properties/{property}/status', [PropertyController::class, 'updateStatus']);
    Route::get('/my-properties', [PropertyController::class, 'myProperties']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::put('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

    // Host bookings
    Route::get('/host/bookings', [BookingController::class, 'hostBookings']);
    Route::patch('/host/bookings/{booking}/confirm', [BookingController::class, 'confirmBooking']);
    Route::patch('/host/bookings/{booking}/reject', [BookingController::class, 'rejectBooking']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{propertyId}', [FavoriteController::class, 'add']);
    Route::delete('/favorites/{propertyId}', [FavoriteController::class, 'remove']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Admin routes
    Route::middleware(['admin'])->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::put('/admin/users/{user}/role', [UserController::class, 'updateRole']);
        Route::delete('/admin/users/{user}', [UserController::class, 'destroy']);
        Route::patch('/properties/{id}/status', [PropertyController::class, 'updateStatus']);

    });
});

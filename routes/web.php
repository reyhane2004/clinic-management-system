<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppointmentController;

Route::get('/', function () {
    return view('welcome');
});
 Route::get('/appointments', [AppointmentController::class, 'index']);
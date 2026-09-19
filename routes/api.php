<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;

Route::get('/appointments', [
    AppointmentController::class,
    'index'
])->middleware(
    'role:Admin,Doctor,Receptionist,Patient'
);

Route::post('/appointments', [
    AppointmentController::class,
    'store'
])->middleware(
    'role:Admin,Doctor,Receptionist,Patient'
);

Route::put('/appointments/{id}', [
    AppointmentController::class,
    'update'
])->middleware(
    'role:Admin,Receptionist'
);

Route::put('/appointments/{id}/status', [
    AppointmentController::class,
    'updateStatus'
])->middleware(
    'role:Admin,Doctor,Receptionist,Patient'
);

Route::delete('/appointments/{id}', [
    AppointmentController::class,
    'destroy'
])->middleware(
    'role:Admin,Receptionist'
);

Route::get('/patients', [
    PatientController::class,
    'index'
])->middleware(
    'role:Admin,Doctor,Receptionist'
);

Route::post('/patients', [
    PatientController::class,
    'store'
])->middleware(
    'role:Admin,Receptionist'
);

Route::put('/patients/{id}', [
    PatientController::class,
    'update'
])->middleware(
    'role:Admin,Receptionist'
);

Route::delete('/patients/{id}', [
    PatientController::class,
    'destroy'
])->middleware(
    'role:Admin,Receptionist'
);

Route::get('/doctors', [
    DoctorController::class,
    'index'
])->middleware(
    'role:Admin,Doctor,Receptionist,Patient'
);

Route::post('/doctors', [
    DoctorController::class,
    'store'
])->middleware(
    'role:Admin,Doctor,Receptionist'
);

Route::put('/doctors/{id}', [
    DoctorController::class,
    'update'
])->middleware(
    'role:Admin,Doctor,Receptionist'
);

Route::delete('/doctors/{id}', [
    DoctorController::class,
    'destroy'
])->middleware(
    'role:Admin,Receptionist'
);

Route::get('/public/doctors', [
    DoctorController::class,
    'index'
]);

Route::post('/public/appointments', [
    \App\Http\Controllers\PublicAppointmentController::class,
    'store'
]);

Route::get('/departments', [
    DepartmentController::class,
    'index'
]);

Route::get('/test-admin', function () {
    return response()->json([
        'message' =>
            'دسترسی مدیر تأیید شد.'
    ]);
})->middleware('role:Admin');

Route::post('/login', [
    AuthController::class,
    'login'
]);
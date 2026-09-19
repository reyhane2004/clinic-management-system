<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->header('X-User-Id');

        $user = User::with([
            'role',
            'patient',
            'doctor'
        ])->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'کاربر پیدا نشد.'
            ], 401);
        }

$query = Appointment::with([
            'patient.user',
            'doctor.user',
            'doctor.department'
        ]);

        $role = $user->role?->name;

        

        if ($role === 'Patient') {

            $patient = $user->patient;

            if (!$patient) {
                return response()->json([
                    'message' => 'اطلاعات بیمار پیدا نشد.'
                ], 404);
            }

            $query->where(
                'patient_id',
                $patient->id
            );
        }



        if ($role === 'Doctor') {

            $doctor = $user->doctor;

            if (!$doctor) {
                return response()->json([
                    'message' => 'اطلاعات پزشک پیدا نشد.'
                ], 404);
            }

            $query->where(
                'doctor_id',
                $doctor->id
            );
        }

        $appointments = $query
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->get();

        return response()->json(
            $appointments
        );
    }

public function store(Request $request)
    {
        $request->validate([
            'patient_id' =>
                'required|exists:patients,id',

            'doctor_id' =>
                'required|exists:doctors,id',

            'appointment_date' =>
                'required|date',

            'appointment_time' =>
                'required',

            'description' =>
                'nullable|string',
        ]);

        $userId =
            $request->header('X-User-Id');

        $user = User::with([
            'role',
            'patient',
            'doctor'
        ])->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'کاربر پیدا نشد.'
            ], 401);
        }

$role = $user->role?->name;

       

        if ($role === 'Patient') {

            $patient = $user->patient;

            if (!$patient) {
                return response()->json([
                    'message' =>
                        'اطلاعات بیمار پیدا نشد.'
                ], 404);
            }

            if (
                (int) $request->patient_id !==
                (int) $patient->id
            ) {
                return response()->json([
                    'message' =>
                        'بیمار فقط می‌تواند برای خودش نوبت ثبت کند.'
                ], 403);
            }
        }


        if ($role === 'Doctor') {

            $doctor = $user->doctor;

            if (!$doctor) {
                return response()->json([
                    'message' =>
                        'اطلاعات پزشک پیدا نشد.'
                ], 404);
            }

            if (
                (int) $request->doctor_id !==
                (int) $doctor->id
            ) {
                return response()->json([
                    'message' =>
                        'پزشک فقط می‌تواند برای خودش نوبت ثبت کند.'
                ], 403);
            }
        }



        $existingAppointment =
            Appointment::where(
                'doctor_id',
                $request->doctor_id
            )
            ->where(
                'appointment_date',
                $request->appointment_date
            )
            ->where(
                'appointment_time',
                $request->appointment_time
            )
            ->where(
                'status',
                '!=',
                'cancelled'
            )
            ->first();

        if ($existingAppointment) {

            return response()->json([
                'message' =>
                    'این زمان برای پزشک انتخاب‌شده قبلاً رزرو شده است.'
            ], 422);
        }

$appointment = Appointment::create([
            'patient_id' =>
                $request->patient_id,

            'doctor_id' =>
                $request->doctor_id,

            'appointment_date' =>
                $request->appointment_date,

            'appointment_time' =>
                $request->appointment_time,

            'status' =>
                'pending',

            'description' =>
                $request->description,
        ]);

        return response()->json([
            'message' =>
                'نوبت با موفقیت ثبت شد.',

            'appointment' =>
                $appointment->load([
                    'patient.user',
                    'doctor.user',
                    'doctor.department'
                ])
        ], 201);
    }

public function update(
        Request $request,
        $id
    ) {
        $request->validate([
            'patient_id' =>
                'required|exists:patients,id',

            'doctor_id' =>
                'required|exists:doctors,id',

            'appointment_date' =>
                'required|date',

            'appointment_time' =>
                'required',

            'description' =>
                'nullable|string',
        ]);

        $userId =
            $request->header('X-User-Id');

        $user = User::with('role')
            ->find($userId);

        if (!$user) {
            return response()->json([
                'message' =>
                    'کاربر پیدا نشد.'
            ], 401);
        }

        $role = $user->role?->name;


        if (
            !in_array(
                $role,
                ['Admin', 'Receptionist']
            )
        ) {
            return response()->json([
                'message' =>
                    'شما اجازه ویرایش نوبت را ندارید.'
            ], 403);
        }

        $appointment =
            Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'message' =>
                    'نوبت پیدا نشد.'
            ], 404);
        }

        $existingAppointment =
            Appointment::where(
                'doctor_id',
                $request->doctor_id
            )
            ->where(
                'appointment_date',
                $request->appointment_date
            )
            ->where(
                'appointment_time',
                $request->appointment_time
            )

->where(
                'status',
                '!=',
                'cancelled'
            )
            ->where(
                'id',
                '!=',
                $id
            )
            ->first();

        if ($existingAppointment) {

            return response()->json([
                'message' =>
                    'این زمان برای پزشک انتخاب‌شده قبلاً رزرو شده است.'
            ], 422);
        }

        $appointment->update([
            'patient_id' =>
                $request->patient_id,

            'doctor_id' =>
                $request->doctor_id,

            'appointment_date' =>
                $request->appointment_date,

            'appointment_time' =>
                $request->appointment_time,

            'description' =>
                $request->description,
        ]);

        return response()->json([
            'message' =>
                'نوبت با موفقیت ویرایش شد.',

'appointment' =>
                $appointment
                    ->fresh()
                    ->load([
                        'patient.user',
                        'doctor.user',
                        'doctor.department'
                    ])
        ]);
    }

    public function updateStatus(
        Request $request,
        $id
    ) {
        $request->validate([
            'status' =>
                'required|in:pending,confirmed,completed,cancelled',
        ]);

        $userId =
            $request->header('X-User-Id');

        $user = User::with([
            'role',
            'patient',
            'doctor'
        ])->find($userId);

        if (!$user) {
            return response()->json([
                'message' =>
                    'کاربر پیدا نشد.'
            ], 401);
        }

        $appointment =
            Appointment::find($id);

if (!$appointment) {
            return response()->json([
                'message' =>
                    'نوبت پیدا نشد.'
            ], 404);
        }

        $role = $user->role?->name;

        

        if ($role === 'Patient') {

            $patient = $user->patient;

            if (!$patient) {
                return response()->json([
                    'message' =>
                        'اطلاعات بیمار پیدا نشد.'
                ], 404);
            }

            if (
                (int) $appointment->patient_id !==
                (int) $patient->id
            ) {
                return response()->json([
                    'message' =>
                        'شما فقط می‌توانید نوبت خودتان را لغو کنید.'
                ], 403);
            }

            if (
                $request->status !==
                'cancelled'
            ) {
                return response()->json([
                    'message' =>
                        'بیمار فقط می‌تواند نوبت خود را لغو کند.'
                ], 403);
            }
        }



        if ($role === 'Doctor') {

            $doctor = $user->doctor;

            if (!$doctor) {
                return response()->json([
                    'message' =>
                        'اطلاعات پزشک پیدا نشد.'
                ], 404);
            }

            if (
                (int) $appointment->doctor_id !==
                (int) $doctor->id
            ) {
                return response()->json([
                    'message' =>
                        'شما فقط می‌توانید وضعیت نوبت‌های خودتان را تغییر دهید.'
                ], 403);
            }

            if (
                !in_array(
                    $request->status,
                    [
                        'confirmed',
                        'completed',
                        'cancelled'
                    ]
                )
            ) {
                return response()->json([
                    'message' =>
                        'این وضعیت برای پزشک مجاز نیست.'
                ], 403);
            }
        }



        $appointment->status =
            $request->status;

        $appointment->save();

        return response()->json([
            'message' =>
                'وضعیت نوبت با موفقیت تغییر کرد.',

            'appointment' =>
                $appointment
                    ->fresh()
                    ->load([
                        'patient.user',
                        'doctor.user',
                        'doctor.department'
                    ])
        ]);
    }

    public function destroy(
        Request $request,
        $id
    ) {
        $userId =
            $request->header('X-User-Id');

        $user = User::with('role')
            ->find($userId);

        if (!$user) {
            return response()->json([
                'message' =>
                    'کاربر پیدا نشد.'
            ], 401);
        }

        $role = $user->role?->name;



        if (
            !in_array(
                $role,
                ['Admin', 'Receptionist']
            )
        ) {
            return response()->json([
                'message' =>
                    'شما اجازه حذف نوبت را ندارید.'
            ], 403);
        }

        $appointment =
            Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'message' =>
                    'نوبت پیدا نشد.'
            ], 404);
        }

        $appointment->delete();

        return response()->json([
            'message' =>
                'نوبت با موفقیت حذف شد.'
        ]);
    }
}
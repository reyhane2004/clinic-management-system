<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PublicAppointmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'description' => 'nullable|string',
        ]);


        $doctor = Doctor::findOrFail(
            $request->doctor_id
        );

        if (!$doctor->is_available) {

            return response()->json([
                'message' =>
                    'پزشک انتخاب‌شده در حال حاضر فعال نیست.'
            ], 422);

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



        $patientRole = Role::where(
            'name',
            'Patient'
        )->firstOrFail();



        $patient = Patient::where(
            'phone',
            $request->phone
        )->first();


        if (!$patient) {

            $email =
                'patient_' .
                Str::uuid() .
                '@clinic.local';


            $user = User::create([
                'name' => $request->name,
                'email' => $email,
                'password' => Str::random(32),
                'role_id' => $patientRole->id,
            ]);


            $patient = Patient::create([
                'user_id' => $user->id,
                'phone' => $request->phone,
            ]);

        } else {

      

            if ($patient->user) {

                $patient->user->update([
                    'name' => $request->name,
                ]);

            }

        }


        $appointment = Appointment::create([
            'patient_id' =>
                $patient->id,

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
                'نوبت شما با موفقیت ثبت شد.',

            'appointment' =>
                $appointment->load([
                    'patient.user',
                    'doctor.user',
                    'doctor.department'
                ]),
        ], 201);
    }
}
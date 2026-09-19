<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::with('user')->get();

        return response()->json($patients);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:Male,Female',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $patientRole = Role::where('name', 'Patient')->firstOrFail();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role_id' => $patientRole->id,
        ]);

        $patient = Patient::create([
            'user_id' => $user->id,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'Patient created successfully',
            'patient' => $patient->load('user'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::with('user')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $patient->user_id,
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:Male,Female',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $patient->user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $patient->update([
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'بیمار با موفقیت ویرایش شد.',
            'patient' => $patient->fresh()->load('user'),
        ]);
    }

    public function destroy($id)
    {
        $patient = Patient::with('user')->findOrFail($id);

        $user = $patient->user;

        $patient->delete();

        if ($user) {
            $user->delete();
        }

        return response()->json([
            'message' => 'بیمار با موفقیت حذف شد.',
        ]);
    }
}
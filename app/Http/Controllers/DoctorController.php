<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DoctorController extends Controller
{
    public function index()
    {
        $doctors = Doctor::with([
            'user',
            'department'
        ])->get();

        return response()->json($doctors);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'department_id' => 'required|exists:departments,id',
            'medical_license_number' => 'required|string|max:100|unique:doctors,medical_license_number',
            'phone' => 'nullable|string|max:20',
            'consultation_fee' => 'required|numeric|min:0',
            'is_available' => 'boolean',
        ]);

        $doctorRole = Role::where('name', 'Doctor')->firstOrFail();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role_id' => $doctorRole->id,
        ]);

        $profileImage = null;

        if ($request->hasFile('profile_image')) {
            $profileImage = $request
                ->file('profile_image')
                ->store('doctors', 'public');
        }

        $doctor = Doctor::create([
            'user_id' => $user->id,
            'profile_image' => $profileImage,
            'department_id' => $request->department_id,
            'medical_license_number' => $request->medical_license_number,
            'phone' => $request->phone,
            'consultation_fee' => $request->consultation_fee,
            'is_available' => $request->is_available ?? true,
        ]);

        return response()->json([
            'message' => 'پزشک با موفقیت ثبت شد.',
            'doctor' => $doctor->load([
                'user',
                'department'
            ]),
        ], 201);
    }

public function update(Request $request, $id)
    {
        $doctor = Doctor::with('user')->findOrFail($id);

        $userId = $request->header('X-User-Id');

        $currentUser = User::with('role')->find($userId);

        if (!$currentUser) {
            return response()->json([
                'message' => 'کاربر پیدا نشد.'
            ], 401);
        }

        if (
            $currentUser->role &&
            $currentUser->role->name === 'Doctor' &&
            $doctor->user_id != $currentUser->id
        ) {
            return response()->json([
                'message' => 'شما فقط اجازه ویرایش اطلاعات خودتان را دارید.'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $doctor->user_id,
            'department_id' => 'required|exists:departments,id',
            'medical_license_number' => 'required|string|max:100|unique:doctors,medical_license_number,' . $doctor->id,
            'phone' => 'nullable|string|max:20',
            'consultation_fee' => 'required|numeric|min:0',
            'is_available' => 'boolean',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $doctor->user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $profileImage = $doctor->profile_image;

        if ($request->hasFile('profile_image')) {
            $profileImage = $request
                ->file('profile_image')
                ->store('doctors', 'public');
        }

        $doctor->update([
            'department_id' => $request->department_id,
            'medical_license_number' => $request->medical_license_number,
            'phone' => $request->phone,
            'consultation_fee' => $request->consultation_fee,
            'is_available' => $request->is_available ?? false,
            'profile_image' => $profileImage,
        ]);

return response()->json([
            'message' => 'پزشک با موفقیت ویرایش شد.',
            'doctor' => $doctor->fresh()->load([
                'user',
                'department'
            ]),
        ]);
    }

    public function destroy($id)
    {
        $doctor = Doctor::with('user')->findOrFail($id);

        $userId = request()->header('X-User-Id');

        $currentUser = User::with('role')->find($userId);

        if (!$currentUser) {
            return response()->json([
                'message' => 'کاربر پیدا نشد.'
            ], 401);
        }

        if (
            $currentUser->role &&
            $currentUser->role->name === 'Doctor'
        ) {
            return response()->json([
                'message' => 'پزشک اجازه حذف پزشک را ندارد.'
            ], 403);
        }

        $user = $doctor->user;

        $doctor->delete();

        if ($user) {
            $user->delete();
        }

return response()->json([
            'message' => 'پزشک با موفقیت حذف شد.',
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::with([
            'role',
            'patient',
        ])
            ->where('email', $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'ایمیل یا رمز عبور اشتباه است.'
            ], 401);
        }

        return response()->json([
            'message' => 'ورود با موفقیت انجام شد.',
            'user' => $user,
        ]);
    }
}
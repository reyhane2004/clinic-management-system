<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(
        Request $request,
        Closure $next,
        ...$roles
    ): Response {

        $userId = $request->header('X-User-Id');

        if (!$userId) {
            return response()->json([
                'message' => 'لطفاً ابتدا وارد حساب کاربری شوید.'
            ], 401);
        }

        $user = User::with('role')->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'کاربر پیدا نشد.'
            ], 401);
        }

        if (
            !$user->role ||
            !in_array($user->role->name, $roles)
        ) {
            return response()->json([
                'message' => 'شما اجازه دسترسی به این بخش را ندارید.'
            ], 403);
        }

        return $next($request);
    }
}
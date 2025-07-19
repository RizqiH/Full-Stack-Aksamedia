<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\Admin;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Handle admin login
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $admin = Admin::where('username', $credentials['username'])->first();

        if (!$admin || !Hash::check($credentials['password'], $admin->password)) {
            return $this->unauthorizedResponse('Invalid credentials');
        }

        $token = $admin->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'username' => $admin->username,
                'phone' => $admin->phone,
                'email' => $admin->email,
            ],
        ], 'Login successful');
    }

    /**
     * Handle admin logout
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return $this->successResponse(null, 'Logout successful');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to logout', 500);
        }
    }
}

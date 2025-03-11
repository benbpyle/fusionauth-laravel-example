<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class FusionAuthLoginController extends Controller
{
    public function redirectToFusionAuth()
    {
        return Socialite::driver('fusionauth')->redirect();
    }

    public function callbackFusionAuth()
    {
        $user = Socialite::driver('fusionauth')->user();
        $user = User::updateOrCreate([
            'fusionauth_id' => $user->id,
        ], [
            'name' => $user->name,
            'email' => $user->email,
            'given_name' => $user->user['given_name'],
            'family_name' => $user->user['family_name'],
            'middle_name' => $user->user['middle_name'],
            'zoneinfo' => $user->user['zoneinfo'],
            'birthdate' => $user->user['birthdate'],
            'fusionauth_access_token' => $user->token,
            'fusionauth_refresh_token' => $user->refreshToken,
        ]);
        Auth::login($user);

        return redirect('/profile');
    }
}

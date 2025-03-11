<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
/*use Laravel\Sanctum\HasApiTokens;*/

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /* The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'birthdate',
        'family_name',
        'given_name',
        'middle_name',
        'zoneinfo',
        'password',
        'fusionauth_id',
        'fusionauth_access_token',
        'fusionauth_refresh_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     *
     */
    protected $hidden = [
        'password',
        'remember_token',
        'fusionauth_id',
        'fusionauth_access_token',
        'fusionauth_refresh_token',
    ];
    //end::fusionauth[]

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}

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

    public function getFullName()
    {
        return "{$this->given_name} {$this->middle_name} {$this->family_name}";
    }

    //tag::fusionauth[]
    /**
     * The attributes that are mass assignable.
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
     * "birthdate": "1979-01-28",
        "email": "ben@pylecloudtech.com",
        "email_verified": true,
        "family_name": "Pyle",
        "given_name": "Benjamen",
        "middle_name": "B",
        "sub": "62645533-2e8c-44cb-acfe-732caa202bd0",
        "tid": "9707f2c7-ff0c-c661-1ea4-d7dda0ba99db",
        "zoneinfo": "US\/Central"
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

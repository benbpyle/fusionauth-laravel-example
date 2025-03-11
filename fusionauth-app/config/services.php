<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'fusionauth' => [
        'client_id' => env('FUSIONAUTH_CLIENT_ID'),
        'client_secret' => env('FUSIONAUTH_CLIENT_SECRET'),
        'redirect' => env('FUSIONAUTH_REDIRECT_URI'),
        'base_url' => env('FUSIONAUTH_BASE_URL'), // Base URL of your cloud instance or self hosted instance
        'tenant_id' => env('FUSIONAUTH_TENANT_ID'), // Tenant ID of the client (leave blank if you only have one)
    ],

];

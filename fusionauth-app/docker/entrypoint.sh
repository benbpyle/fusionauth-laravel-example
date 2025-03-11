#!/usr/bin/env bash

# Start Nginx service
service nginx start

# Run Laravel migrations
php artisan migrate --force

# Create symbolic link for storage
php artisan storage:link

# Clear and optimize the application cache
php artisan optimize:clear
php artisan optimize

# Start PHP-FPM
php-fpm


<section>
    <header>
        <h2 class="text-lg font-medium text-gray-900">
            {{ __('Profile Information') }}
        </h2>

        <p class="mt-1 text-sm text-gray-600">
            {{ __("Below are your profile details") }}
        </p>
    </header>


        @csrf
        @method('patch')

        <div>
            Full Name: {{ $user->getFullName() }}
        </div>

        <div>
            Email Address: {{ $user->email }}
        </div>

        <div>
            Birthdate: {{ $user->birthdate }}
        </div>
        <div>
            Timezone: {{ $user->zoneinfo }}
        </div>
</section>

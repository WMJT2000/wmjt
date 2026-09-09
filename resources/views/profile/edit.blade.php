@extends('layouts.app')

@section('title', 'Mi perfil')

@section('content')

<div class="dashboard-content profile-page">

    <div class="profile-header">
        <h1>Mi perfil</h1>
        <p>Administra la información de tu cuenta.</p>
    </div>

    <div class="profile-container">

        <div class="profile-section">
            @include('profile.partials.update-profile-information-form')
        </div>

        <div class="profile-section">
            @include('profile.partials.update-password-form')
        </div>

        <div class="profile-section">
            @include('profile.partials.delete-user-form')
        </div>

    </div>

</div>

@endsection
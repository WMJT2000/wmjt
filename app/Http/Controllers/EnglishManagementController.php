<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class EnglishManagementController extends Controller
{
    public function index(): View
    {
        return view('gestion.ingles');
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class KnowledgeManagementController extends Controller
{
    public function index(): View
    {
        return view('gestion.conocimiento');
    }
}
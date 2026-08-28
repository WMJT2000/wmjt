<?php

namespace App\Http\Controllers;

use App\Models\Technology;
use App\Models\Category;
use App\Models\Concept;

class DashboardController extends Controller
{
    public function index()
    {
        $technologies = Technology::count();

        $categories = Category::count();

        $concepts = Concept::count();

        return view('inicio', compact(
            'technologies',
            'categories',
            'concepts'
        ));
    }
}
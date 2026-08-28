<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Concept;
use App\Models\Technology;
use Illuminate\Http\Request;

class KnowledgeController extends Controller
{
    /**
     * Página principal del conocimiento.
     */
    public function index()
    {
        $technologies = Technology::with([
            'categories' => function ($query) {
                $query->withCount('concepts');
            }
        ])
        ->withCount('categories')
        ->orderBy('name')
        ->get();

        return view(
            'knowledge.index',
            compact('technologies')
        );
    }


    /**
     * Mostrar una tecnología.
     */
    public function technology($id)
    {
        $technology = Technology::with([
            'categories' => function ($query) {
                $query
                    ->withCount('concepts')
                    ->orderBy('name');
            }
        ])
        ->withCount('categories')
        ->findOrFail($id);

        return view(
            'knowledge.technology',
            compact('technology')
        );
    }


    /**
     * Mostrar una categoría.
     */
    public function category($id)
    {
        $category = Category::with([
            'technology',
            'concepts'
        ])
        ->withCount('concepts')
        ->findOrFail($id);

        return view(
            'knowledge.category',
            compact('category')
        );
    }


    /**
     * Mostrar un concepto.
     */
    public function concept($id)
    {
        $concept = Concept::with([
            'category.technology'
        ])
        ->findOrFail($id);

        return view(
            'knowledge.concept',
            compact('concept')
        );
    }


    /**
     * Buscar dentro del conocimiento.
     */
    public function search(Request $request)
    {
        $search = trim(
            $request->input('q', '')
        );

        $concepts = Concept::with([
            'category.technology'
        ])
        ->where(function ($query) use ($search) {

            $query
                ->where('name', 'LIKE', "%{$search}%")
                ->orWhere('description', 'LIKE', "%{$search}%")
                ->orWhere('how_to_use', 'LIKE', "%{$search}%")
                ->orWhere('example', 'LIKE', "%{$search}%");

        })
        ->orderBy('name')
        ->get();

        return view(
            'knowledge.search',
            compact(
                'concepts',
                'search'
            )
        );
    }
}
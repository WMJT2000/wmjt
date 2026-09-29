<?php

namespace App\Http\Controllers;

use App\Models\GrammarCategory;
use App\Models\GrammarTopic;
use Illuminate\Http\Request;

class GrammarController extends Controller
{
    /**
     * Página principal de Grammar.
     */
    public function index(Request $request)
    {
        $level = $request->get('level', 'A1');

        $categories = GrammarCategory::query()
            ->where('level', $level)
            ->where('status', 1)
            ->withCount([
                'topics' => function ($query) {
                    $query->where('status', 1);
                }
            ])
            ->orderBy('sort_order')
            ->get();

        return view(
            'grammar.index',
            compact(
                'categories',
                'level'
            )
        );
    }

    /**
     * Muestra los Topics de una categoría.
     */
    public function category($id)
    {
        $category = GrammarCategory::query()
            ->where('id', $id)
            ->where('status', 1)
            ->firstOrFail();

        /*
         * IMPORTANTE:
         * Aquí filtramos por category_id.
         * Así NO aparecen los topics de otras categorías.
         */
        $topics = GrammarTopic::query()
            ->where('category_id', $category->id)
            ->where('status', 1)
            ->orderBy('sort_order')
            ->get();

        return view(
            'grammar.category',
            compact(
                'category',
                'topics'
            )
        );
    }

    /**
     * Muestra la información de un Topic.
     */
    public function topic($id)
    {
        $topic = GrammarTopic::query()
            ->where('id', $id)
            ->where('status', 1)
            ->with('category')
            ->firstOrFail();

        return view(
            'grammar.topic',
            compact('topic')
        );
    }

    /**
     * Muestra la Lesson completa.
     */
    public function lesson($id)
    {
        $topic = GrammarTopic::query()
            ->where('id', $id)
            ->where('status', 1)
            ->with([
                'category',
                'lesson',
                'rules',
                'examples'
            ])
            ->firstOrFail();

        return view(
            'grammar.lesson',
            compact('topic')
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\EnglishMeaning;
use App\Models\EnglishCategory;
use App\Models\EnglishWord;
use Illuminate\Http\Request;

class EnglishMeaningController extends Controller
{

    
    public function page()
    {
        return view('gestion.english-meanings');
    }


    
    public function index(Request $request)
    {
        $query = EnglishMeaning::with([
            'word',
            'word.category'
        ])
            ->orderBy('id', 'asc');

        if ($request->filled('english_word_id')) {
            $query->where(
                'english_word_id',
                $request->integer('english_word_id')
            );
        }

        $meanings = $query->get();

        return response()->json([
            'success' => true,
            'data' => $meanings
        ]);
    }


    
    public function show($id)
    {
        $meaning = EnglishMeaning::with([
            'word',
            'word.category'
        ])
            ->find($id);

        if (!$meaning) {

            return response()->json([
                'success' => false,
                'message' => 'Significado no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,

            'data' => [

                'id' =>
                $meaning->id,

                'english_category_id' =>
                $meaning->word->english_category_id,

                'english_word_id' =>
                $meaning->english_word_id,

                'meaning' =>
                $meaning->meaning,

            ]
        ]);
    }


    
    public function categories()
    {
        $categories = EnglishCategory::orderBy(
            'id',
            'asc'
        )->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }


    
    public function wordsByCategory($categoryId)
    {
        $words = EnglishWord::where(
            'english_category_id',
            $categoryId
        )
            ->orderBy('word', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $words
        ]);
    }


    
    public function store(Request $request)
    {
        $validated = $request->validate([

            'english_word_id' =>
            'required|integer|exists:english_words,id',

            'meaning' =>
            'required|string|max:150',

        ]);

        $meaning = EnglishMeaning::create(
            $validated
        );

        return response()->json([

            'success' => true,

            'message' =>
            'Significado creado correctamente',

            'data' =>
            $meaning

        ], 201);
    }


    
    public function update(
        Request $request,
        $id
    ) {

        $meaning =
            EnglishMeaning::find($id);

        if (!$meaning) {

            return response()->json([

                'success' => false,

                'message' =>
                'Significado no encontrado'

            ], 404);
        }

        $validated = $request->validate([

            'english_word_id' =>
            'sometimes|required|integer|exists:english_words,id',

            'meaning' =>
            'sometimes|required|string|max:150',

        ]);

        $meaning->update(
            $validated
        );

        return response()->json([

            'success' => true,

            'message' =>
            'Significado actualizado correctamente',

            'data' =>
            $meaning

        ]);
    }


    
    public function destroy($id)
    {
        $meaning =
            EnglishMeaning::find($id);

        if (!$meaning) {

            return response()->json([

                'success' => false,

                'message' =>
                'Significado no encontrado'

            ], 404);
        }

        $meaning->delete();

        return response()->json([

            'success' => true,

            'message' =>
            'Significado eliminado correctamente'

        ]);
    }
}

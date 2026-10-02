<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\GrammarImportRequest;
use App\Services\GrammarImportService;
use Illuminate\Http\JsonResponse;

class GrammarImportController extends Controller
{
    public function index()
    {
        return view('admin.grammar.import');
    }


    public function store(
        GrammarImportRequest $request,
        GrammarImportService $importService
    ): JsonResponse {

        $result = $importService->import(
            $request->validated()
        );


        return response()->json([
            'success' => true,

            'message' => 'La importación se completó correctamente.',

            'data' => $result,
        ]);
    }
}
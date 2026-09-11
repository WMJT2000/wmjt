<?php

namespace App\Http\Controllers;
use App\Models\Manual;
use App\Models\ManualSection;
use Illuminate\Http\Request;

class ManualSectionController extends Controller
{
    // GET /api/manual-sections
    public function index()
    {
        $sections = ManualSection::with('manual')
            ->withCount('steps')
            ->orderBy('manual_id', 'asc')
            ->orderBy('position', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }


    // GET /api/manual-sections/{id}
    public function show($id)
    {
        $section = ManualSection::with([
            'manual',
            'steps'
        ])->find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Sección no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $section
        ]);
    }


    // POST /api/manual-sections
    public function store(Request $request)
    {
        $validated = $request->validate([
            'manual_id' => 'required|integer|exists:manuals,id',

            'title' => 'required|string|max:200',

            'description' => 'nullable|string',

            'position' => 'nullable|integer',
        ]);

        $section = ManualSection::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sección creada correctamente',
            'data' => $section
        ], 201);
    }


    // PUT /api/manual-sections/{id}
    public function update(Request $request, $id)
    {
        $section = ManualSection::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Sección no encontrada'
            ], 404);
        }

        $validated = $request->validate([
            'manual_id' => 'sometimes|required|integer|exists:manuals,id',

            'title' => 'sometimes|required|string|max:200',

            'description' => 'nullable|string',

            'position' => 'nullable|integer',
        ]);

        $section->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sección actualizada correctamente',
            'data' => $section
        ]);
    }


    // DELETE /api/manual-sections/{id}
    public function destroy($id)
    {
        $section = ManualSection::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Sección no encontrada'
            ], 404);
        }

        $section->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sección eliminada correctamente'
        ]);
    }


    // GET /api/manual-sections/{id}/steps
    public function steps($id)
    {
        $section = ManualSection::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Sección no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $section->steps
        ]);
    }



    public function page($manualId)
    {
        $manual = Manual::with('technology')
            ->find($manualId);

        if (!$manual) {
            abort(404, 'Manual no encontrado');
        }

        $sections = ManualSection::where('manual_id', $manualId)
            ->withCount('steps')
            ->orderBy('position', 'asc')
            ->get();

        return view(
            'gestion.manual-sections',
            compact('manual', 'sections')
        );
    }


    public function byManual($manualId)
    {
        $sections = ManualSection::where(
            'manual_id',
            $manualId
        )
            ->withCount('steps')
            ->orderBy('position', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sections
        ]);
    }
}
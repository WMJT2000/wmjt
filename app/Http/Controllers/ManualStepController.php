<?php

namespace App\Http\Controllers;

use App\Models\ManualStep;
use Illuminate\Http\Request;
use App\Models\ManualSection;

class ManualStepController extends Controller
{
    // GET /api/manual-steps
    public function index()
    {
        $steps = ManualStep::with([
            'section',
            'section.manual'
        ])
            ->orderBy('section_id', 'asc')
            ->orderBy('position', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $steps
        ]);
    }


    // GET /api/manual-steps/{id}
    public function show($id)
    {
        $step = ManualStep::with([
            'section',
            'section.manual'
        ])->find($id);

        if (!$step) {
            return response()->json([
                'success' => false,
                'message' => 'Paso no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $step
        ]);
    }


    // POST /api/manual-steps
    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_id' => 'required|integer|exists:manual_sections,id',

            'title' => 'required|string|max:200',

            'description' => 'nullable|string',

            'instructions' => 'nullable|string',

            'command' => 'nullable|string',

            'code' => 'nullable|string',

            'expected_result' => 'nullable|string',

            'notes' => 'nullable|string',

            'position' => 'nullable|integer',
        ]);

        $step = ManualStep::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Paso creado correctamente',
            'data' => $step
        ], 201);
    }


    // PUT /api/manual-steps/{id}
    public function update(Request $request, $id)
    {
        $step = ManualStep::find($id);

        if (!$step) {
            return response()->json([
                'success' => false,
                'message' => 'Paso no encontrado'
            ], 404);
        }

        $validated = $request->validate([
            'section_id' => 'sometimes|required|integer|exists:manual_sections,id',

            'title' => 'sometimes|required|string|max:200',

            'description' => 'nullable|string',

            'instructions' => 'nullable|string',

            'command' => 'nullable|string',

            'code' => 'nullable|string',

            'expected_result' => 'nullable|string',

            'notes' => 'nullable|string',

            'position' => 'nullable|integer',
        ]);

        $step->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Paso actualizado correctamente',
            'data' => $step
        ]);
    }


    // DELETE /api/manual-steps/{id}
    public function destroy($id)
    {
        $step = ManualStep::find($id);

        if (!$step) {
            return response()->json([
                'success' => false,
                'message' => 'Paso no encontrado'
            ], 404);
        }

        $step->delete();

        return response()->json([
            'success' => true,
            'message' => 'Paso eliminado correctamente'
        ]);
    }


    public function page($manualId, $sectionId)
    {
        $section = ManualSection::with('manual')
            ->where('id', $sectionId)
            ->where('manual_id', $manualId)
            ->first();

        if (!$section) {
            abort(404, 'Sección no encontrada');
        }

        return view(
            'gestion.manual-steps',
            compact('section')
        );
    }

    public function bySection($sectionId)
    {
        $steps = ManualStep::where('section_id', $sectionId)
            ->orderBy('position', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $steps
        ]);
    }
}
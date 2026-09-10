<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EnglishPronunciationController extends Controller
{
    public function pronounce(Request $request)
    {
        $request->validate([
            'word' => ['required', 'string', 'max:100'],
        ]);

        $word = trim($request->word);

        $apiKey = config('services.gemini.api_key');

        if (!$apiKey) {
            return response()->json([
                'message' => 'No está configurada la API Key de Gemini.'
            ], 500);
        }

        $model = 'gemini-3.1-flash-tts-preview';

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post(
            "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
            [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            [
                                'text' => $word,
                            ],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'responseModalities' => [
                        'audio',
                    ],
                    'temperature' => 1,
                    'speechConfig' => [
                        'voiceConfig' => [
                            'prebuiltVoiceConfig' => [
                                'voiceName' => 'Zephyr',
                            ],
                        ],
                    ],
                ],
            ]
        );
     

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Error al generar la pronunciación.',
                'error' => $response->json(),
            ], 500);
        }

        $data = $response->json();

        $audioData = data_get(
            $data,
            'candidates.0.content.parts.0.inlineData.data'
        );

        if (!$audioData) {
            return response()->json([
                'message' => 'Gemini no devolvió ningún audio.',
                'response' => $data,
            ], 500);
        }

        /*
        |--------------------------------------------------------------------------
        | Convertir PCM/L16 a WAV
        |--------------------------------------------------------------------------
        */

        $pcmData = base64_decode($audioData);

        if ($pcmData === false) {
            return response()->json([
                'message' => 'No se pudo decodificar el audio recibido.'
            ], 500);
        }

        $sampleRate = 24000;
        $channels = 1;
        $bitsPerSample = 16;

        $wavHeader = $this->createWavHeader(
            strlen($pcmData),
            $sampleRate,
            $channels,
            $bitsPerSample
        );

        $wavData = $wavHeader . $pcmData;

        return response()->json([
            'audio' => base64_encode($wavData),
            'mime_type' => 'audio/wav',
        ]);
    }

    private function createWavHeader(
        int $dataLength,
        int $sampleRate,
        int $channels,
        int $bitsPerSample
    ): string {
        $byteRate = $sampleRate * $channels * ($bitsPerSample / 8);
        $blockAlign = $channels * ($bitsPerSample / 8);

        return
            'RIFF' .
            pack('V', 36 + $dataLength) .
            'WAVE' .
            'fmt ' .
            pack('V', 16) .
            pack('v', 1) .
            pack('v', $channels) .
            pack('V', $sampleRate) .
            pack('V', $byteRate) .
            pack('v', $blockAlign) .
            pack('v', $bitsPerSample) .
            'data' .
            pack('V', $dataLength);
    }
}


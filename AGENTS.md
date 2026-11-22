# AGENTS.md

## Stack
- Laravel 10 / PHP 8.1 / MySQL, Breeze 1.29 auth, Blade + vanilla JS (no SPA), Vite 5. Word export via `phpoffice/phpword`; browser Gemini Live via `@google/genai`.
- UI copy and many identifiers are Spanish; tables/models mix Spanish and English. Match surrounding naming.

## Setup
- `composer install`; `npm ci` (or `npm install`); `npm run build` (or `npm run dev`); `php artisan serve`.
- `.env` exists locally but is gitignored and contains live credentials. Never print or commit it.
- `.env.example` is stale: it omits `GEMINI_API_KEY` (server TTS) and `VITE_GEMINI_API_KEY` (browser Gemini Live). Add both when recreating `.env`.
- `php artisan storage:link` is needed for images written to the `public` disk (e.g. Word activity images). `public/build` is generated; do not edit it.
- Word generation needs gitignored `storage/app/plantillas/*.docx` (all of `storage/app` is ignored except `public/`): `planificacion.docx` for `WordController`, `evaluacion.docx` / `evaluacion_horizontal.docx` for `EvaluacionWordService`. It also needs `storage/app/tmp` writable — both services redirect PHP/PHPWord temp files there.

## Database (important)
- Most app tables exist only in the live MySQL DB; there is no full schema dump or seeder. `database/migrations` holds the stock tables plus one guarded additive migration (`2026_11_08_...add_recomendaciones_to_evaluacion_aplicaciones_table.php`).
- `esquema_evaluaciones.txt` (tracked, repo root) is the hand-maintained SQL for the evaluaciones tables — apply manually, it is not a migration. It notes `evaluaciones.grupo_id` is unused: the grupo comes from the estudiante at application time.
- Never run `migrate:fresh`, `migrate:refresh`, `db:wipe`, or `RefreshDatabase` tests against the `.env` DB: they will drop tables the app needs.
- To change schema, add real migrations when explicitly asked; do not assume a fresh DB can rebuild the app.

## Testing / checks
- No CI, no `composer test` script, and no JS lint/test.
- Full tests: `php artisan test` or `vendor\bin\phpunit`. Single test: `php artisan test --filter=TestName` or `vendor\bin\phpunit tests/Feature/Auth/AuthenticationTest.php`.
- `phpunit.xml` leaves DB overrides commented, so tests use the `.env` DB. Use a disposable database for any test run.
- Existing tests are stock Breeze and partly stale (e.g. `/` redirects to `/login` but `ExampleTest` expects 200); they do not cover app features.
- PHP formatting: `vendor\bin\pint` (default Laravel preset, no config).

## Routing / frontend
- `routes/web.php` contains page routes plus some JSON endpoints manually prefixed `/api` (planificaciones). The rest are in `routes/api.php`; check both when adding API routes.
- `/api` routes are session-authenticated, not token-based: the custom `api` middleware group includes cookies/session, and CSRF middleware is absent. Page JS calls relative `/api/...` with `credentials: 'same-origin'`.
- All CSS/JS is bundled through the single Vite entry `resources/js/app.js`; new page assets must be imported there or they will not build. Layouts use `@vite(['resources/js/app.js'])`.
- Registration routes in `routes/auth.php` are inside the `auth` group, so registration requires an authenticated user (unlike stock Breeze).
- Gemini runs both server-side (`config('services.gemini.api_key')` in `EnglishPronunciationController`) and client-side (`VITE_GEMINI_API_KEY` in `resources/js/gemini-live.js`).

## Domain map
- Knowledge: technologies > categories > concepts.
- English: categories > words > meanings, plus practice sessions/results and grammar categories > topics > lessons > rules/examples/exercises/options. Bulk JSON imports live in `app/Http/Controllers/Admin` and `GrammarImportService`.
- Manuals: manuals > sections > steps, with executions and per-step progress.
- Planificaciones: user-owned lesson plans/templates. Word export in `WordController` (`/word/generar`, `generarMultiples`); `/word/crear` points at the missing `resources/views/word/crear.blade.php`, so only `/word/generar` is usable.
- Evaluaciones (newest domain): `evaluaciones` > areas > subareas; `estudiantes` belong to `grupos`; each `evaluacion_aplicaciones` row is per estudiante/intento and holds `evaluacion_resultados` per subarea. Routes live under `/gestion/evaluaciones` in `routes/web.php`; Word export is in `EvaluacionWordService` with `?plantilla=vertical|horizontal` (defaults to vertical).

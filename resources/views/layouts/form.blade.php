<div class="form-container">

    @if(isset($title))
        <h2>{{ $title }}</h2>
    @endif


    @if ($errors->any())

        <div class="errors">

            @foreach ($errors->all() as $error)

                <p>
                    {{ $error }}
                </p>

            @endforeach

        </div>

    @endif


    <form
        id="{{ $formId ?? 'dynamicForm' }}"
        method="{{ $method ?? 'POST' }}"
        action="{{ $action }}"
        class="dynamic-form"
    >

        @csrf


        @foreach ($fields as $field)

            <div class="form-group">

                <label for="{{ $field['name'] }}">
                    {{ $field['label'] ?? $field['name'] }}
                </label>


                @if ($field['type'] === 'textarea')

                    <textarea
                        id="{{ $field['name'] }}"
                        name="{{ $field['name'] }}"
                        placeholder="{{ $field['placeholder'] ?? '' }}"
                        @if(!empty($field['required'])) required @endif
                    >{{ old($field['name'], $field['value'] ?? '') }}</textarea>


                @elseif ($field['type'] === 'select')

                    <select
                        id="{{ $field['name'] }}"
                        name="{{ $field['name'] }}"
                        @if(!empty($field['required'])) required @endif
                    >

                        @if(isset($field['placeholder']))

                            <option value="">
                                {{ $field['placeholder'] }}
                            </option>

                        @endif


                        @foreach ($field['options'] ?? [] as $value => $label)

                            <option
                                value="{{ $value }}"
                                @selected(
                                    old(
                                        $field['name'],
                                        $field['value'] ?? ''
                                    ) == $value
                                )
                            >
                                {{ $label }}
                            </option>

                        @endforeach

                    </select>


                @else

                    <input
                        id="{{ $field['name'] }}"
                        type="{{ $field['type'] }}"
                        name="{{ $field['name'] }}"
                        value="{{ old(
                            $field['name'],
                            $field['value'] ?? ''
                        ) }}"
                        placeholder="{{ $field['placeholder'] ?? '' }}"

                        @if(isset($field['min']))
                            min="{{ $field['min'] }}"
                        @endif

                        @if(isset($field['max']))
                            max="{{ $field['max'] }}"
                        @endif

                        @if(isset($field['maxlength']))
                            maxlength="{{ $field['maxlength'] }}"
                        @endif

                        @if(!empty($field['required']))
                            required
                        @endif
                    >

                @endif


                @error($field['name'])

                    <div class="field-error">
                        {{ $message }}
                    </div>

                @enderror

            </div>

        @endforeach


        <button
            type="submit"
            class="form-button"
        >
            {{ $buttonText ?? 'Enviar' }}
        </button>


    </form>

</div>
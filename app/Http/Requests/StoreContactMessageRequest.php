<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $emailRules = ['email:rfc,dns', 'max:255'];
        if (Auth::check()) {
            array_unshift($emailRules, 'nullable');
        } else {
            array_unshift($emailRules, 'required');
        }

        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => $emailRules,
            'message' => ['required', 'string', 'min:5'],
        ];
    }
}

?>


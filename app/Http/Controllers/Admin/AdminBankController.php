<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Models\Bank;
use App\Models\BankAccount;
use Illuminate\Http\Request;

class AdminBankController extends BaseController
{
    public function index()
    {
        $banks = Bank::with('accounts')->ordered()->get();

        return $this->renderPage('admin/banks', [
            'banks' => $banks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'display_name_en' => ['required', 'string', 'max:255'],
            'display_name_am' => ['nullable', 'string', 'max:255'],
            'display_name_ti' => ['nullable', 'string', 'max:255'],
            'logo_url' => ['nullable', 'url', 'max:2048'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        Bank::create($validated);

        return $this->successResponse('Bank created successfully');
    }

    public function update(Request $request, Bank $bank)
    {
        $validated = $request->validate([
            'display_name_en' => ['required', 'string', 'max:255'],
            'display_name_am' => ['nullable', 'string', 'max:255'],
            'display_name_ti' => ['nullable', 'string', 'max:255'],
            'logo_url' => ['nullable', 'url', 'max:2048'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $bank->update($validated);

        return $this->successResponse('Bank updated successfully');
    }

    public function destroy(Bank $bank)
    {
        $bank->delete();

        return $this->successResponse('Bank deleted successfully');
    }

    public function storeAccount(Request $request, Bank $bank)
    {
        $validated = $request->validate([
            'account_number' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $bank->accounts()->create($validated);

        return $this->successResponse('Bank account added successfully');
    }

    public function updateAccount(Request $request, Bank $bank, BankAccount $account)
    {
        if ($account->bank_id !== $bank->id) {
            return $this->errorResponse('Account does not belong to the specified bank', 404);
        }

        $validated = $request->validate([
            'account_number' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $account->update($validated);

        return $this->successResponse('Bank account updated successfully');
    }

    public function destroyAccount(Bank $bank, BankAccount $account)
    {
        if ($account->bank_id !== $bank->id) {
            return $this->errorResponse('Account does not belong to the specified bank', 404);
        }

        $account->delete();

        return $this->successResponse('Bank account deleted successfully');
    }
}



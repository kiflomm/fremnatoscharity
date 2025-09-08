<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BankController extends Controller
{
    /**
     * Get all banks with their accounts for donation section.
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->query('locale', app()->getLocale());
        
        $banks = Bank::with('accounts')
            ->ordered()
            ->get()
            ->map(function ($bank) use ($locale) {
                return [
                    'id' => $bank->id,
                    'name_key' => $this->getBankNameKey($bank->display_name_en),
                    'display_name' => $this->getLocalizedDisplayName($bank, $locale),
                    'display_name_en' => $bank->display_name_en,
                    'display_name_am' => $bank->display_name_am,
                    'display_name_ti' => $bank->display_name_ti,
                    'logo_url' => $bank->logo_url,
                    'accounts' => $bank->accounts->pluck('account_number')->toArray(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $banks,
        ]);
    }

    /**
     * Get localized display name based on locale.
     */
    private function getLocalizedDisplayName(Bank $bank, string $locale): string
    {
        return match($locale) {
            'am' => $bank->display_name_am,
            'tg' => $bank->display_name_ti,
            default => $bank->display_name_en,
        };
    }

    /**
     * Get bank name key for translation lookup.
     */
    private function getBankNameKey(string $displayName): string
    {
        return match($displayName) {
            'Commercial Bank of Ethiopia' => 'commercial_bank',
            'Wegagen Bank' => 'wegagen_bank',
            'Abyssinia Bank' => 'abyssinia_bank',
            'Awash Bank' => 'awash_bank',
            'Berhan Bank' => 'berhan_bank',
            'Dashen Bank' => 'dashen_bank',
            default => strtolower(str_replace(' ', '_', $displayName)),
        };
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            [
                'display_name_en' => 'Commercial Bank of Ethiopia',
                'display_name_am' => 'ኢትዮጵያ ንግዲ ባንኪ',
                'display_name_ti' => 'ኢትዮጵያ ንግዲ ባንኪ',
                'logo_url' => 'https://images.seeklogo.com/logo-png/54/1/commercial-bank-of-ethiopia-logo-png_seeklogo-547506.png',
                'sort_order' => 1,
                'accounts' => [
                    '1000241223195',
                    '1000564271498', 
                    '1000622132404'
                ]
            ],
            [
                'display_name_en' => 'Wegagen Bank',
                'display_name_am' => 'ወጋገን ባንክ',
                'display_name_ti' => 'ወጋገን ባንክ',
                'logo_url' => 'https://play-lh.googleusercontent.com/Ves7vKxwdSCMXkBX-opA4KDWrYT9pMdktTXfNfczbC1RgFZpBX81RvUTa0ghTbMXRKk=w240-h480-rw',
                'sort_order' => 2,
                'accounts' => [
                    '0827742010102'
                ]
            ],
            [
                'display_name_en' => 'Abyssinia Bank',
                'display_name_am' => 'ኣቢስንያ ባንክ',
                'display_name_ti' => 'ኣቢስንያ ባንክ',
                'logo_url' => 'https://play-lh.googleusercontent.com/W6pOvwi0XCs8nNjZzcnZ91tXn29CBPUlLu4h8JQ1RCPPNMKyEVxYCPEuc4fCaLtw0A=w240-h480-rw',
                'sort_order' => 3,
                'accounts' => [
                    '146309151'
                ]
            ],
            [
                'display_name_en' => 'Awash Bank',
                'display_name_am' => 'ኣዋሽ ባንክ',
                'display_name_ti' => 'ኣዋሽ ባንክ',
                'logo_url' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Awash_International_Bank.png/500px-Awash_International_Bank.png',
                'sort_order' => 4,
                'accounts' => [
                    '013251148569500'
                ]
            ],
            [
                'display_name_en' => 'Berhan Bank',
                'display_name_am' => 'ብርሃን ባንክ',
                'display_name_ti' => 'ብርሃን ባንክ',
                'logo_url' => 'https://play-lh.googleusercontent.com/-faoer9KrEn21VSd63LFDM_wBWkChAftRMjH1wbB5FmTE-79g1Ng7wkblZjCWFkt5yk=w240-h480-rw',
                'sort_order' => 5,
                'accounts' => [
                    '1500700167456'
                ]
            ],
            [
                'display_name_en' => 'Dashen Bank',
                'display_name_am' => 'ዳሽን ባንክ',
                'display_name_ti' => 'ዳሽን ባንክ',
                'logo_url' => 'https://play-lh.googleusercontent.com/iqSg1Sbo332FCja9e99khtAOwyVWZhZp1IRvulU_U9ASnOnnnCxXCFocCEE6PhMVAUw=w240-h480-rw',
                'sort_order' => 6,
                'accounts' => [
                    '5013032975011'
                ]
            ]
        ];

        foreach ($banks as $bankData) {
            // Create the bank record
            $bankId = DB::table('banks')->insertGetId([
                'display_name_en' => $bankData['display_name_en'],
                'display_name_am' => $bankData['display_name_am'],
                'display_name_ti' => $bankData['display_name_ti'],
                'logo_url' => $bankData['logo_url'],
                'sort_order' => $bankData['sort_order'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create bank account records
            foreach ($bankData['accounts'] as $index => $accountNumber) {
                DB::table('bank_accounts')->insert([
                    'bank_id' => $bankId,
                    'account_number' => $accountNumber,
                    'sort_order' => $index + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}

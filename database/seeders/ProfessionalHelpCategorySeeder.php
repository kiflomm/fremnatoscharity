<?php

namespace Database\Seeders;

use App\Models\ProfessionalHelpCategory;
use Illuminate\Database\Seeder;

class ProfessionalHelpCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Medicine',
                'description' => 'Professional help through medical services and healthcare',
                'translations' => [
                    'tg' => 'ብሕክምና',
                    'am' => 'ብሕክምና'
                ],
                'is_active' => true,
                'sort_order' => 1
            ],
            [
                'name' => 'Teaching',
                'description' => 'Professional help through education and teaching services',
                'translations' => [
                    'tg' => 'ብመምህርነት',
                    'am' => 'ብመምህርነት'
                ],
                'is_active' => true,
                'sort_order' => 2
            ],
            [
                'name' => 'Construction',
                'description' => 'Professional help in construction and building sector',
                'translations' => [
                    'tg' => 'ኣብ ኮንስትራክሽን ዘርፊ',
                    'am' => 'ብኮንስትራክሽን ዘርፊ'
                ],
                'is_active' => true,
                'sort_order' => 3
            ],
            [
                'name' => 'Hair Profession',
                'description' => 'Professional help through hair styling and grooming services',
                'translations' => [
                    'tg' => 'ፀጉሪ ሞያ',
                    'am' => 'ብፀጉሪ ሞያ'
                ],
                'is_active' => true,
                'sort_order' => 4
            ],
            [
                'name' => 'Food Profession',
                'description' => 'Professional help through food preparation and culinary services',
                'translations' => [
                    'tg' => 'ምግቢ ሞያ',
                    'am' => 'ብምግቢ ሞያ'
                ],
                'is_active' => true,
                'sort_order' => 5
            ],
            [
                'name' => 'Agriculture',
                'description' => 'Professional help through farming and agricultural services',
                'translations' => [
                    'tg' => 'ብግብርና(ሕርሻ)',
                    'am' => 'ብግብርና(ሕርሻ)'
                ],
                'is_active' => true,
                'sort_order' => 6
            ],
            [
                'name' => 'Computer Science/IT',
                'description' => 'Professional help through computer science and information technology',
                'translations' => [
                    'tg' => 'ብኮምፒተር ሳይነስ/አ.ይ.ቲ/',
                    'am' => 'ብኮምፒተር ሳይነስ/አ.ይ.ቲ/'
                ],
                'is_active' => true,
                'sort_order' => 7
            ],
            [
                'name' => 'Others',
                'description' => 'Other professional help categories not listed above',
                'translations' => [
                    'tg' => 'ብካልኦት',
                    'am' => 'ብካልኦት'
                ],
                'is_active' => true,
                'sort_order' => 8
            ]
        ];

        foreach ($categories as $categoryData) {
            ProfessionalHelpCategory::updateOrCreate(
                ['name' => $categoryData['name']],
                $categoryData
            );
        }
    }
}

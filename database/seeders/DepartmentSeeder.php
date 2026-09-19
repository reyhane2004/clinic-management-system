<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            'پزشکی داخلی',
            'قلب و عروق',
            'پوست و مو',
            'مغز و اعصاب',
            'چشم پزشکی',
            'جراحی عمومی',
            'دندانپزشکی',
        ];

        foreach ($departments as $department) {
            Department::create([
                'name' => $department,
            ]);
        }
    }
}
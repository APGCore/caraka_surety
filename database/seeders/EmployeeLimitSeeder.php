<?php

namespace Database\Seeders;

use App\Models\Guarantor\EmployeeLimit;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\User;
use Illuminate\Database\Seeder;

class EmployeeLimitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Dummy: setiap kombinasi produk-asuransi diberi batas kewenangan nilai
     * jaminan per pengguna (Direksi/Kepala Cabang/Manager), untuk semua asuransi.
     */
    public function run(): void
    {
        // role_id: 2 = Direksi, 3 = Kepala Cabang, 4 = Manager
        $limitByRole = [
            2 => ['limit' => 1_000_000_000, 'limit_inherit' => 500_000_000],
            3 => ['limit' => 400_000_000, 'limit_inherit' => 200_000_000],
            4 => ['limit' => 700_000_000, 'limit_inherit' => 350_000_000],
        ];

        $employees = User::query()->whereIn('role_id', array_keys($limitByRole))->get();

        GuarantorToProductType::all()->each(function (GuarantorToProductType $guarantorToProductType) use ($employees, $limitByRole) {
            $employees->each(function (User $employee) use ($guarantorToProductType, $limitByRole) {
                EmployeeLimit::query()->create([
                    'guarantor_id' => $guarantorToProductType->guarantor_id,
                    'guarantor_to_product_type_id' => $guarantorToProductType->id,
                    'profile_id' => $employee->profile_id,
                    'employee_id' => $employee->id,
                    'limit' => $limitByRole[$employee->role_id]['limit'],
                    'limit_inherit' => $limitByRole[$employee->role_id]['limit_inherit'],
                ]);
            });
        });
    }
}

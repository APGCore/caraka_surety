<?php

namespace App\Http\Controllers;

use App\Models\Guarantor\Guarantor;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function index(Request $request)
    {

        $guarantorId = session('guarantor_id');

        if ($guarantorId) {
            return redirect()->route('login');
        }

        $guarantors = Guarantor::whereNull('headquarter_id')->get(['id', 'name', 'picture']);

        $inertiaProps = [
            'page_settings' => fn() =>  [
                'title' => 'Onboarding',
            ],
            'guarantors' => fn() => $guarantors,

        ];

        $inertiaPage = 'onboarding/index';

        return inertia($inertiaPage, $inertiaProps);
    }


    public function storeGuarantorSession(Request $request)
    {
        $guarantorId = $request->get('guarantor_id');
        $guarantorName = $request->get('guarantor_name');



        if ($guarantorId) {
            session(['guarantor_id' => $guarantorId]);
        } else {
            $guarantorId = session('guarantor_id');
        }

        flashMessage('Berhasil Memilih Asuransi ' . $guarantorName . '!', 'Silahkan masuk dengan akun Anda!.');

        return redirect()->route('login');
    }


    public function resetGuarantorSession(Request $request)
    {
        $guarantorId = session('guarantor_id');

        if ($guarantorId) {
            session()->forget('guarantor_id');
        }

        return redirect()->route('onboarding');
    }
}

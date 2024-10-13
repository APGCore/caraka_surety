<?php

namespace App\Http\Controllers\Scorings;

use App\Http\Controllers\Controller;
use App\Models\ScoringOption;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ScoringOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ScoringOption $scoringOption)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScoringOption $scoringOption)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ScoringOption $scoringOption)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScoringOption $scoringOption)
    {
        //

        try {
            DB::beginTransaction();



            if ($scoringOption->exists) {
                $scoringOption->delete();
                DB::commit();
                flashMessage('Pilihan Pertanyaan Skoring Dihapus', 'Pilihan Pertanyaan Skoring berhasil dihapus');
            } else {
                throw new ThrottleRequestsException('Pilihan Pertanyaan Skoring tidak ditemukan');
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Pilihan Pertanyaan Skoring', 'Terjadi kesalahan saat menghapus Pilihan Pertanyaan Skoring', 'error');
            Log::error('Scoring Question Option Delete: ' . json_encode($th->getMessage(), JSON_PRETTY_PRINT));
        } finally {
            return redirect()->back();
        }
    }
}

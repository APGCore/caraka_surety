<?php

namespace App\Console\Commands;

use App\Enums\SubmissionStatus;
use App\Http\Controllers\InvoiceController;
use App\Models\Submission\Submission;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SendFinanceReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-finance-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengirimkan laporan keuangan';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        try {
            DB::beginTransaction();
            $submissionIds = Submission::query()
                ->where('has_send_to_guarantor', true)
                ->where('has_send_to_finance', false)
                ->limit(50)
                ->pluck('id');

            if ($submissionIds->isEmpty()) {
                $this->info('Tidak ada laporan keuangan yang perlu dikirim.');

                return;
            }

            $invoiceController = app(InvoiceController::class);
            $invoiceController->sendFinanceProcess($submissionIds);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Gagal mengirim laporan keuangan: '.$e->getMessage());

            return;
        }
    }
}

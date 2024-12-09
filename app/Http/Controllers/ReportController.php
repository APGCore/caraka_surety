<?php

namespace App\Http\Controllers;

use App\Http\Resources\Report\InvoiceResource;
use App\Models\Submission\Submission;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function invoice(Request $request)
    {
        $invoices = Submission::search($request->get('search'))
            ->query(function ($query) {
                return $query->with([
                    'blank:id,number',
                    'principal:id,name',
                    'obligee:id,name',
                ]);
            })
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = InvoiceResource::collection($invoices);

        return inertia('report/invoice/index', [
            'page_settings' => [
                'title' => 'Laporan Invoice',
            ],
            'invoices' => fn () => $resource,
        ]);
    }
}

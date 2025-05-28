<?php

namespace App\Traits;

trait currencyConverter
{
    /**
     * Upload file to the storage.
     */
    public function currencyConvert($value): string
    {
        return (int) str_replace('.', '', $value);
    }

    public function formatCurrency($value): string
    {
        return 'Rp. '.number_format($value, 2, ',', '.');
    }
}

<?php

if (! function_exists('flashMessage')) {

    function flashMessage(string $message, string $description, string $type = 'success')
    {
        session()->flash('title', $message);
        session()->flash('description', $description);
        session()->flash('type', $type);
    }
}

<?php

if (! function_exists('flashMessage')) {

    function flashMessage(string $message, string $description, string $type = 'success')
    {
        session()->flash('title', $message);
        session()->flash('description', $description);
        session()->flash('type', $type);
    }

    function convertPattern(string $pattern, string $ka, string $kp, string $kb,
        string $nod = '1', string $nom = '1', string $noy = '1')
    {
        preg_match('/{NOD:(\d+)}/', $pattern, $matchesNod);
        preg_match('/{NOM:(\d+)}/', $pattern, $matchesNom);
        preg_match('/{NOY:(\d+)}/', $pattern, $matchesNoy);
        $nodKey = $matchesNod[0] ?? '{NOD:5}';
        $nomKey = $matchesNom[0] ?? '{NOM:5}';
        $noyKey = $matchesNoy[0] ?? '{NOY:5}';
        $contentTemplate = [
            '{KA}' => $ka,
            '{KP}' => $kp,
            '{KB}' => $kb,
            '{d}' => date('d'),
            '{m}' => date('m'),
            '{y}' => date('y'),
            '{Y}' => date('Y'),
            $nodKey => str_pad($nod, $matchesNod[1] ?? 5, '0', STR_PAD_LEFT),
            $nomKey => str_pad($nom, $matchesNom[1] ?? 5, '0', STR_PAD_LEFT),
            $noyKey => str_pad($noy, $matchesNoy[1] ?? 5, '0', STR_PAD_LEFT),
        ];
        $value = $pattern;
        foreach ($contentTemplate as $key => $val) {
            $value = str_replace($key, $val, $value);
        }

        return $value;
    }
}

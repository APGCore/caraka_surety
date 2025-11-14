<?php

if (! function_exists('flashMessage')) {
    function flashMessage(string $message, string $description, string $type = 'success'): void
    {
        session()->flash('title', $message);
        session()->flash('description', $description);
        session()->flash('type', $type);
    }
}

if (! function_exists('flashMessages')) {
    function flashMessages(array $messages): void
    {
        session()->flash('messages', $messages);
    }
}

if (! function_exists('convertPattern')) {
    function convertPattern(string $pattern, string $ka = '', string $kc = '', string $noa = '', string $kp = '', string $kb = '',
        string $nod = '1', string $nom = '1', string $noy = '1')
    {
        preg_match('/{NOKB:(\d+)}/', $pattern, $matchesNokb);
        preg_match('/{NOD:(\d+)}/', $pattern, $matchesNod);
        preg_match('/{NOM:(\d+)}/', $pattern, $matchesNom);
        preg_match('/{NOY:(\d+)}/', $pattern, $matchesNoy);
        $nokbKey = $matchesNokb[0] ?? '{NOKB:5}';
        $nodKey = $matchesNod[0] ?? '{NOD:5}';
        $nomKey = $matchesNom[0] ?? '{NOM:5}';
        $noyKey = $matchesNoy[0] ?? '{NOY:5}';
        $contentTemplate = [
            '{KA}' => $ka,
            '{KC}' => $kc,
            '{KP}' => $kp,
            '{KB}' => $kb,
            '{NOA}' => $noa,
            '{d}' => date('d'),
            '{m}' => date('m'),
            '{y}' => date('y'),
            '{Y}' => date('Y'),
            $nokbKey => substr($kb, -($matchesNokb[1] ?? 5)),
            $nodKey => str_pad($nod, $matchesNod[1] ?? 5, '0', STR_PAD_LEFT),
            $nomKey => str_pad($nom, $matchesNom[1] ?? 5, '0', STR_PAD_LEFT),
            $noyKey => str_pad($noy, $matchesNoy[1] ?? 5, '0', STR_PAD_LEFT),
        ];
        $lengthNOKB = $matchesNokb[1] ?? 0;
        $lengthNOD = $matchesNod[1] ?? 0;
        $lengthNOM = $matchesNom[1] ?? 0;
        $lengthNOY = $matchesNoy[1] ?? 0;
        $value = $pattern;
        foreach ($contentTemplate as $key => $val) {
            $value = str_replace($key, $val, $value);
        }

        return compact('value', 'lengthNOKB', 'lengthNOD', 'lengthNOM', 'lengthNOY');
    }
}

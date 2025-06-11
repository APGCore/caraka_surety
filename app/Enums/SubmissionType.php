<?php

namespace App\Enums;

enum SubmissionType: string
{
    case NEW = 'new';

    case EDIT = 'edit';

    case REVISION = 'revision';

    public static function getValues(): array
    {
        return [
            self::NEW->value,
            self::EDIT->value,
            self::REVISION->value,
        ];
    }
}

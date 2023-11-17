<?php

namespace App\Enums;

enum SubmissionStatusEnum
{
    case TAKEN; // Submission is taken by user
    case SUBMITTED; // Submission is submitted by user
    case ACCEPTED; // Submission is accepted by admin
    case REJECTED; // Submission is rejected by admin

    public static function casesString()
    {
        return array_map(fn($q) => $q->name, self::cases());
    }
}

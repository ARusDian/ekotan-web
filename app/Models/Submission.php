<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_accepted',
        'description',
        'expired_at',
        'status',
        'latitude',
        'longitude',
        'quest_id',
        'user_id',
    ];

    protected $allowedFilter = [
        'quest.title',
        'user.name',
        'is_accepted',
        'expired_at',
        'status',
    ];

    public function quest()
    {
        return $this->belongsTo(Quest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(SubmissionDocument::class);
    }

    public function scopeWhereColumns($query, $filter)
    {
        if (isset($filter))
        {
            foreach (json_decode($filter) as $value)
            {
                $key = explode('.', $value->id);
                if (!in_array($value->id, $this->allowedFilter))
                {
                    continue;
                }
                if (count($key) > 1)
                {
                    $query->whereHas($key[0], function ($query) use ($value, $key)
                    {
                        return $query->where($key[1], 'like', '%' . $value->value . '%');
                    });
                }
                else
                {
                    $query->where($value->id, 'like', '%' . $value->value . '%');
                }

                if (in_array($key, $this->allowedFilter))
                {
                    $query->where($key, 'like', '%' . $value . '%');
                }
            }
        }
    }

}

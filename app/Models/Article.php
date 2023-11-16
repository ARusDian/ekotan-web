<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'image_id',
        'user_id',
    ];

    protected $allowedFilters = [
        'title',
        'user.name',
    ];

    public function image()
    {
        return $this->belongsTo(DocumentFile::class, 'image_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeWhereColumns($query, $filters)
    {
        if (isset($filters))
        {
            foreach (json_decode($filters) as $value)
            {
                $key = explode('.', $value->id);
                if (!in_array($value->id, $this->allowed))
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

                if (in_array($key, $this->allowed))
                {
                    $query->where($key, 'like', '%' . $value . '%');
                }
            }
        }
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'photo_id',
        'title',
        'description',
        'quantity',
        'point',
        'location',
        'latitude',
        'longitude',
        'expired_at',
    ];

    protected $allowed = [
            'category.name',
            'title',
            'quantity',
            'point',
            'location',
            'latitude',
            'longitude',
        ];

    public function category()
    {
        return $this->belongsTo(QuestCategory::class, "category_id");
    }

    public function image()
    {
        return $this->belongsTo(DocumentFile::class, "image_id");
    }

    public function scopeWhereColumns($query, $filter)
    {
        if(isset($filter)) {
            foreach(json_decode($filter) as $value) {
                $key = explode('.', $value->id);
                if(!in_array($value->id, $this->allowed)) {
                    continue;
                }
                if(count($key) > 1) {
                    $query->whereHas($key[0], function($query) use ($value, $key) {
                        return $query->where($key[1], 'like', '%'.$value->value.'%');
                    });
                } else {
                    $query->where($value->id, 'like', '%'.$value->value.'%');
                }

                if(in_array($key, $this->allowed)) {
                    $query->where($key, 'like', '%'.$value.'%');
                }
            }
        }
    }
}

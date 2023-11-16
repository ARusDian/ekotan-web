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

    public function photo()
    {
        return $this->belongsTo(DocumentFile::class);
    }

    public function scopeWhereColumns($query, $filter)
    {

    }
}

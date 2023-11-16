<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    protected $allowed = [
            'name',
        ];

    public function quests()
    {
        return $this->hasMany(Quest::class, 'category_id');
    }

    public function scopeWhereColumns($query, $filters)
    {
        
        if(isset($filters)) {
            foreach(json_decode($filters) as $value) {
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

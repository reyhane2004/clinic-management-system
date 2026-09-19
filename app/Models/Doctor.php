<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Doctor extends Model
{

    protected $fillable = [
        'user_id',
        'profile_image',
        'department_id',
        'medical_license_number',
        'phone',
        'consultation_fee',
        'is_available',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    //
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}

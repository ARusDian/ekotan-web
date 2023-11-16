<?php

return [
    'center' => [
        'latitude' => env('LOCATION_CENTER_LATITUDE', -0.4570081420115738),
        'longitude' => env('LOCATION_CENTER_LONGITUDE', 117.00166016521293),
    ],
    'bound' => [
        'min' => [
            'latitude' => env('LOCATION_MIN_LATITUDE', -1.1873088240025287),
            'longitude' => env('LOCATION_MIN_LONGITUDE', 116.79290771484376),
        ],
        'max' => [
            'latitude' => env('LOCATION_MAX_LATITUDE', -1.292713168449617),
            'longitude' => env('LOCATION_MAX_LONGITUDE', 117.05039978027345),
        ],
    ],
    'city' => env('LOCATION_CITY', 'Balikpapan'),
];

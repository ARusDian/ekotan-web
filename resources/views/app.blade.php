<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title inertia>{{ config('app.name', 'Laravel') }}</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <!-- Scripts -->
  <script>
    window.LARAVEL_ASSET_URL = "{{ asset('') }}";
  </script>
  @routes
  @viteReactRefresh
  @vite('resources/js/app.tsx')
  @inertiaHead
</head>

<body class="font-sans antialiased">
  @inertia
</body>

</html>

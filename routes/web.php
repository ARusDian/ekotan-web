<?php

use App\Actions\Fortify\UserProfileController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DevController;
use App\Http\Controllers\DocumentFileController;
use App\Http\Controllers\QuestCategoryController;
use App\Http\Controllers\QuestController;
use App\Http\Controllers\UserActivityController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" eiddleware group. Now create something great!
|
*/

Route::get("/", function () {
    return redirect(route("login"));
});


Route::middleware([
    "auth:sanctum",
    config("jetstream.auth_session"),
    "verified",
])->group(function () {
    Route::get("/user/profile", [UserProfileController::class, "show"])->name("profile.show");
    
    Route::middleware(["role:super-admin|admin"])->group(function () {
        Route::get("/dashboard", [DashboardController::class, "index"])->name("dashboard");
        Route::prefix("admin")->group(function () {
            Route::middleware(["role:super-admin"])->group(function () {
                Route::resource("/user", UserController::class);
                Route::post('/user/{user}/restore', [UserController::class, "restore"])->name('user.restore');
                Route::delete('/user/{user}/force-delete', [UserController::class, "forceDelete"])->name('user.force-delete');
                Route::get('/user-ImEx', [UserController::class, "ImportExportView"])->name('ImEx');
                Route::post('/user-import', [UserController::class, "Import"])->name('user.import');
                Route::get('/user-export', [UserController::class, "Export"])->name('user.export');
                Route::get('/user-template', [UserController::class, "Template"])->name('user.import-template');
                Route::get('/user-activity', [UserActivityController::class, "Index"])->name('user-activity');

                Route::prefix('dev')->name('dev.')->group(function () {
                    Route::get('/dump-db', [DevController::class, 'dumpDB'])->name('dump-db');
                    Route::get('/dump-redis', [DevController::class, 'dumpRedis'])->name('dump-redis');
                    Route::get('/dump-storage-logs', [DevController::class, 'dumpStorageLogs'])->name('dump-storage-logs');
                });
    
            });
            Route::resource("quest-category", QuestCategoryController::class);
            Route::resource("quest", QuestController::class);

            Route::resource("document-file", DocumentFileController::class);

        });
    });
});

Route::get("/file/{file}/file", [DocumentFileController::class, "showFile"]);

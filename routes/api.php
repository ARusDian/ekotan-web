<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PrizeController;
use App\Http\Controllers\QuestController;
use App\Http\Controllers\QuestCategoryController;
use App\Http\Controllers\SubmissionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|~
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request)
{
    return json_decode(Auth::user());
});

Route::post('login', [AuthController::class, 'getToken'])->name('api.login');

Route::middleware('auth:sanctum')->group(function ()
{
    Route::get('article', [ArticleController::class, 'indexApi'])->name('api.article.index');
    Route::get('article/{article}', [ArticleController::class, 'showApi'])->name('api.article.show');
    Route::get('prize', [PrizeController::class, 'indexApi'])->name('api.prize.index');
    Route::get('prize/{prize}', [PrizeController::class, 'showApi'])->name('api.prize.show');
    Route::get('quest', [QuestController::class, 'indexApi'])->name('api.quest.index');
    Route::get('quest/{quest}', [QuestController::class, 'showApi'])->name('api.quest.show');
    Route::get('quest-category', [QuestCategoryController::class, 'index'])->name('api.quest-category.index');
    Route::get('quest-category/{questCategory}', [QuestCategoryController::class, 'show'])->name('api.quest-category.show');

    Route::get('user-submission', [SubmissionController::class, 'userSubmissionIndex'])->name('api.submission.index');
    Route::get('user-submission/{submission}', [SubmissionController::class, 'userSubmissionShow'])->name('api.submission.show');
    
    Route::post('accept-submission/{quest}', [SubmissionController::class, 'acceptSubmission'])->name('api.submission.accept');
    Route::post('submit-submission/{submission}', [SubmissionController::class, 'submitSubmission'])->name('api.submission.submit');
});


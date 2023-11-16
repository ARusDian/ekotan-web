<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\DocumentFile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $articles = Article::with(['image', 'user'])
            ->whereColumns($request->get('columnFilters'))
            ->paginate($request->get('perPage') ?? 10);
        return inertia('Admin/Article/Index', [
            'articles' => $articles,
        ]);
    }

    public function indexApi(Request $request)
    {
        //
        $articles = Article::with(['image', 'user'])->get();
        return response()->json($articles);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Admin/Article/Create', [
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'image' => 'required',
            'image.file' => 'required | image | mimes:jpeg,png,jpg,gif,svg',
        ]);

        return DB::transaction(function () use ($request)
        {

            $image_file = $request->file('image.file');
            $image = DocumentFile::createFile(
                'public',
                'articles',
                $image_file,
            );

            $article = Article::create([
                'title' => $request->title,
                'content' => $request->content,
                'image_id' => $image->id,
                'user_id' => Auth::user()->id,
            ]);

            return redirect()->route('article.index')->banner(
                "Article created successfully."
            );
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        //
    }

    public function showApi(Article $article)
    {
        //
        $article = Article::with(['image', 'user'])->findOrFail($article->id);
        return response()->json($article);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Article $article)
    {
        //
        $article = Article::with(['image', 'user'])->findOrFail($article->id);
        return inertia('Admin/Article/Edit', [
            'article' => $article,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Article $article)
    {
        //
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'image' => 'required',
            'image.file' => 'image | mimes:jpeg,png,jpg,gif,svg',
        ]);

        return DB::transaction(function () use ($request, $article)
        {

            $image_file = $request->file('image.file');

            if (isset($image_file))
            {
                $image = $article->image->replaceFile(
                    $image_file,
                );
            }
            else
            {
                $image = $article->image;
            }

            $article->update([
                'title' => $request->title,
                'content' => $request->content,
                'image_id' => $image->id,
                'user_id' => Auth::user()->id,
            ]);

            return redirect()->route('article.index')->banner(
                'article updated successfully'
            );
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        //
        return DB::transaction(function () use ($article)
        {
            $article->delete();
            $article->image->delete();
            $article->image->deleteFile();
            return redirect()->route('article.index')->banner(
                'article deleted successfully'
            );
        });
    }
}

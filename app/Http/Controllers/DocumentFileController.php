<?php

namespace App\Http\Controllers;

use App\Models\DocumentFile;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Storage;

class DocumentFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => [
                'required',
                Rule::in(['user_profile', 'prize', 'quest', 'submission', 'article']),
            ],
            'file' => 'required|image',
        ]);
        $file = $request->file('file');

        $path = '';

        switch ($data['type'])
        {
            case 'user_profile':
                $path = 'user_profile';
                break;
            case 'prize':
                $path = 'prize';
                break;
            case 'quest':
                $path = 'quest';
                break;
            case 'submission':
                $path = 'submission';
                break;
            case 'article':
                $path = 'article';
                break;
        }

        return DocumentFile::createFile('public', $path, $file, auth()->id());
    }

    /**
     * Display the specified resource.
     */
    public function showFile(DocumentFile $file)
    {
        return Storage::disk($file->disk)->response($file->path);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentFile $file)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentFile $file)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentFile $file)
    {
        //
    }
}

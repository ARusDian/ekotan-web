<?php

namespace App\Http\Controllers;

use App\Models\DocumentFile;
use App\Models\Prize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrizeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $prizes = Prize::with('image')
            ->whereColumns($request->get('columnFilters'))
            ->paginate($request->get('perPage') ?? 10);
        return inertia('Admin/Prize/Index', [
            'prizes' => $prizes,
        ]);
    }

    public function indexApi(Request $request)
    {
        //
        $prizes = Prize::with('image')->get();
        return response()->json($prizes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return inertia('Admin/Prize/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'image' => 'required',
            'image.file' => 'required | image | mimes:jpeg,png,jpg,gif,svg',
            'name' => 'required',
            'description' => 'required',
            'price' => 'required',
            'stock' => 'required',
        ]);

        return DB::transaction(function () use ($request) {

            $image_file = $request->file('image.file');
            $image = DocumentFile::createFile(
             'public',
             'prize',
             $image_file,
            );

            $prize = Prize::create([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
                'image_id' => $image->id,
            ]);

            return redirect()->route('prize.index')->banner(
                'Prize created successfully'
            );
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Prize $prize)
    {
        //
    }

    public function showApi(Prize $prize)
    {
        //
        $prize = Prize::with('image')->findOrFail($prize->id);
        return response()->json($prize);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Prize $prize)
    {
        //
        $prize = Prize::with('image')->findOrFail($prize->id);
        return inertia('Admin/Prize/Edit', [
            'prize' => $prize,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Prize $prize)
    {
        //
        $request->validate([
            'image' => 'required',
            'image.file' => ' image | mimes:jpeg,png,jpg,gif,svg',
            'name' => 'required',
            'description' => 'required',
            'price' => 'required',
            'stock' => 'required',
        ]);

        return DB::transaction(function () use ($request, $prize) {

            $image_file = $request->file('image.file');
            
            if(isset($image_file)) {
                $image = $prize->image->replaceFile(
                    $image_file,
                );
            }else{
                $image = $prize->image;
            }

            $prize->update([
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'stock' => $request->stock,
                'image_id' => $image->id,
            ]);

            return redirect()->route('prize.index')->banner(
                'Prize updated successfully'
            );
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Prize $prize)
    {
        //
        return DB::transaction(function () use ($prize)
        {
            $prize->delete();
            $prize->image->delete();
            $prize->image->deleteFile();
            return redirect()->route('prize.index')->banner(
                'Prize deleted successfully'
            );
        });
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\DocumentFile;
use App\Models\Quest;
use App\Models\QuestCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $quests = Quest::with('category')
            ->whereColumns($request->get('columnFilters'))
            ->paginate($request->get('perPage') ?? 10);
        return inertia('Admin/Quest/Index', [
            'quests' => $quests,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $quest_categories = QuestCategory::all();
        return inertia('Admin/Quest/Create', [
            'questCategories' => $quest_categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'category_id' => 'required | exists:quest_categories,id',
            'photo' => 'required',
            'photo.file' => 'required | image | mimes:jpeg,png,jpg,gif,svg',
            'title' => 'required',
            'description' => 'required',
            'quantity' => 'required_if:isQuantity,==,1|required',
            'point' => 'required',
            'location' => 'required',
            'latitude' => 'required_if:isCoordinate,==,1|numeric',
            'longitude' => 'required_if:isCoordinate,==,1|numeric',
            'expired_at' => 'required_if:isExpired,==,1required|date',
        ]);

        return DB::transaction(function () use ($request)
        {
            $photo = $request->file('photo.file');

            if ($request->isCanExpired == 0)
            {
                $request->expired_at = null;
            }

            $photo_file = DocumentFile::createFile(
             'public',
             'quest',
             $photo,
            );


            Quest::create([
                'category_id' => $request->category_id,
                'photo_id' => $photo_file->id,
                'title' => $request->title,
                'description' => $request->description,
                'quantity' => $request->quantity,
                'point' => $request->point,
                'location' => $request->location,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'expired_at' => $request->expired_at,
            ]);
            return redirect()->route('quest.index');

        });

    }

    /**
     * Display the specified resource.
     */
    public function show(Quest $quest)
    {
        //
        $quest = Quest::with('category', 'photo')->findOrFail($quest->id);
        return inertia('Admin/Quest/Show', [
            'quest' => $quest,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Quest $quest)
    {
        //
        $quest_categories = QuestCategory::all();
        $quest = Quest::with('category', 'photo')->findOrFail($quest->id);
        return inertia('Admin/Quest/Edit', [
            'quest' => $quest,
            'questCategories' => $quest_categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quest $quest)
    {
        //
        $request->validate([
            'category_id' => 'required | exists:quest_categories,id',
            'photo' => 'required',
            'photo.file' => ' image | mimes:jpeg,png,jpg,gif,svg',
            'title' => 'required',
            'description' => 'required',
            'quantity' => 'required_if:isQuantity,==,1|required',
            'point' => 'required',
            'location' => 'required',
            'latitude' => 'required_if:isCoordinate,==,1|numeric',
            'longitude' => 'required_if:isCoordinate,==,1|numeric',
            'expired_at' => 'required_if:isExpired,==,1required|date',
        ]);

        return DB::transaction(function () use ($request, $quest)
        {
            $photo = $request->file('photo.file');

            if ($photo)
            {
                $photo_file = DocumentFile::replaceFile(
                    $photo,
                );
            }
            else
            {
                $photo_file = $quest->photo;
            }


            $quest->update([
                'category_id' => $request->category_id,
                'photo_id' => $photo_file->id,
                'title' => $request->title,
                'description' => $request->description,
                'quantity' => $request->quantity,
                'point' => $request->point,
                'location' => $request->location,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'expired_at' => $request->expired_at,
            ]);
            return redirect()->route('quest.index');

        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quest $quest)
    {
        //
        return DB::transaction(function () use ($quest)
        {
            $quest->delete();
            $quest->photo->delete();
            $quest->photo->deleteFile();
            return redirect()->route('quest.index');
        });
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\QuestCategory;
use Illuminate\Http\Request;

class QuestCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $quest_categories = QuestCategory::withCount('quests')
            ->whereColumns($request->get('columnFilters'))
            ->paginate($request->get('perPage') ?? 10);

        return inertia('Admin/QuestCategory/Index', [
            'questCategories' => $quest_categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return inertia('Admin/QuestCategory/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        QuestCategory::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('quest-category.index')->banner(
            "Quest Category created successfully."
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(QuestCategory $questCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QuestCategory $questCategory)
    {
        //
        return inertia('Admin/QuestCategory/Edit', [
            'questCategory' => $questCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, QuestCategory $questCategory)
    {
        //
        $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        $questCategory->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('quest-category.index')->banner(
            "Quest Category updated successfully."
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuestCategory $questCategory)
    {
        //
        $questCategory->delete();
        return redirect()->route('quest-category.index')->banner(
            "Quest Category deleted successfully."
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\DocumentFile;
use App\Models\PointTransaction;
use App\Models\Quest;
use App\Models\Submission;
use App\Models\UserBalance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $submissions = Submission::with(['quest', 'user'])
            ->whereColumns($request->get('columnFilters'))
            ->paginate($request->get('perPage') ?? 10);

        return inertia('Admin/Submission/Index', [
            'submissions' => $submissions,
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Submission $submission)
    {
        //
        $submission = Submission::with(['quest', 'user', 'images'])->find($submission->id);
        return inertia('Admin/Submission/Show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Submission $submission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Submission $submission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Submission $submission)
    {
        //
    }

    public function accept(Submission $submission)
    {
        switch ($submission->status)
        {
            case "TAKEN":
                return response()->json([
                    'status' => 'error',
                    'message' => 'Submission not submitted yet'
                ], 400);
            case "REJECTED":
                return response()->json([
                    'status' => 'error',
                    'message' => 'Submission already rejected'
                ], 400);
            case "ACCEPTED":
                return response()->json([
                    'status' => 'error',
                    'message' => 'Submission already accepted'
                ], 400);
            default:
                break;
        }
        return DB::transaction(function () use ($submission)
        {
            $submission = Submission::with(['quest', 'user.balance'])->findOrFail($submission->id);
            $submission->update([
                'is_accepted' => true,
                'status' => 'ACCEPTED',
            ]);

            if (isset($submission->user->balance))
            {
                $submission->user->balance->update([
                    'point' => $submission->user->balance->balance + $submission->quest->point,
                    'exp' => $submission->user->balance->exp + $submission->quest->point / 100,
                ]);
            }
            else
            {
                UserBalance::create([
                    'user_id' => $submission->user->id,
                    'point' => $submission->quest->point,
                    'exp' => $submission->quest->point / 100,
                ]);
            }

            PointTransaction::create([
                'user_id' => $submission->user->id,
                'point' => $submission->quest->point,
                'description' => '',
                'is_addition' => true,
            ]);

            // TODO: Send notification to user

            return redirect()->route('submission.index')->banner(
                'Submission accepted successfully'
            );
        });
    }

    public function reject(Submission $submission)
    {
        switch ($submission->status)
        {
            case "TAKEN":
                return response()->json([
                    'status' => 'error',
                    'message' => 'Submission not submitted yet'
                ], 400);
            case "REJECTED":
                return response()->json([
                    'status' => 'error',
                    'message' => 'Submission already rejected'
                ], 400);
            case "ACCEPTED":
                return response()->json([
                    'status' => 'error',
                    'message' => 'Submission already accepted'
                ], 400);
            default:
                break;
        }
        return DB::transaction(function () use ($submission)
        {
            $submission = Submission::with(['quest', 'user.balance'])->findOrFail($submission->id);

            $submission->update([
                'is_accepted' => false,
                'status' => 'REJECTED',
            ]);

            $submission->quest->update([
                "quantity" => $submission->quest->quantity + 1,
            ]);

            // TODO: Send notification to user

            return redirect()->route('submission.index')->banner(
                'Submission rejected successfully'
            );
        });
    }

    public function userSubmissionIndex()
    {
        $user = auth()->user();
        $submission = Submission::with("quest")->where('user_id', $user->id)->get();
        return response()->json([
            'status' => 'success',
            'data' => $submission
        ]);
    }

    public function userSubmissionShow(Submission $submission)
    {
        $user = auth()->user();
        $submission = Submission::with(["quest", "images.file"])->find($submission->id);
        if ($submission->user_id == $user->id)
        {
            return response()->json([
                'status' => 'success',
                'data' => $submission
            ]);
        }
        else
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Submission not found'
            ], 404);
        }
    }

    public function acceptSubmission(Quest $quest)
    {
        return DB::transaction(function () use ($quest)
        {
            if ($quest->quantity == 0)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Maximum submission reached'
                ], 400);
            }
            if (Submission::where('quest_id', $quest->id)->where('is_accepted', true)->orWhere('status', '!=', "REJECTED")->exists())
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Submission already accepted'
                ], 400);
            }
            $user = auth()->user();
            $submission = Submission::create([
                'user_id' => $user->id,
                'quest_id' => $quest->id,
                "description" => "",
                'is_accepted' => false,
                "expired_at" => now()->addSeconds($quest->duration),
                'status' => "TAKEN",
            ]);

            $quest->update([
                "quantity" => $quest->quantity - 1,
            ]);

            return response()->json([
                'status' => 'success',
                'data' => $submission
            ]);
        });
    }

    public function submitSubmission(Request $request, Submission $submission)
    {
        return DB::transaction(function () use ($request, $submission)
        {
            if ($submission->status == "SUBMITTED")
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Submission already submitted'
                ], 400);
            }
            $request->validate([
                'description' => 'required',
                'latitude' => 'numeric|nullable',
                'longitude' => 'numeric|nullable',
                'images.*.file' => 'image|mimes:jpeg,png,jpg,gif,svg',
                'images.*.description' => 'string|nullable',
            ]);

            $submission->update([
                "description" => $request->description,
                "latitude" => $request->latitude,
                "longitude" => $request->longitude,
                'status' => "SUBMITTED",
            ]);

            $images = $request->file('images');

            if ($images)
            {
                foreach ($images as $image)
                {
                    $img = DocumentFile::createFile(
                        'public',
                        'submission',
                        $image->file,
                    );
                    $submission->images()->create([
                        $img->id,
                        'description' => $request->description,
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'data' => $submission
            ]);
        });
    }
}

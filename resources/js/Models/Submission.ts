import { User } from "@/types";
import { QuestModel } from "./Quest";
import { BaseDocumentFileModel } from "./FileModel";

export interface SubmissionModel {
    id: number;
    description: string;
    status: "TAKEN" | "SUBMITTED" | "ACCEPTED" | "REJECTED";
    is_accepted: boolean;
    latitude: number | null;
    longitude: number | null;
    expired_at: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    user: User;
    quest_id: number;
    quest: QuestModel
    images: BaseDocumentFileModel[];
}

const STATUS_COLOR = {
    TAKEN: 'text-purple-500',
    SUBMITTED: 'text-blue-500',
    ACCEPTED: 'text-green-500',
    REJECTED: 'text-red-500',
};

export const SubmissionStatusColor = (status: "TAKEN" | "SUBMITTED" | "ACCEPTED" | "REJECTED") => STATUS_COLOR[status];

import { QuestModel } from "./Quest";

export interface QuestCategoryModel {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    quests: QuestModel[];
    quests_count: number;
}

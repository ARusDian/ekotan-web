import { DocumentFileModel } from './FileModel';
import { QuestCategoryModel } from './QuestCategory';


export interface QuestModel {
    id: number;
    title: string;
    description: string;
    point: number;
    location: string;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    quest_category_id: number;
    quest_category: QuestCategoryModel;
    photo_id: number;
    photo: DocumentFileModel;
}

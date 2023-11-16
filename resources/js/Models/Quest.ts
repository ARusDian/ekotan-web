import { BaseDocumentFileModel, DocumentFileModel } from './FileModel';
import { QuestCategoryModel } from './QuestCategory';


export interface BaseQuestModel {
    id: number;
    title: string;
    description: string;
    point: number;
    location: string;
    quantity?: number;
    latitude?: number | null;
    longitude?: number | null;
    expired_at: string;
    created_at: string;
    updated_at: string;
    category_id: number;
    category: QuestCategoryModel;
    image_id: number;
    image: BaseDocumentFileModel;
}

export interface QuestModel extends BaseQuestModel {
    image : DocumentFileModel;
}

export interface QuestCreateModel extends BaseQuestModel {
    isQuantity: boolean;
    isCoordinate: boolean;
}

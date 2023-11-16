import { BaseDocumentFileModel } from "./FileModel";

export interface PrizeModel {
    id: number;
    name: string;
    description: string;
    stock: number;
    price: number;
    image_id: number;
    image: BaseDocumentFileModel;
    created_at: string;
    updated_at: string;
}

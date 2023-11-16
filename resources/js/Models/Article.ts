import { User } from "@/types";
import { BaseDocumentFileModel } from "./FileModel";

export default interface ArticleModel { 
    id: number;
    title: string;
    content: string;
    user_id: number;
    user : User;
    image_id: number; 
    image: BaseDocumentFileModel;
}

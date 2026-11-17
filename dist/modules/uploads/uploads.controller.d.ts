import { Request } from 'express';
import { UploadFolderDto } from './dto/upload-folder.dto';
import { IncomingImage, UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadImages(files: IncomingImage[] | undefined, query: UploadFolderDto, request: Request): Promise<{
        url: string;
    }[]>;
}

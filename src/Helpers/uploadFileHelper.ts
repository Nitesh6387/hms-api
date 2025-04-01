import { createResponse } from "./createResponse";

export const uploadFileHelper = (file: any, path: any, res: any) => {
    file.mv(path + file?.name, (err: any) => {
        if (err) {
            return createResponse(res, 500, "Error during file upload", [], false, true);
        }
    })
    return file?.name
}
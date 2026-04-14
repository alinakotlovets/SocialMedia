import {AppError} from "./AppError";
export function parseOptionalId(rawId: any, text:string) {
    if (!rawId) return null;
    const id = Number(rawId);
    if(isNaN(id)) throw new AppError(400, `${text} is invalid`);
    return id;
}
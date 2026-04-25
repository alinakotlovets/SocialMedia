import cloudinary from "./cloudinary";
export async function uploadFiles(
    files: Express.Multer.File[],
    folder: string
): Promise<{ url: string, type: "VIDEO" | "IMAGE" }[]> {
    if (!files.length) return [];

    const uploads = files.map(async (file) => {
        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder, resource_type: "auto" }
        );
        const type = file.mimetype.startsWith("video/") ? "VIDEO" as const : "IMAGE" as const;
        return { url: result.secure_url, type };
    });

    return Promise.all(uploads);
}
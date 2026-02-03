const ImageKit = require("imagekit");
const { v4: uuid } = require("uuid");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
module.exports.uploadToImageKit = async (file, folder) => {
    try {
        if (!file) return null;

        const baseFolder = "YOMOKO";
        const cleanedSubFolder = folder ? folder.trim().replace(/^\/+|\/+$/g, "") : "";
        const fullFolderPath = cleanedSubFolder ? `${baseFolder}/${cleanedSubFolder}/` : baseFolder;

        // Basic validation: prevent HTML or script uploads masquerading as files
        if (typeof file === 'string') {
            const lower = file.trim().toLowerCase();
            if (lower.startsWith('<') || /<!doctype\s+html|<html|<script/.test(lower)) {
                throw new Error('Rejected file: HTML or script content is not allowed');
            }
            // If data URI, ensure it's an image
            if (lower.startsWith('data:') && !lower.startsWith('data:image/')) {
                throw new Error('Rejected file: only image data URIs are allowed');
            }
        }

        const fileInput = Buffer.isBuffer(file)
            ? file.toString("base64")
            : typeof file === "string"
              ? file
              : null;

        if (!fileInput) throw new Error("Invalid file input provided to ImageKit");

        const result = await imagekit.upload({
            file: fileInput,
            fileName: uuid(),
            useUniqueFileName:true,
            folder: fullFolderPath,
        });

        return result.url;
    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        throw error;
    }
};

// const {hash} = require("bcryptjs");

// hash('Test@123',10).then(e=>{
//     console.log(e)
// })

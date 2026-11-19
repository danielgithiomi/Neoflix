const extensionsByType = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
};

export const profilePictureAccept = Object.values(extensionsByType).flat().join(",");

export async function isProfilePicture(file: File): Promise<boolean> {
    // Check the file header as well as its name. Dragging bypasses the file picker's filter.
    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const matches = (signature: number[], offset = 0) =>
        signature.every((byte, index) => bytes[offset + index] === byte);

    let type: keyof typeof extensionsByType;
    if (matches([0xff, 0xd8, 0xff])) type = "image/jpeg";
    else if (matches([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) type = "image/png";
    else if (matches([0x52, 0x49, 0x46, 0x46]) && matches([0x57, 0x45, 0x42, 0x50], 8)) type = "image/webp";
    else return false;

    return extensionsByType[type].some(extension => file.name.toLowerCase().endsWith(extension));
}

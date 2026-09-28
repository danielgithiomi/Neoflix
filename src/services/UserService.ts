import { getUserProfilePictureUrl } from "../appwrite";

export const getAppwriteUserProfilePictureUrl = (
    user_profile_picture_id: string,
) => {
    return getUserProfilePictureUrl(user_profile_picture_id);
};

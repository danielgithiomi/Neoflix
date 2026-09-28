import { getUserProfilePictureUrl } from "../appwrite";

export const userProfilePictureId = import.meta.env.VITE_USER_PROFILE_PICTURE_RESOURCE_ID;

export const getAppwriteUserProfilePictureUrl = (
    user_profile_picture_id: string = userProfilePictureId,
) => {
    return getUserProfilePictureUrl(user_profile_picture_id);
};

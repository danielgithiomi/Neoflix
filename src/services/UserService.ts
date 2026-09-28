import { getUserProfilePictureUrl } from "../appwrite";

export const userProfilePictureId = import.meta.env.VITE_APPWRITE_USER_PROFILE_PICTURE_RESOURCE_ID;

export const getAppwriteUserProfilePictureUrl = (
    user_profile_picture_id: string = userProfilePictureId,
) => {
    console.log("user_profile_picture_id", user_profile_picture_id);
    return getUserProfilePictureUrl(user_profile_picture_id);
};

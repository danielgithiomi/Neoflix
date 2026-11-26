import { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { isProfilePicture, profilePictureAccept } from "@libs/validators/profilePicture";

interface ProfilePictureDialogProps {
    onClose: () => void;
}

export default function ProfilePictureDialog({ onClose }: ProfilePictureDialogProps) {
    const input = useRef<HTMLInputElement>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    
    const [error, setError] = useState("");
    const [preview, setPreview] = useState("");
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const element = dialog.current;
        element?.showModal();
        return () => element?.close();
    }, []);

    useEffect(() => {
        if (!file) return;
        let active = true;
        let url: string | undefined;

        async function loadPreview(selected: File) {
            try {
                const valid = await isProfilePicture(selected);
                if (!active) return;
                if (!valid) {
                    setError("Choose a JPG, JPEG, PNG or WebP image.");
                    return;
                }
                url = URL.createObjectURL(selected);
                setPreview(url);
            } catch {
                if (active) setError("This file could not be read. Try another image.");
            }
        }

        void loadPreview(file);
        return () => {
            active = false;
            if (url) URL.revokeObjectURL(url);
        };
    }, [file]);

    function selectFiles(files: FileList | null) {
        if (!files?.length) return;
        setPreview("");
        setError(files.length > 1 ? "Choose one picture at a time." : "");
        setFile(files.length === 1 ? files[0] : null);
    }

    return (
        <dialog ref={dialog} onCancel={event => {
                    event.preventDefault();
                    onClose();
                }} aria-labelledby="picture-dialog-title"
                className="bg-neutral-900 backdrop:bg-black/75 shadow-2xl m-auto p-6 border border-white/15 rounded-3xl w-[min(28rem,calc(100%-2rem))] text-white">
            <div className="flex justify-between items-center gap-4">
                <h2 id="picture-dialog-title" className="text-xl">Choose a profile picture</h2>
                <button type="button" aria-label="Close" onClick={onClose}
                        className="hover:bg-white/10 p-2 rounded-full text-gray-400 hover:text-white cursor-pointer">
                    <FaTimes />
                </button>
            </div>
            <p className="mt-2 text-gray-300 text-sm">Preview a picture from your device.</p>
            <input ref={input} type="file" hidden accept={profilePictureAccept}
                   onChange={event => {
                       selectFiles(event.currentTarget.files);
                       event.currentTarget.value = "";
                   }} />
            <button type="button" onClick={() => input.current?.click()}
                    onDragOver={event => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={event => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
                    }}
                    onDrop={event => {
                        event.preventDefault();
                        setDragging(false);
                        selectFiles(event.dataTransfer.files);
                    }}
                    className={`mt-5 flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-4 py-7 text-center hover:border-red-500 ${dragging ? "border-red-500 bg-red-500/10" : "border-white/25"}`}>
                {preview ? (
                    <img src={preview} alt="Profile picture preview" className="border-2 border-red-600 rounded-full size-24 object-cover"
                         onError={() => {
                             setPreview("");
                             setError("This image could not be displayed. Try another file.");
                         }} />
                ) : <FaCloudUploadAlt aria-hidden="true" className="text-red-500 text-4xl" />}
                <span className="font-semibold">{preview ? "Choose another image" : "Choose an image"}</span>
                <span className="text-gray-400 text-sm">or drop a JPG, JPEG, PNG or WebP here</span>
            </button>
            <p role="status" className="empty:hidden mt-3 text-gray-300 text-sm truncate">{preview && file?.name}</p>
            {error && <p role="alert" className="mt-3 text-red-400 text-sm">{error}</p>}
        </dialog>
    );
}

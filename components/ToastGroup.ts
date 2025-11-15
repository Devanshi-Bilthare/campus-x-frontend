import { toast, ToastPosition } from "react-hot-toast";

export const errorAlert = (text: string, position: ToastPosition) => {
    toast.error(text, {
        duration: 4000,
        position,
    });
};

export const successAlert = (text: string, position: ToastPosition) => {
    toast.success(text, {
        duration: 4000,
        position,
    });
};

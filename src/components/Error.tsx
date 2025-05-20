import Lottie from 'lottie-react';
import errorAnimation from './../assets/animations/error_404.json';

interface ErrorProps {
    message: string;
    lottieAnimation: boolean;
}

const Error = ({ message, lottieAnimation }: ErrorProps) => {
    return (
        <div className="flex flex-col items-center justify-center max-w-[500px] my-4">
            <p className="text-center text-red-600 text-xl uppercase">{message}</p>
            {
                lottieAnimation && <Lottie animationData={errorAnimation} className="size-[300px]" />
            }
        </div>
    )
}

export default Error;
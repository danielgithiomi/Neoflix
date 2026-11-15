import { cn } from
import { LegacyRef, FC } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export interface LottieAnimationProps {
    loop?: boolean;
    message?: string;
    autoplay?: boolean;
    animationPath: string;
    messageClassname?: string;
    ref?: LegacyRef<HTMLCanvasElement> | undefined;
    messagePosition?: 'top' | 'right' | 'bottom' | 'left';
}

export const LottieAnimation: FC<LottieAnimationProps> = ({
    ref,
    message,
    loop = true,
    animationPath,
    autoplay = true,
    messageClassname,
    messagePosition = 'bottom',
    ...remainingProps
}) => {
    return (
        <div className="flex">
            <DotLottieReact
                ref={ref}
                loop={loop}
                autoplay={autoplay}
                src={animationPath}
                {...remainingProps}
            />
            
            <p className={messageClassname}>{message}</p>
        </div>
    );
};

import { cn } from "@libs/utils";
import { LegacyRef, FC, ReactNode } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export interface LottieAnimationProps {
    loop?: boolean;
    autoplay?: boolean;
    animationPath: string;
    messageClassname?: string;
    wrapperClassname?: string;
    message?: string | ReactNode;
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
    wrapperClassname,
    messagePosition = 'bottom',
    ...remainingProps
}) => {
    return (
        <div className={cn("flex flex-col gap-2 items-center justify-center", {
            "flex-col-reverse": messagePosition === "top",
            "flex-row" : messagePosition === "right" || messagePosition === "left",
        }, wrapperClassname)}>
            <DotLottieReact
                ref={ref}
                loop={loop}
                autoplay={autoplay}
                src={animationPath}
                {...remainingProps}
            />
            
            <p className={cn("cursor-default", messageClassname)}>{message}</p>
        </div>
    );
};

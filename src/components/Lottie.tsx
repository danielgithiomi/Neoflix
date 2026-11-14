import { LegacyRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export interface LottieAnimationProps {
    loop?: boolean;
    autoplay?: boolean;
    animationPath: string;
    ref?: LegacyRef<HTMLCanvasElement> | undefined;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
    ref,
    loop = true,
    animationPath,
    autoplay = true,
    ...remainingProps
}) => {
    return (
        <DotLottieReact
            ref={ref}
            loop={loop}
            autoplay={autoplay}
            src={animationPath}
            {...remainingProps}
        />
    );
};

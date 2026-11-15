import classNames from "classnames";
import { twMerge} from "tailwind-merge";

/* -------------------------------------------------------------------------------------------------
 * Merge class names
 * -----------------------------------------------------------------------------------------------*/
/**
 * function to merge class names to override default styles with custom styles
 * @param inputs - The class names to merge
 * @returns The merged class names
 */
export function cn(...inputs: classNames.ArgumentArray): string {
	return twMerge(classNames(inputs));
}

/* -------------------------------------------------------------------------------------------------
 * Generate Lottie Animation Path
 * -----------------------------------------------------------------------------------------------*/
/**
 * A function that formats and produces a complete json path to the Lottie Animation file
 * @param animationName - The name of the animation json file
 * @returns The formatted and complete json path to the Lottie Animation json file
 */
export function generateLottieAnimationPath(animationName: string): string | null{
	const validAnimationExtension = (): boolean => {
		const allowedExtensions: string[] = ['json'];
		return allowedExtensions.includes(animationName.split('.')[1]);
	}
	
	if (!validAnimationExtension()) {
		alert("Invalid Lottie Animation JSON file");
		console.error("The animation file name given is not valid. Provide a '.JSON' file");
		return null;
	}
	
	return `${import.meta.env.BASE_URL}animations/${animationName}`
}
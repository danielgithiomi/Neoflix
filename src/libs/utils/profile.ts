import Movie from "../../data/Movie";
import { GENRE_NAMES } from "../../data/Genres";

/* -------------------------------------------------------------------------------------------------
 * Build Username
 * -----------------------------------------------------------------------------------------------*/
// Number of letters each name contributes to the username
export const USERNAME_PART_LENGTH: number = 3;

/**
 * A function that builds a username from the start of the first and last name
 * @param firstName - The user's first name
 * @param lastName - The user's last name
 * @returns The uppercase username, or null when either name is too short to build one
 */
export function buildUsername(firstName: string, lastName: string): string | null {
	const parts: string[] = [firstName.trim(), lastName.trim()];

	if (parts.some((part) => part.length < USERNAME_PART_LENGTH)) return null;

	return parts
		.map((part) => part.substring(0, USERNAME_PART_LENGTH).toUpperCase())
		.join("");
}

/* -------------------------------------------------------------------------------------------------
 * Top Genres
 * -----------------------------------------------------------------------------------------------*/
export interface GenreCount {
	id: number;
	name: string;
	count: number;
}

/**
 * A function that counts how often each genre appears in a list of movies
 * @param movies - The movies to count genres across
 * @param limit - The most genres to return
 * @returns The most common genres, most common first. Ties keep the order they were first seen in
 */
export function getTopGenres(movies: Movie[], limit: number): GenreCount[] {
	const counts = new Map<number, number>();

	// Favourites come from localStorage, so an older entry may have no genre ids
	movies.forEach((movie) =>
		(movie.genre_ids ?? []).forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)),
	);

	return [...counts.entries()]
		.filter(([id]) => id in GENRE_NAMES)
		.sort(([, countA], [, countB]) => countB - countA)
		.slice(0, limit)
		.map(([id, count]) => ({ id, name: GENRE_NAMES[id], count }));
}

/* -------------------------------------------------------------------------------------------------
 * Average Rating
 * -----------------------------------------------------------------------------------------------*/
/**
 * A function that averages the TMDB rating of a list of movies
 * @param movies - The movies to average
 * @returns The average rating out of 10, or null when none of the movies has a rating
 */
export function getAverageRating(movies: Movie[]): number | null {
	// TMDB gives unrated movies a rating of 0
	const ratings: number[] = movies
		.map((movie) => movie.vote_average)
		.filter((rating) => rating > 0);

	if (!ratings.length) return null;

	return ratings.reduce((total, rating) => total + rating, 0) / ratings.length;
}

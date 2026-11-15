import Movie from "../../data/Movie";
import { describe, expect, it } from "vitest";
import { buildUsername, getAverageRating, getTopGenres } from "./profile";

// Only the fields the profile stats read matter here
const movie = (genre_ids: number[], vote_average: number = 7): Movie => ({ genre_ids, vote_average }) as Movie;

describe("buildUsername", () => {
	it("joins the first three letters of each name in uppercase", () => {
		expect(buildUsername("John", "Doe")).toBe("JOHDOE");
		expect(buildUsername("thomas", "anderson")).toBe("THOAND");
	});

	it("ignores whitespace around the names", () => {
		expect(buildUsername("  John ", " Doe  ")).toBe("JOHDOE");
	});

	it("returns null when either name is too short", () => {
		expect(buildUsername("Jo", "Doe")).toBeNull();
		expect(buildUsername("John", "  Li  ")).toBeNull();
		expect(buildUsername("", "")).toBeNull();
	});
});

describe("getTopGenres", () => {
	it("returns the most common genres first, with their counts", () => {
		const movies: Movie[] = [movie([878, 28]), movie([878, 18]), movie([878, 28])];

		expect(getTopGenres(movies, 3)).toEqual([
			{ id: 878, name: "Sci-Fi", count: 3 },
			{ id: 28, name: "Action", count: 2 },
			{ id: 18, name: "Drama", count: 1 },
		]);
	});

	it("returns no more genres than the limit", () => {
		const movies: Movie[] = [movie([878, 28, 18, 35])];

		expect(getTopGenres(movies, 2)).toHaveLength(2);
	});

	it("keeps tied genres in the order they were first seen", () => {
		const movies: Movie[] = [movie([35, 27]), movie([27, 35])];

		expect(getTopGenres(movies, 2).map((genre) => genre.name)).toEqual(["Comedy", "Horror"]);
	});

	it("names genres that aren't offered as filters on the home page", () => {
		expect(getTopGenres([movie([12])], 1)).toEqual([{ id: 12, name: "Adventure", count: 1 }]);
	});

	it("skips genre ids it has no name for", () => {
		expect(getTopGenres([movie([-1, 18])], 3)).toEqual([{ id: 18, name: "Drama", count: 1 }]);
	});

	it("copes with no movies and with movies that have no genre ids", () => {
		expect(getTopGenres([], 3)).toEqual([]);
		expect(getTopGenres([{ vote_average: 7 } as Movie], 3)).toEqual([]);
	});
});

describe("getAverageRating", () => {
	it("averages the ratings", () => {
		expect(getAverageRating([movie([], 8), movie([], 7), movie([], 6)])).toBe(7);
	});

	it("leaves unrated movies out of the average", () => {
		expect(getAverageRating([movie([], 8), movie([], 0)])).toBe(8);
	});

	it("returns null when there is nothing to average", () => {
		expect(getAverageRating([])).toBeNull();
		expect(getAverageRating([movie([], 0)])).toBeNull();
	});
});

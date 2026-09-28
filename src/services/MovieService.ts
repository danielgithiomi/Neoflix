import axios from "axios";
import Movie from "../data/Movie";
import Response from "../data/Response";
import { MovieSpecs } from "../data/MovieSpecs.ts";
import { fetchTrendingMovies, updateTrendingMoviesCount } from "../appwrite.ts";

// Constants
const API_BASE_URL: string = "https://api.themoviedb.org/3" as string;
const API_KEY: string = import.meta.env.VITE_TMDB_API_TOKEN;
const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

export const convertMovieSpecToMovie = (movie: MovieSpecs): Movie => {
    return {
        adult: movie!.adult,
        backdrop_path: movie!.backdrop_path,
        genre_ids: movie!.genres.map((genre) => genre.id),
        id: movie!.id,
        original_language: movie!.original_language,
        original_title: movie!.original_title,
        overview: movie!.overview,
        popularity: movie!.popularity,
        poster_path: movie!.poster_path,
        release_date: movie!.release_date,
        title: movie!.title,
        video: movie!.video,
        vote_average: movie!.vote_average,
        vote_count: movie!.vote_count,
    };
};

export const fetchMovies = async (
    searchQuery: string = "",
): Promise<Movie[]> => {
    const endpoint: string = searchQuery
        ? `${API_BASE_URL}/search/movie?query=${encodeURI(searchQuery)}}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const result = await axios.get(endpoint, API_OPTIONS);

    if (result.status != 200) {
        alert("Error occurred while fetching movies");
        throw new Error("Error occurred while fetching movies");
    }

    const response: Response = await result.data;
    const movies = response.results;

    if (searchQuery && movies.length > 0) {
        updateTrendingMoviesCount(searchQuery, movies[0]);
    }

    return movies;
};

export const fetchMovieById = async (movieId: string): Promise<MovieSpecs> => {
    const endpoint: string = `${API_BASE_URL}/movie/${movieId}`;

    const api_result = await axios.get(endpoint, API_OPTIONS);
    return await api_result.data;
};

export const getTrendingMovies = async () => {
    return await fetchTrendingMovies();
};

// TMDB genre ids, used by the genre chips on the home page
export interface Genre {
    id: number;
    name: string;
}

export const GENRES: Genre[] = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 878, name: "Sci-Fi" },
    { id: 16, name: "Animation" },
    { id: 53, name: "Thriller" },
    { id: 10749, name: "Romance" },
];

// Every TMDB movie genre, for naming the genres a movie belongs to
export const GENRE_NAMES: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
};

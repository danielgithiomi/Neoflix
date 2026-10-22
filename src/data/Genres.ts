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

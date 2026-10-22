import { GENRES } from "../data/Genres";
import { Dispatch, SetStateAction } from "react";

type TGenreChipsProps = {
    selectedGenre: number | null;
    setSelectedGenre: Dispatch<SetStateAction<number | null>>;
};

const GenreChips = ({ selectedGenre, setSelectedGenre }: TGenreChipsProps) => {
    return (
        <div className="genre-chips" role="group" aria-label="Filter by genre">
            <button
                type="button"
                className="genre-chip"
                aria-pressed={selectedGenre === null}
                onClick={() => setSelectedGenre(null)}
            >
                All
            </button>
            {GENRES.map((genre) => (
                <button
                    key={genre.id}
                    type="button"
                    className="genre-chip"
                    aria-pressed={selectedGenre === genre.id}
                    onClick={() => setSelectedGenre(genre.id)}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
};

export default GenreChips;

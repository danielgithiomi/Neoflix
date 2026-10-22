import Search from './Search';
import GenreChips from './GenreChips';
import { Dispatch, SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../services/MovieService';

const POSTER_BASE_URL: string = "https://image.tmdb.org/t/p/w342";
const WALL_COLUMNS: number = 14;
const WALL_ROWS: number = 6;

type TBannerProps = {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    selectedGenre: number | null;
    setSelectedGenre: Dispatch<SetStateAction<number | null>>;
};

// Tilted, dimmed wall of popular movie posters behind the hero text
const PosterWall = () => {

    // Same query key as the unfiltered list on the home page, so this reuses its cached response
    const { data: movies } = useQuery({
        queryKey: ["Movies", "", null],
        queryFn: () => fetchMovies(),
    });

    const posters: string[] = (movies ?? [])
        .map((movie) => movie.poster_path)
        .filter(Boolean);

    // Shift each row so the same poster doesn't line up in a column
    const tiles: (string | null)[] = Array.from({ length: WALL_COLUMNS * WALL_ROWS }, (_, index) =>
        posters.length
            ? posters[(index + Math.floor(index / WALL_COLUMNS) * 3) % posters.length]
            : null
    );

    return (
        <div className="poster-wall" aria-hidden="true">
            <div className="poster-wall-grid">
                {
                    tiles.map((poster, index) =>
                        poster
                            ? <img key={index} className="poster-wall-tile" src={`${POSTER_BASE_URL}${poster}`} alt="" loading="lazy" />
                            : <div key={index} className="poster-wall-tile" />
                    )
                }
            </div>
        </div>
    );
}

const Banner = ({ searchTerm, setSearchTerm, selectedGenre, setSelectedGenre }: TBannerProps) => {

    return (
        <section className="hero">

            <PosterWall />
            <div className="hero-shade" />

            <div className="hero-content">
                <h1 className="hero-title">
                    Neoflix <br className="sm:hidden" />and <span className="text-red-600">chill</span>
                </h1>
                <p className="hero-tagline">Every movie. No ads. No hassle.</p>

                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <GenreChips selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
            </div>

        </section>
    )
}

export default Banner

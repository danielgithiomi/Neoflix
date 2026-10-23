import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../services/MovieService';

const POSTER_BASE_URL: string = "https://image.tmdb.org/t/p/w342";
const WALL_COLUMNS: number = 14;

type TPosterWallProps = {
    rows?: number;
};

// Tilted, dimmed wall of popular movie posters, used behind the home hero and the auth pages
const PosterWall = ({ rows = 6 }: TPosterWallProps) => {

    // Same query key as the unfiltered list on the home page, so this reuses its cached response
    const { data: movies } = useQuery({
        queryKey: ["Movies", "", null],
        queryFn: () => fetchMovies(),
    });

    const posters: string[] = (movies ?? [])
        .map((movie) => movie.poster_path)
        .filter(Boolean);

    // Shift each row so the same poster doesn't line up in a column
    const tiles: (string | null)[] = Array.from({ length: WALL_COLUMNS * rows }, (_, index) =>
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

export default PosterWall

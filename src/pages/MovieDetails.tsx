import Movie from "@/data/Movie.ts";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaHeart, FaStar } from "react-icons/fa";
import image_fallback from "../assets/images/no-movie.png";
import { useMovieContext } from "../contexts/FavouriteContext.tsx";
import {
    convertMovieSpecToMovie,
    fetchMovieById,
} from "../services/MovieService.ts";

const MovieDetails = () => {
    const { movie_id } = useParams();
    const { isFavourite, addToFavourites, removeFromFavourites } =
        useMovieContext();

    const {
        isError,
        isLoading,
        data: movie,
    } = useQuery({
        queryKey: ["movie", movie_id],
        queryFn: () => fetchMovieById(movie_id!),
    });

    const toggleFavourite = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        const movieDTO: Movie = convertMovieSpecToMovie(movie!);

        if (favouriteStatus) removeFromFavourites(movie!.id);
        else addToFavourites(movieDTO);
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-[70vh] text-center">
                Loading movie details...
            </div>
        );

    if (isError)
        return (
            <div className="flex justify-center items-center min-h-[70vh] font-bold text-red-600 text-center underline">
                Error fetching movie data
            </div>
        );

    const favouriteStatus = isFavourite(parseInt(movie_id!));
    const image_src: string = movie?.poster_path
        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
        : image_fallback;
    // Without a backdrop, fall back to a heavily blurred poster so the page still has a background
    const backdrop_src: string | null = movie?.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : movie?.poster_path
          ? image_src
          : null;
    const rating: number = movie?.vote_average
        ? parseInt(movie.vote_average.toFixed(0)) / 2
        : 0;
    const genre_length: number = movie!.genres.length - 1;

    return (
        <>
            {backdrop_src && (
                <div className="details-backdrop" aria-hidden="true">
                    <img
                        src={backdrop_src}
                        alt=""
                        className={
                            movie?.backdrop_path ? "" : "blur-2xl scale-110"
                        }
                    />
                </div>
            )}

            <section className="z-10 relative flex md:flex-row flex-col justify-center items-center gap-8 md:p-8 py-8 min-h-[88vh]">
                <div className="flex-1 border-2 border-red-600 rounded-3xl w-2/3 md:w-auto md:max-w-none max-w-sm overflow-hidden movie-poster">
                    <img src={image_src} alt={`${movie?.title} Poster`} />
                </div>

                <div className="flex-2 details-panel movie-details">
                    <p className="font-bold text-3xl md:text-4xl tracking-wider">
                        {movie?.title}
                    </p>

                    <div className="flex flex-row flex-wrap justify-start items-center gap-x-4 gap-y-2 movie-rating">
                        <div className="flex flex-row gap-0.5 star-rating">
                            {Array.from(
                                { length: 5 },
                                (_, index) => index + 1,
                            ).map((i) => (
                                <FaStar
                                    key={i}
                                    size={20}
                                    className={`text-lg ${i <= rating ? "text-yellow-400" : "text-gray-400"}`}
                                />
                            ))}
                        </div>

                        <span className="text-amber-400">•</span>

                        <p className="bg-gray-700 px-2 py-1 rounded text-white text-sm">
                            {movie?.vote_average.toFixed(1)}
                        </p>

                        <span className="text-amber-400">•</span>

                        <p className="font-bold text-gray-300 whitespace-nowrap">
                            {movie?.vote_count} total ratings
                        </p>
                    </div>

                    <div className="mt-2 mb-4 text-sm movie-genres">
                        {movie?.genres.map((genre, index) => (
                            <span
                                key={index}
                                className="font-bold text-gray-300 italic uppercase"
                            >
                                {genre.name}
                                {index < genre_length ? "," : ""}
                            </span>
                        ))}
                    </div>

                    <div className="text-pretty languages">
                        Spoken Languages:
                        <span className="mx-2">
                            {movie?.spoken_languages.map((language, index) => (
                                <span
                                    key={index}
                                    className="font-bold text-gray-300 text-sm uppercase"
                                >
                                    {language.name}
                                    {index < movie?.spoken_languages.length - 1
                                        ? ", "
                                        : ""}
                                </span>
                            ))}
                        </span>
                    </div>

                    <div className="my-4 py-4 md:max-w-[90%] md:text-justify movie-description">
                        <p className="text-lg">{movie?.overview}</p>
                    </div>

                    <div className="extra-details">
                        <p className="font-bold text-gray-400">
                            Release Date:{" "}
                            <span className="mx-1 text-gray-200">
                                {movie?.release_date}
                            </span>
                        </p>

                        <p className="font-bold text-gray-400">
                            Runtime:{" "}
                            <span className="mx-1 text-gray-200">
                                {movie?.runtime} minutes
                            </span>
                        </p>

                        <p className="font-bold text-gray-400">
                            Revenue:{" "}
                            <span className="mx-1 text-gray-200">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(movie!.revenue)}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-row gap-8 my-8">
                        <div
                            onClick={toggleFavourite}
                            className={`${favouriteStatus ? "bg-red-500" : "bg-white"} flex flex-row items-center justify-center p-4 rounded-2xl gap-4 cursor-pointer`}
                        >
                            <FaHeart
                                className={`${favouriteStatus ? "text-white" : "text-red-500"}`}
                                size={20}
                            />
                            <p
                                className={`${favouriteStatus ? "text-white" : "text-black"} uppercase font-bold`}
                            >
                                {favouriteStatus
                                    ? "Remove from Favourites"
                                    : "Add to Favourites"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
export default MovieDetails;

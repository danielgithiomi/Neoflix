import { useState } from "react";
import Movie from "../data/Movie.ts";
import { useDebounce } from "react-use";
import Error from "../components/Error.tsx";
import { GENRES } from "../data/Genres.ts";
import Banner from "../components/Banner.tsx";
import { useQuery } from "@tanstack/react-query";
import Trending from "../components/Trending.tsx";
import MovieCard from "../components/MovieCard.tsx";
import { fetchMovies } from "../services/MovieService.ts";

const Home = () => {
    // State Managers
    const [search, setSearch] = useState<string>("");
    const [searchDebounce, setSearchDebounce] = useState("");
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const selectedGenreName = GENRES.find(
        (genre) => genre.id === selectedGenre,
    )?.name;
    const titleClassname =
        "text-white uppercase text-3xl font-bold my-4 text-center";

    // Debounce
    useDebounce(() => setSearchDebounce(search.trim()), 500, [search]);

    const {
        data: fetchedMovies,
        isError: isMoviesError,
        error: movieFetchError,
        isPending: isFetchingMovies,
    } = useQuery({
        queryKey: ["Movies", searchDebounce, selectedGenre],
        queryFn: () => fetchMovies(searchDebounce, selectedGenre),
    });

    return (
        <>
            <Banner
                searchTerm={search}
                setSearchTerm={setSearch}
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
            />

            {!isMoviesError && <Trending />}

            {isFetchingMovies && (
                <div className="text-gray-500 text-center uppercase">
                    <p>Loading. Please wait...</p>
                </div>
            )}

            {isMoviesError && (
                <div className="place-items-center grid w-full text-red-600">
                    <Error
                        message={`Movie fetching failed with error: ${movieFetchError}`}
                        lottieAnimation={true}
                    />
                </div>
            )}

            {!isMoviesError && fetchedMovies?.length ? (
                <section className="all-movies">
                    {!search ? (
                        <p className={titleClassname}>
                            Explore{" "}
                            <span className="text-gradient">
                                {selectedGenreName ?? "Movies"}
                            </span>{" "}
                            Now!
                        </p>
                    ) : (
                        <p className={titleClassname}>
                            Movie Results for:{" "}
                            <span className="text-gradient">{search}</span>{" "}
                        </p>
                    )}

                    <ul>
                        {fetchedMovies.map((movie: Movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </ul>
                </section>
            ) : (
                !isMoviesError &&
                !isFetchingMovies && (
                    <p className="text-red-600 text-2xl text-center uppercase">
                        No Movies Found!
                    </p>
                )
            )}
        </>
    );
};

export default Home;

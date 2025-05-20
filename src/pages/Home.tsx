import { useState } from "react";
import Movie from "../data/Movie.ts";
import { useDebounce } from 'react-use';
import Banner from "../components/Banner.tsx";
import Search from "../components/Search.tsx";
import { useQuery } from "@tanstack/react-query";
import Trending from "../components/Trending.tsx";
import MovieCard from "../components/MovieCard.tsx";
import { fetchMovies } from "../services/MovieService.ts";
import Error from "../components/Error.tsx";

const Home = () => {

    // State Managers
    const [search, setSearch] = useState<string>("")
    const [searchDebounce, setSearchDebounce] = useState("");
    const titleClassname = "text-white uppercase text-3xl font-bold my-4 text-center"

    // Debounce
    useDebounce(() => setSearchDebounce(search.trim()), 500, [search]);

    const {
        data: fetchedMovies,
        isPending: isFetchingMovies,
        isError: isMoviesError,
        error: movieFetchError
    } = useQuery({
        queryKey: ["Movies", searchDebounce],
        queryFn: () => fetchMovies(searchDebounce),
    });

    return (
        <>
            <div className="pattern" />

            <Banner />

            {!isMoviesError && <Search searchTerm={search} setSearchTerm={setSearch} />}

            {!isMoviesError && <Trending />}

            {isFetchingMovies && (
                <div className="text-gray-500 uppercase text-center">
                    <p>Loading. Please wait...</p>
                </div>
            )}

            {isMoviesError && (
                <div className="text-red-600 w-full grid place-items-center">
                    <Error
                    message={`Movie fetching failed with error: ${movieFetchError}`}
                    lottieAnimation={true}
                />
                </div>
            )}

            {!isMoviesError && fetchedMovies?.length
                ? (
                    <section className="all-movies">

                        {!search
                            ? <p className={titleClassname}>Explore <span className="text-gradient">Movies</span> Now!</p>
                            : <p className={titleClassname}>Movie Results for: <span className="text-gradient">{search}</span> </p>
                        }

                        <ul>
                            {
                                fetchedMovies.map(
                                    (movie: Movie) => <MovieCard key={movie.id} movie={movie} />)
                            }
                        </ul>
                    </section>
                )
                : (!isMoviesError && !isFetchingMovies) && (
                    <p className="text-center text-red-600 text-2xl uppercase">No Movies Found!</p>
                )}
        </>
    )
}

export default Home

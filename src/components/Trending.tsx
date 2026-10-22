import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTrendingMovies } from "../services/MovieService";

const Trending = () => {
    const {
        isError,
        isFetching,
        data: trending_movies,
    } = useQuery({
        queryKey: ["trending_movies"],
        queryFn: () => getTrendingMovies(),
    });

    if (isError)
        return (
            <p className="text-red-600 text-2xl text-center uppercase">
                Failed to fetch trending movies!
            </p>
        );

    if (isFetching)
        return <p className="text-gray-400 text-xl text-center">Loading...</p>;

    return (
        <section className="trending">
            <h2 className="my-4 font-bold text-white text-3xl text-center uppercase">
                Top <span className="text-gradient">Trending</span> Movies!
            </h2>

            <ul>
                {trending_movies?.map((movie, index) => (
                    <li key={movie.$id}>
                        <p>{index + 1}</p>
                        <NavLink to={`/details/${movie.movie_id}`}>
                            <img
                                alt={movie.search_term}
                                src={movie.poster_image_url}
                            />
                        </NavLink>
                    </li>
                ))}
            </ul>
        </section>
    );
};
export default Trending;

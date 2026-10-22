import { useQuery } from '@tanstack/react-query';
import { getTrendingMovies } from '../services/MovieService';

const Trending = () => {

    // State to store the trending movies
    const {
        data: trending_movies,
        isError,
        isFetching
    } = useQuery({
        queryKey: ['trending_movies'],
        queryFn: () => getTrendingMovies()
    });

    if (isError)
        return <p className="text-center text-red-600 text-2xl uppercase">Failed to fetch trending movies!</p>


    if (isFetching)
        return <p className="text-center text-gray-400 text-xl">Loading...</p>

    return (
        <section className='trending'>

            <h2 className="text-white uppercase text-3xl font-bold my-4 text-center">Top <span className="text-gradient">Trending</span> Movies!</h2>

            <ul>
                {
                    trending_movies?.map(
                        (movie, index) =>
                            <li key={movie.$id}>
                                <p>{index + 1}</p>
                                <img src={movie.poster_image_url} alt={movie.search_term} />
                            </li>
                    )
                }
            </ul>

        </section>
    )
}
export default Trending

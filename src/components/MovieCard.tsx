import '../index.css';
import Image from "./Image";
import Movie from "../data/Movie"
import {FaHeart, FaStar} from "react-icons/fa";
import {useMovieContext} from "../contexts/FavouriteContext";
import {NavLink} from "react-router-dom";
import React from "react";
import {FaPlay} from "react-icons/fa6";

type MovieCardProps = {
    movie: Movie
};

const MovieCard = (props: MovieCardProps) => {

    const movie = props.movie;
    const {id, title, vote_average, poster_path, release_date, original_language, adult} = movie;

    const {isFavourite, addToFavourites, removeFromFavourites} = useMovieContext();
    const favourite = isFavourite(id);

    const handleFavouriteClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (favourite) {
            removeFromFavourites(id);
        } else {
            addToFavourites(movie);
        }
    };

    return (
        <div className="movie-card">

            <div className="overlay">

                <div className="favourite z-[15]" onClick={handleFavouriteClick}>
                    <FaHeart className={favourite ? 'text-red-500' : 'text-white'} size={20}/>
                </div>

                <NavLink to={`/details/${id}`}>
                    <div className="play">
                        <FaPlay className="play-icon" size={80}/>
                    </div>
                </NavLink>

                <Image imageUrl={poster_path} alt={`${title} Poster`}/>

                <div className="movie-details mt-4 mx-2">

                    <div className="movie-title flex flex-row gap-4">
                        <h3 className="text-red-500 text-xl uppercase font-bold hover:font-bolder">{title}</h3>
                        {adult && <span className="movie-extra">PG-13</span>}
                    </div>

                    <div className="movie-content flex flex-col items-start gap-4">

                        <div className="movie-rating flex flex-row gap-4 items-center">
                            <FaStar className="text-amber-400" size={20}/>
                            <p className="text-white font-bold">
                                {vote_average
                                    ? vote_average.toFixed(2)
                                    : "No Rating Available"}
                            </p>
                        </div>

                        <div className="movie-release flex flex-row items-center gap-4">
                            <p className="movie-extra">{original_language}</p>
                            <span className="text-amber-400">•</span>
                            <p className="year">
                                {release_date
                                    ? release_date.split('-')[0]
                                    : "No Release Date"}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default MovieCard
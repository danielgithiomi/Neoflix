import "../index.css";
import React from "react";
import Image from "./Image";
import Movie from "../data/Movie";
import { FaLink } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import { useMovieContext } from "../contexts/FavouriteContext";

type MovieCardProps = {
    movie: Movie;
};

const MovieCard = (props: MovieCardProps) => {
    const movie = props.movie;
    const {
        id,
        title,
        vote_average,
        poster_path,
        release_date,
        original_language,
        adult,
    } = movie;

    const { isFavourite, addToFavourites, removeFromFavourites } =
        useMovieContext();
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
                <div
                    className="z-[15] favourite"
                    onClick={handleFavouriteClick}
                >
                    <FaHeart
                        className={favourite ? "text-red-500" : "text-white"}
                        size={20}
                    />
                </div>

                <NavLink to={`/details/${id}`}>
                    <div className="info">
                        <FaLink className="info-icon" size={80} />
                    </div>
                </NavLink>

                <Image imageUrl={poster_path} alt={`${title} Poster`} />

                <div className="mx-2 mt-4 movie-details">
                    <div className="flex flex-row gap-4 movie-title">
                        <h3 className="hover:font-bolder font-bold text-red-500 text-xl uppercase">
                            {title}
                        </h3>
                        {adult && <span className="movie-extra">PG-13</span>}
                    </div>

                    <div className="flex flex-col items-start gap-4 movie-content">
                        <div className="flex flex-row items-center gap-4 movie-rating">
                            <FaStar className="text-amber-400" size={20} />
                            <p className="font-bold text-white">
                                {vote_average
                                    ? vote_average.toFixed(2)
                                    : "No Rating Available"}
                            </p>
                        </div>

                        <div className="flex flex-row items-center gap-4 movie-release">
                            <p className="movie-extra">{original_language}</p>
                            <span className="text-amber-400">•</span>
                            <p className="year">
                                {release_date
                                    ? release_date.split("-")[0]
                                    : "No Release Date"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;

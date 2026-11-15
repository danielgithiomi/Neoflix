import User from "../data/User.ts";
import { SEX } from "../data/Sex.ts";
import Movie from "../data/Movie.ts";
import Image from "@components/Image.tsx";
import { NavLink } from "react-router-dom";
import { FormEvent, useState } from "react";
import AuthField from "@components/AuthField.tsx";
import PosterWall from "@components/PosterWall.tsx";
import { FaCamera, FaFilm, FaHeart, FaPen, FaStar } from "react-icons/fa";
import { useMovieContext } from "../contexts/FavouriteContext.tsx";
import { FieldErrors, ProfileValues, validateProfile } from "@libs/validators/authValidation.ts";
import { buildUsername, getAverageRating, getTopGenres, USERNAME_PART_LENGTH } from "@libs/utils";

interface ProfileProps {
    user: User;
}

const TOP_GENRE_COUNT: number = 3;
const RECENT_FAVOURITE_COUNT: number = 4;
const GENDERS: SEX[] = Object.values(SEX);

const Profile = ({ user }: ProfileProps) => {
    const { favourites } = useMovieContext();

    // The password starts empty: leaving it blank keeps the current one
    const initialValues: ProfileValues = {
        password: "",
        lastName: user.last_name,
        firstName: user.first_name,
        email: user.email_address,
    };

    const [gender, setGender] = useState<SEX>(user.gender);
    const [status, setStatus] = useState<string | null>(null);
    const [values, setValues] = useState<ProfileValues>(initialValues);
    const [errors, setErrors] = useState<FieldErrors<ProfileValues>>({});

    const username: string | null = buildUsername(values.firstName, values.lastName);
    const initials: string = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

    const movies: Movie[] = favourites ?? [];
    const averageRating = getAverageRating(movies);
    const topGenres = getTopGenres(movies, TOP_GENRE_COUNT);
    // Favourites are stored oldest first
    const recentFavourites: Movie[] = movies.slice(-RECENT_FAVOURITE_COUNT).reverse();
    const favouriteCount: string = movies.length
        ? `${movies.length} ${movies.length === 1 ? "favourite" : "favourites"}`
        : "No favourites yet";

    // Editing a field clears its error until the next submit
    const updateField = (field: keyof ProfileValues) => (value: string) => {
        setStatus(null);
        setValues((previous) => ({ ...previous, [field]: value }));
        setErrors((previous) => ({ ...previous, [field]: undefined }));
    };

    const updateGender = (selected: SEX) => {
        setStatus(null);
        setGender(selected);
    };

    const resetForm = () => {
        setErrors({});
        setStatus(null);
        setGender(user.gender);
        setValues(initialValues);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateProfile(values);
        setErrors(validationErrors);

        const firstInvalidField = Object.keys(validationErrors)[0];
        if (firstInvalidField) {
            setStatus(null);
            document.getElementById(firstInvalidField)?.focus();
            return;
        }

        // Placeholder until the form is connected to Appwrite's account update methods
        setStatus("Your details look good. Profile updates aren't connected to Appwrite yet.");
    };

    return (
        <>
            <div className="profile-banner" aria-hidden="true">
                <PosterWall />
                <div className="profile-shade" />
            </div>

            <section className="profile">

                <header className="profile-identity">
                    {/* Only shows that the photo can be changed for now: clicking does nothing until uploads are built */}
                    <button type="button" className="profile-avatar" aria-label="Change profile picture">
                        <span className="profile-avatar-photo">
                            {user.profile_image_url
                                ? <img src={user.profile_image_url} alt="" />
                                : <span aria-hidden="true">{initials}</span>}
                            <span className="profile-avatar-overlay" aria-hidden="true"><FaPen size={22} /></span>
                        </span>
                        <span className="profile-avatar-camera" aria-hidden="true"><FaCamera size={14} /></span>
                    </button>

                    <div className="min-w-0 grow">
                        <p className="profile-eyebrow">Your profile</p>
                        <h1 className="profile-name">{user.first_name} {user.last_name}</h1>
                        <p className="profile-handle">@{user.username} · {user.email_address}</p>
                    </div>

                    <ul className="profile-chips">
                        <li><FaHeart className="text-red-500" size={14} /> {favouriteCount}</li>
                        {topGenres.length > 0 && (
                            <li><FaFilm size={14} /> Mostly {topGenres[0].name}</li>
                        )}
                        {averageRating !== null && (
                            <li><FaStar className="text-amber-400" size={14} /> {averageRating.toFixed(1)} average rating</li>
                        )}
                    </ul>
                </header>

                <div className="profile-content">

                    <form className="lg:col-span-3 profile-card" onSubmit={handleSubmit} noValidate>
                        <h2>Account details</h2>
                        <p className="profile-card-subtitle">Change your name or how you sign in.</p>

                        <div className="profile-form-grid">
                            <AuthField showLabel id="firstName" label="First name" autoComplete="given-name"
                                       value={values.firstName} onChange={updateField("firstName")} error={errors.firstName} />
                            <AuthField showLabel id="lastName" label="Last name" autoComplete="family-name"
                                       value={values.lastName} onChange={updateField("lastName")} error={errors.lastName} />

                            <div className="auth-field">
                                <label htmlFor="username" className="auth-label">Username</label>
                                <input readOnly id="username" name="username" value={username ?? ""}
                                       placeholder="Not enough letters yet" aria-describedby="username-hint" />
                                <p id="username-hint" className="auth-field-hint">
                                    Made from the first {USERNAME_PART_LENGTH} letters of each name
                                </p>
                            </div>

                            <fieldset className="profile-gender">
                                <legend>Gender</legend>
                                <div className="profile-gender-options">
                                    {GENDERS.map((option) => (
                                        <button key={option} type="button" aria-pressed={gender === option}
                                                onClick={() => updateGender(option)}>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            <AuthField showLabel id="email" label="Email" type="email" autoComplete="email"
                                       value={values.email} onChange={updateField("email")} error={errors.email} />
                            <AuthField showLabel id="password" label="New password" type="password" autoComplete="new-password"
                                       placeholder="Leave blank to keep it"
                                       value={values.password} onChange={updateField("password")} error={errors.password} />
                        </div>

                        {status && <p className="mt-6 auth-status" role="status">{status}</p>}

                        <div className="profile-actions">
                            <button type="submit" className="auth-submit">Save changes</button>
                            <button type="button" className="profile-cancel" onClick={resetForm}>Cancel</button>
                        </div>
                    </form>

                    <div className="flex flex-col gap-6 lg:col-span-2">

                        <section className="profile-card">
                            <div className="profile-card-header">
                                <h2>Your favourites</h2>
                                {movies.length > 0 && <NavLink to="/favourites">See all</NavLink>}
                            </div>

                            {recentFavourites.length > 0 ? (
                                <ul className="profile-posters">
                                    {recentFavourites.map((movie) => (
                                        <li key={movie.id}>
                                            <NavLink to={`/details/${movie.id}`}>
                                                <Image imageUrl={movie.poster_path} alt={`${movie.title} Poster`} />
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="profile-empty">
                                    Nothing here yet. <NavLink to="/">Browse movies</NavLink> and add the ones you love.
                                </p>
                            )}
                        </section>

                        <section className="grow profile-card">
                            <h2>Top genres</h2>
                            <p className="profile-card-subtitle">Worked out from the movies you favourite.</p>

                            {topGenres.length > 0 ? (
                                <ul className="profile-genres">
                                    {topGenres.map((genre) => (
                                        <li key={genre.id}>
                                            <span>{genre.name}</span>
                                            <span className="profile-genre-track" aria-hidden="true">
                                                <span className="profile-genre-bar"
                                                      style={{ width: `${(genre.count / topGenres[0].count) * 100}%` }} />
                                            </span>
                                            <span className="profile-genre-count">{genre.count}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="profile-empty">Favourite a few movies to see which genres you lean towards.</p>
                            )}
                        </section>

                    </div>
                </div>

            </section>
        </>
    );
};

export default Profile;

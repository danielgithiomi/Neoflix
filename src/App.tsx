import User from './data/User.ts';
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import { SEX } from './data/Sex.ts';
import Profile from './pages/Profile.tsx';
import Header from "./components/Header.tsx";
import ErrorComponent from './pages/Error.tsx';
import Favourites from "./pages/Favourites.tsx";
import { Route, Routes, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import MovieDetails from "./pages/MovieDetails.tsx";
import { FavouriteProvider } from "./contexts/FavouriteContext.tsx";
import { getAppwriteUserProfilePictureUrl, userProfilePictureId } from './services/UserService.ts';

// The auth pages are full-screen and show their own logo instead of the site header
const AUTH_PATHS: string[] = ["/login", "/signup"];

function App() {

    const { pathname } = useLocation();
    const isAuthPage: boolean = AUTH_PATHS.includes(pathname);

    const resourceUrl = useQuery({
        queryKey: ["user_profile_picture", userProfilePictureId],
        queryFn: () => getAppwriteUserProfilePictureUrl(userProfilePictureId),
    });

    const currentUser: User = {
        last_name: "Doe",
        gender: SEX.MALE,
        username: "JOHDOE",
        first_name: "John",
        password: "password123",
        email_address: "john.doe@example.com",
        profile_image_url: resourceUrl.data as string,
    }

    return (
        <main className="flex flex-col">

            {!isAuthPage && <Header userProfilePictureUrl={resourceUrl.data as string} />}

            <section className="content grow">
                <FavouriteProvider>
                    <Routes>
                        <Route index errorElement={<ErrorComponent />} element={<Home />} />
                        <Route path="favourites" element={<Favourites />} />
                        <Route path="profile" element={<Profile user={currentUser} />} />
                        <Route path="details/:movie_id" element={<MovieDetails />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<SignUp />} />
                    </Routes>
                </FavouriteProvider>
            </section>

        </main>
    )
}

export default App

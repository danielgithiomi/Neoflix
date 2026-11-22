import { CSSProperties } from 'react';
import { useAuth } from '@/contexts/AuthContext.tsx';
import neoflixLogo from '../assets/brand/neoflix-logo.svg';
import { getAuthErrorMessage } from '@libs/utils/authErrors.ts';
import { FaArrowCircleDown, FaBell, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { NavLink, NavLinkRenderProps, useLocation, useNavigate } from "react-router-dom";

interface HomeProps {
    userProfilePictureUrl: string;
}

const Header = ({ userProfilePictureUrl }: HomeProps) => {

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { status, logOut } = useAuth();

    const handleLogOut = async () => {
        try {
            await logOut();
            navigate("/login", { replace: true });
        } catch (error: unknown) {
            alert(getAuthErrorMessage(error));
        }
    };

    const showSearchIcon = pathname === "/";

    const handleOnSearchFocus = () => {
        const searchBoxElement = document.getElementById("movie-search");

        if (searchBoxElement) {
            searchBoxElement.scrollIntoView({ behavior: "smooth", block: "center" });
            searchBoxElement.focus();
        }
    }

    // Inactive links get no inline style, so their text-white / hover:text-red-500 classes apply
    const activeLink = ({ isActive }: NavLinkRenderProps): CSSProperties => {
        return isActive
            ? {
                color: "red",
                fontWeight: "bold"
            }
            : {}
    }

    return (
        // On phones the nav drops to its own row under the logo and profile
        <div className="z-20 relative flex flex-row flex-wrap md:flex-nowrap justify-between items-center gap-y-2 py-3 md:py-6">

            <NavLink to={"/"} aria-label="Neoflix home">
                <div className="flex items-center md:px-6 logo brand">
                    <img src={neoflixLogo} alt="Neoflix" className="w-auto h-7 md:h-10" />
                </div>
            </NavLink>

            <nav className="order-last md:order-none w-full md:w-auto">
                <ul className="flex justify-center md:justify-start pt-2 md:pt-0 border-white/10 border-t md:border-t-0 text-sm md:text-base uppercase nav-links">
                    <NavLink style={activeLink} className="text-white hover:text-red-500 link" to='/'>Home</NavLink>
                    <NavLink style={activeLink} className="text-white hover:text-red-500 link" to='/favourites'>Favourites</NavLink>
                </ul>
            </nav>

            <div className="flex flex-row items-center gap-5 md:mr-20 user">
                {/* Search lives in the home page hero, so phones skip these to save space */}
                {showSearchIcon && (
                    <button type="button" aria-label="Search" className="hidden sm:block" onClick={handleOnSearchFocus}>
                        <FaSearch className="text-white hover:text-red-500 icon" size={20} />
                    </button>
                )}
                <FaBell className="hidden sm:block text-white hover:text-red-500 icon" size={20} />

                <NavLink to="/profile" aria-label="Your profile" className="flex flex-row items-center gap-1 user-profile">
                    <div className="bg-neutral-800 border-2 border-red-600 rounded-full overflow-hidden">
                        <img src={userProfilePictureUrl} alt="" className="w-9 md:w-[50px] h-9 md:h-[50px] object-cover" />
                    </div>
                    <FaArrowCircleDown className='hidden md:block text-red-600' size={15} />
                </NavLink>

                {status === "authenticated" && (
                    <button type="button" aria-label="Log out" title="Log out" className="cursor-pointer" onClick={handleLogOut}>
                        <FaSignOutAlt className="text-white hover:text-red-500 icon" size={20} />
                    </button>
                )}
            </div>

        </div>
    );

}

export default Header;

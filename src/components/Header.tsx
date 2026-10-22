import { CSSProperties } from 'react';
import neoflixLogo from '../assets/brand/neoflix-logo.svg';
import { NavLink, NavLinkRenderProps } from "react-router-dom";
import { FaArrowCircleDown, FaBell, FaSearch } from "react-icons/fa";

interface HomeProps {
    userProfilePictureUrl: string;
}

const Header = ({ userProfilePictureUrl }: HomeProps) => {

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
        <div className="flex flex-row flex-wrap md:flex-nowrap justify-between items-center gap-y-2 py-3 md:py-6">

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
                <NavLink to="/" aria-label="Search" className="hidden sm:block">
                    <FaSearch className="text-white hover:text-red-500 icon" size={20} />
                </NavLink>
                <FaBell className="hidden sm:block text-white hover:text-red-500 icon" size={20} />

                <NavLink to="/profile" aria-label="Your profile" className="flex flex-row items-center gap-1 user-profile">
                    <div className="bg-neutral-800 border-2 border-red-600 rounded-full overflow-hidden">
                        <img src={userProfilePictureUrl} alt="" className="w-9 md:w-[50px] h-9 md:h-[50px] object-cover" />
                    </div>
                    <FaArrowCircleDown className='hidden md:block text-red-600' size={15} />
                </NavLink>
            </div>

        </div>
    );

}

export default Header;

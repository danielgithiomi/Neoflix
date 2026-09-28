import '../App.css';
import { CSSProperties } from 'react';
import appLogo from '../assets/images/app_logo.png';
import { NavLink, NavLinkRenderProps } from "react-router-dom";
import { FaArrowCircleDown, FaBell, FaSearch } from "react-icons/fa";

interface HomeProps {
    userProfilePictureUrl: string;
}

const Header = ({ userProfilePictureUrl }: HomeProps) => {

    const activeLink = ({ isActive }: NavLinkRenderProps): CSSProperties => {
        return isActive
            ? {
                color: "red",
                fontWeight: "bold"
            }
            : {
                color: "white"
            }
    }

    return (
        <div className="flex flex-row justify-between items-center">

            <NavLink to={"/"}>
                <div className="flex items-center logo brand">
                    <img src={appLogo} alt="App Logo" className="logo" />
                    <h3 className="font-extrabold text-red-600 text-4xl uppercase tracking-wide brand-text">Neoflix</h3>
                </div>
            </NavLink>

            <nav>
                <ul className="uppercase nav-links">
                    <NavLink style={activeLink} className="text-white hover:text-red-500 link" to='/'>Home</NavLink>
                    <NavLink style={activeLink} className="text-white hover:text-red-500 link" to='/favourites'>Favourites</NavLink>
                </ul>
            </nav>

            <div className="flex flex-row items-center gap-5 mr-20 user">
                <NavLink to="/">
                    <FaSearch className="text-white hover:text-red-500 icon" size={20} />
                </NavLink>
                <FaBell className="text-white hover:text-red-500 icon" size={20} />

                <NavLink to="/profile" className="flex flex-row items-center gap-1 user-profile">
                    <div className="border-2 border-red-600 rounded-full overflow-hidden">
                        <img src={userProfilePictureUrl} alt="Profile Picture" className="w-[50px] h-[50px]" />
                    </div>
                    <FaArrowCircleDown className='text-red-600' size={15} />
                </NavLink>
            </div>

        </div>
    );

}

export default Header;

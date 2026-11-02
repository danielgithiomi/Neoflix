import PosterWall from './PosterWall';
import { NavLink } from 'react-router-dom';
import { TAuthLayoutProps } from '../data/Auth';
import neoflixLogo from '../assets/brand/neoflix-logo.svg';

// Shared shell for the login and sign-up pages: poster wall, logo, and a frosted card
const AuthLayout = ({ title, subtitle, children, footer }: TAuthLayoutProps) => {

    return (
        <section className="auth-page">

            {/* Extra rows so the tilted wall still covers a tall phone screen */}
            <PosterWall rows={9} />
            <div className="auth-shade" />

            <NavLink to="/" aria-label="Neoflix home" className="z-10 relative">
                <img src={neoflixLogo} alt="Neoflix" className="auth-logo" />
            </NavLink>

            <div className="auth-card">
                <h1 className="auth-title">{title}</h1>
                <p className="auth-subtitle">{subtitle}</p>

                {children}

                <p className="auth-footer">{footer}</p>
            </div>

        </section>
    )
}

export default AuthLayout

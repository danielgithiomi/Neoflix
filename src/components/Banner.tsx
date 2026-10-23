import Search from './Search';
import GenreChips from './GenreChips';
import PosterWall from './PosterWall';
import { Dispatch, SetStateAction } from 'react';

type TBannerProps = {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    selectedGenre: number | null;
    setSelectedGenre: Dispatch<SetStateAction<number | null>>;
};

const Banner = ({ searchTerm, setSearchTerm, selectedGenre, setSelectedGenre }: TBannerProps) => {

    return (
        <section className="hero">

            <PosterWall />
            <div className="hero-shade" />

            <div className="hero-content">
                <h1 className="hero-title">
                    Neoflix <br className="sm:hidden" />and <span className="text-red-600">chill</span>
                </h1>
                <p className="hero-tagline">Every movie. No ads. No hassle.</p>

                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <GenreChips selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
            </div>

        </section>
    )
}

export default Banner

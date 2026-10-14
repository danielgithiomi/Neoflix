import * as React from "react";
import { FaSearch } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";

type TSearchProps = {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
};

const Search = ({ searchTerm, setSearchTerm }: TSearchProps) => {
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const value = event.target.value;
        setSearchTerm(value);
    };

    return (
        <>
            <div className="flex flex-row items-center gap-5 mx-auto mb-8 p-3 border-2 border-red-600 rounded-2xl w-[80%] sm:w-[70%] md:w-[50%] lg:w-[30%]">
                <FaSearch size={20} className="text-red-600" />
                <input
                    type="text"
                    className="overflow-hidden search-input grow"
                    id="movie-search"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for any movie..."
                />
            </div>
        </>
    );
};

export default Search;

import * as React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Dispatch, SetStateAction, useRef } from "react";

type TSearchProps = {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
};

const Search = ({ searchTerm, setSearchTerm }: TSearchProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Results already update as you type, so submitting just closes the mobile keyboard
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        inputRef.current?.blur();
    };

    const clearSearch = () => {
        setSearchTerm("");
        inputRef.current?.focus();
    };

    return (
        <form role="search" className="search-pill" onSubmit={handleSubmit}>
            <label htmlFor="movie-search" className="sr-only">
                Search movies
            </label>
            <input
                ref={inputRef}
                type="search"
                id="movie-search"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search for any movie…"
                autoComplete="off"
            />
            {searchTerm && (
                <button type="button" className="search-clear" aria-label="Clear search" onClick={clearSearch}>
                    <FaTimes size={14} />
                </button>
            )}
            <button type="submit" className="search-button" aria-label="Search">
                <FaSearch size={16} />
            </button>
        </form>
    );
};

export default Search;

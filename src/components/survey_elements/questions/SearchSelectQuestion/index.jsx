import React, { useState } from 'react';
import styles from "./style.module.css";

const SearchSelectQuestion = (props) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(props.answer || []);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [message, setMessage] = useState("Please type a search query!");

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearchClick = async () => {

        if (query.length === 0) {
            setResults([]);
            setMessage("Please type a search query!");
            return
        }

        fetch(`http://omdbapi.com/?s=${query}&apikey=ea2e4238&t=movie`)
            .then(response => response.json())
            .then(data => {

                if (data.Response === "True") {
                    setResults(data.Search)
                } else {
                    setMessage(data.Error)
                    setResults([])
                }

                setIsDropdownOpen(true)

            });
    };

    const handleSelect = (item) => {
        if (selected.length < props.maxSelection) {
            setSelected([...selected, item]);
            props.onAnswer([...selected, item]);
        }
        setIsDropdownOpen(false)
    };

    const handleRemove = (item) => {
        setSelected(selected.filter((x) => x !== item));
    };

    return (
        <div className={styles.search}>
            <div
                onClick={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
            >
                {isDropdownOpen && results.length > 0 && (
                    <div className={styles.searchResults}>
                        {results.map((item, i) => (
                            item.Poster !== "N/A" ?
                                <div key={i} className={styles.searchResult} onClick={() => handleSelect(item)}>
                                    <img src={item.Poster} alt={item.Title} />
                                    <p>{item.Title} &#40;{item.Year}&#41;</p>
                                </div> : <></>
                        ))}
                    </div>
                )}
                {isDropdownOpen && results.length === 0 && (
                    <div className={styles.searchResults}>
                        <div className={styles.searchResult} >
                            <p>{message}</p>
                        </div>
                    </div>
                )}
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' ? handleSearchClick() : {}}
                    />
                    <button onClick={handleSearchClick} disabled={query.length === 0}>
                        <i className="fa fa-search" />
                    </button>
                </div>
            </div>
            <div className={styles.searchSelected}>
                {selected.map((item) => (
                    <div key={item.imdbID} className={styles.searchSelectedItem}>
                        <img src={item.Poster} alt={item.Title} />
                        <p>{item.Title} &#40;{item.Year}&#41;</p>
                        <button className={styles.searchRemove} onClick={() => handleRemove(item)}>
                            <i className="fa fa-times" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchSelectQuestion;
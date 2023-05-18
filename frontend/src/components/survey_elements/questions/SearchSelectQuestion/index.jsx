import React, { useState } from 'react';
import styles from "./style.module.css";

const SearchSelectQuestion = (props) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState(props.answer || new Set());
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [message, setMessage] = useState(selected.size < props.maxSelection ? "Please type a search query of at least 3 characters!" : "You've selected the maximum number of options possible.");

    const handleInputChange = (event) => {

        const newQuery = event.target.value;

        setQuery(newQuery);

        if (newQuery.length < 3) {
            setResults([]);
            setMessage("Please type a search query of at least 3 characters!");
            return
        }

        setResults([]);
        setMessage("Searching...")
        fetch(`http://omdbapi.com/?s=${newQuery.trim()}&apikey=${process.env.OMDB_API_KEY}&t=movie`)
            .then(response => response.json())
            .then(data => {
                
                if (data.Response === "True") {

                    let queryResult = data.Search.filter((e) => { return e.Poster !== "N/A" });
                    if (queryResult.length === 0) {
                        setResults([])
                        setMessage("Movie not found!")
                    } else setResults(queryResult)

                } else {
                    setMessage(data.Error)
                    setResults([])
                }

                setIsDropdownOpen(true)

            });

    };

    const handleSelect = (item) => {
        if (selected.size < props.maxSelection) {

            const newSelection = selected.add(item);

            setSelected(newSelection);
            setQuery("");
            setResults([]);

            if (newSelection.size < props.maxSelection)
                setMessage("Please type a search query of at least 3 characters!");
            else setMessage("You've selected the maximum number of options possible.");

            let invalidMessage = "";

            if (newSelection.size < props.minSelection)
                invalidMessage = `This question requires at least ${props.minSelection} items, please select ${props.minSelection - newSelection.size} more.`

            props.onAnswer(newSelection, invalidMessage);
        }
        setIsDropdownOpen(false)
    };

    const handleRemove = (item) => {

        const newSelection = new Set([...selected].filter(x => x !== item));

        setSelected(newSelection);

        let invalidMessage = "";

        if (newSelection.size < props.minSelection)
            invalidMessage = `This question requires at least ${props.minSelection} items, please select ${props.minSelection - newSelection.size} more.`

        props.onAnswer(newSelection, invalidMessage);

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
                            <div key={i} className={styles.searchResult} onClick={() => handleSelect(item)}>
                                <img src={item.Poster} alt={item.Title} />
                                <p>{item.Title} &#40;{item.Year}&#41;</p>
                            </div>
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
                        disabled={selected.size === props.maxSelection}
                    />
                </div>
            </div>
            <div className={styles.searchSelected}>
                {[...selected].map((item) => (
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
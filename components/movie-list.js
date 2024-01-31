'use client'

import React, { useState, useEffect } from "react";

export default function MovieList() {

    const [movies, setMovies] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const baseUrl = 'https://api.themoviedb.org/3';
    const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiToken}`
        }
    };

    const fetchMovies = (pageNumber) => {

        const apiEndpoint = '/movie/top_rated?language=en-US&page=';
        const url = `${baseUrl}${apiEndpoint}${pageNumber}`;

        console.log(`url: ${url}`);

        return fetch(url, options)
            .then(res => res.json())
            .then(json => {
                setCurrentPageNumber(json['page']);
                setTotalPages(json['total_pages']);
                const movies = json['results'];
                setMovies(movies);
            })
            .catch(err => console.error('error:' + err));
    }

    useEffect(() => {
        fetchMovies(1);
    }, []);

    const movieList = movies.map((movie) => {

        let movieOverview = <span>{movie['overview'].substring(0, 200) + '...'}</span>;

        return (
            <li key={movie['id']}>
                <strong>{movie['title']}</strong> ({movie['release_date']}) | Rating: <strong>{Math.round(movie['vote_average'])} /10</strong >
                <ul>
                    <li key={movie['id'] + ':1'}>
                        Overview: {movieOverview}
                    </li>
                </ul>
                <p />
            </li>
        );
    });

    const navigateNextPrev = (e, direction) => {
        e.preventDefault();

        console.log(`navigateNextPrev(): ${direction}. currentPageNumber: ${currentPageNumber}`);

        const pageNumber = direction === 'next' ? currentPageNumber + 1 : currentPageNumber - 1;
        fetchMovies(pageNumber);
    }

    const PrevButton = (
        <button className="rounded-lg border border-gray-300 bg-gray-100 px-5 py-4 mr-4"
            disabled={currentPageNumber - 1 > 0 ? false : true}
            onClick={(e) => { navigateNextPrev(e, 'prev') }}
        >
            <span className={`mb-3 text-xl font-semibold`}>
                Prev{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    &lt;-
                </span>
            </span>
        </button>
    );

    const CurrentPageInfo = <span>You are on <strong>page #{currentPageNumber}</strong> of {totalPages}</span>;

    const NextButton = (
        <button
            className="rounded-lg border border-gray-300 bg-gray-100 px-5 py-4 ml-4"
            disabled={currentPageNumber < totalPages ? false : true}
            onClick={(e) => { navigateNextPrev(e, 'next') }}
        >
            <span className={`mb-3 text-xl font-semibold`}>
                Next{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                </span>
            </span>
        </button>
    );

    const NextPrevPageNav = (
        <div className="mb-8 text-center lg:max-w-5xl lg:grid-cols-4 lg:text-left">
            {PrevButton}
            {CurrentPageInfo}
            {NextButton}
        </div>
    );
    
    return (
        <>
            <h2 className="mb-3 text-2xl font-semibold">Top Rated Movies</h2>
            {NextPrevPageNav}

            <ul>{movieList}</ul>
        </>
    );
}
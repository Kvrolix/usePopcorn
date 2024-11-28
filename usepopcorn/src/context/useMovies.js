import { useState, useEffect } from 'react';

const KEY = '2cf29f28';
// THINK OF IT LIKE A CUSTOM API
export function useMovies(query, callback) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	useEffect(
		function () {
			callback?.(); // The function will be called only if it exists
			const controller = new AbortController();
			async function fetchMovies() {
				try {
					// Browser API

					setIsLoading(true); // LOADING STARTED
					setError(''); // Very importrant to reset errors
					const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&S=${query}`, {
						singal: controller.signal,
					});

					if (!res.ok) throw new Error('Something went wrong with fetching movies');

					const data = await res.json();
					if (data.Response === 'False') throw new Error('Movie not found');
					// console.log(data);
					setMovies(data.Search);
					setError('');
				} catch (err) {
					// console.error(err.message);
					// err.message = 'Something went wrong with fetching movies'
					if (err.name !== 'AbortError') setError(err.message);
				} finally {
					setIsLoading(false); // LOADING ENDED
				}
			}
			if (query.length < 3) {
				setMovies([]);
				setError('');
				return;
			}

			fetchMovies(); // The function must be called to produce results, but it is being
			return function () {
				controller.abort();
			};
		},
		[query]
	);
	return { movies, isLoading, error };
}

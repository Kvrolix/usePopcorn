import { useState } from 'react';

import { useMovies } from './context/useMovies.js';
import { useLocalStorageState } from './useLocalStorageState.js';

// Componenents
import { Box } from './components/Box.js';
import { ErrorMessage } from './components/ErrorMessage.js';
import { Loader } from './components/Loader.js';
import { MovieList } from './components/MovieList.js';
import { MovieDetails } from './components/MovieDetails.js';
import { Main } from './components/Main.js';
import { Navbar } from './components/Navbar.js';
import { NumResults } from './components/NumResults.js';
import { WatchedMovieList } from './components/WatchedMovieList.js';
import { WatchedSummary } from './components/WatchedSummary.js';
import { Search } from './components/Search.js';

// const KEY = '2cf29f283232';

export default function App() {
	const [query, setQuery] = useState('');
	// const tempQuery = 'godfather';
	const [selectedId, setSelectedId] = useState(null);

	// The hook returns the variables, which we immediateley destrucutre
	const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

	const [watched, setWatched] = useLocalStorageState([], 'watched');

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		// based on all watched, add a new movie object
		setWatched((watched) => [...watched, movie]);

		// // simply calling the array won't work, hence we need bo build a new array on exisitng arra, then add a new movie to the list and this is how it is being added
		// // We need to store it as a strings, there  we use JSON
		// localStorage.setItem('watched', JSON.stringify([...watched, movie]));
	}
	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
		// it will keep the movies which ones do not have the selected id
	}

	// In this version we don't have to create a new array, as because we use the dependency array to re-render when the state is updated

	return (
		<>
			<Navbar>
				<Search
					query={query}
					setQuery={setQuery}
				/>
				<NumResults movies={movies} />
			</Navbar>

			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList
							movies={movies}
							onSelectMovie={handleSelectMovie}
						/>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

// TODO

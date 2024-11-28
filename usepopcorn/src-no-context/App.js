import { useEffect, useState, useRef } from 'react';
import StarRating from './StarRating.js';
import { useMovies } from './useMovies.js';
import { useLocalStorageState } from './useLocalStorageState.js';
import { useKey } from './useKey.js';

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = '2cf29f28';
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
			<NavBar>
				<Search
					query={query}
					setQuery={setQuery}
				/>
				<NumResults movies={movies} />
			</NavBar>

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

function Loader() {
	return <p className="loader">Loading</p>;
}

function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>⛔</span>
			{message}
		</p>
	);
}
// Structural Component - Providing structure
function NavBar({ children }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{/* Going more deep would be unecessary but it is possible */}
			{children}
		</nav>
	);
}
// Stateful Component
function Search({ query, setQuery }) {
	const inputEl = useRef(null); // When working with DOM element, usually we prefer null

	useKey('Enter', function () {
		if (document.activeElement === inputEl.current) return;
		inputEl.current.focus();
		setQuery('');
	});

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputEl}
		/>
	);
}
// Presentational Component - Stateless
function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function NumResults({ movies }) {
	return (
		<p className="num-results">
			{/* Found <strong>{movies.length}</strong> results */}
			Found <strong>{movies.length}</strong> results
		</p>
	);
}
// Structural Component - Providing structure
function Main({ children }) {
	return <main className="main">{children}</main>;
}
// // Stateful Component
function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className="box">
			<button
				className="btn-toggle"
				onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? '–' : '+'}
			</button>
			{isOpen && children}
		</div>
	);
}

// Stateful Component
function MovieList({ movies, onSelectMovie, onCloseMovie }) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie
					movie={movie}
					key={movie.imdbID}
					onSelectMovie={onSelectMovie}
					onCloseMovie={onCloseMovie}
				/>
			))}
		</ul>
	);
}
// Presentational Component - Stateless
function Movie({ movie, onSelectMovie }) {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img
				src={movie.Poster}
				alt={`${movie.Title} poster`}
			/>
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
	const [movie, setMovie] = useState({}); // As we have received the object from an API
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');

	const countRef = useRef(0);

	useEffect(
		function () {
			if (userRating) countRef.current++;
		},
		[userRating]
	); //We want to update it every single time the rating is changing

	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

	const { Title: title, Year: year, Poster: poster, Runtime: runtime, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre, imdbRating } = movie;

	// console.log(title, year);
	useEffect(
		function () {
			// TODO write the catch error
			async function getMovieDetails() {
				setIsLoading(true);
				const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
				const data = await res.json();
				setMovie(data);
				setIsLoading(false);
				// console.log(data);
			}
			getMovieDetails();
		},
		[selectedId]
	);

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(' ').at(0)),
			userRating,
			countRatingDecisions: countRef.current,
		};
		// console.log(newWatchedMovie);
		onAddWatched(newWatchedMovie);
		onCloseMovie();
	}
	useKey('Escape', onCloseMovie);

	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;
			// async function setPageTitle
			// CLEANUP FUNCTION
			return function () {
				document.title = 'usePopcorn';
				// The closure means that all the variables etc, that was present in the function are going to be remebered by the time it was created
			};
		},
		[title]
	);
	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button
							className="btn-back"
							onClick={onCloseMovie}>
							&larr;
						</button>
						<img
							src={poster}
							alt={`Poster of ${movie}`}
						/>
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐</span>
								{imdbRating} IMDbRating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							{!isWatched ? (
								// {/* if movie is in  watched array then do not show this component */}
								// {/* selectedID !=== watched.imdbID  */}
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>
									{userRating > 0 && (
										<button
											className="btn-add"
											onClick={handleAdd}>
											+ Add to list
										</button>
									)}
								</>
							) : (
								<p>
									You rated the movie {watchedUserRating}
									<span>⭐</span>
								</p>
							)}
						</div>

						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}

// Presentational Component - Stateless
function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));
	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

// Presentational Component - Stateless
function WatchedMovieList({ watched, onDeleteWatched }) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteWatched={onDeleteWatched}
				/>
			))}
		</ul>
	);
}

// Presentational Component - Stateless
function WatchedMovie({ movie, onDeleteWatched }) {
	return (
		<li>
			<img
				src={movie.poster}
				alt={`${movie.title} poster`}
			/>
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
				<button
					className="btn-delete"
					onClick={() => onDeleteWatched(movie.imdbID)}>
					X
				</button>
			</div>
		</li>
	);
}

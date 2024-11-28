import { useEffect, useState } from 'react';
import StarRating from './StarRating.js';

const tempMovieData = [
	{
		imdbID: 'tt1375666',
		Title: 'Inception',
		Year: '2010',
		Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
	},
	{
		imdbID: 'tt0133093',
		Title: 'The Matrix',
		Year: '1999',
		Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
	},
	{
		imdbID: 'tt6751668',
		Title: 'Parasite',
		Year: '2019',
		Poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
	},
];

const tempWatchedData = [
	{
		imdbID: 'tt1375666',
		Title: 'Inception',
		Year: '2010',
		Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
		runtime: 148,
		imdbRating: 8.8,
		userRating: 10,
	},
	{
		imdbID: 'tt0088763',
		Title: 'Back to the Future',
		Year: '1985',
		Poster: 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
		runtime: 116,
		imdbRating: 8.5,
		userRating: 9,
	},
];

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = '2cf29f28';
// const KEY = '2cf29f283232';

export default function App() {
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [query, setQuery] = useState('');
	// const tempQuery = 'godfather';
	const [selectedId, setSelectedId] = useState(null);
	// const [selectedId, setSelectedId] = useState('tt1375666');

	// useEffect(function () {
	// 	console.log('after initial');
	// }, []);
	// useEffect(function () {
	// 	console.log('After every render');
	// });

	// console.log('During');
	// useEffect(
	// 	function () {
	// 		console.log('D');
	// 	},
	// 	[query]
	// );
	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		// based on all watched, add a new movie object
		setWatched((watched) => [...watched, movie]);
	}
	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
		// it will keep the movies which ones do not have the selected id
	}

	useEffect(
		function () {
			const controller = new AbortController();
			async function fetchMovies() {
				try {
					// Browser API

					setIsLoading(true); // LOADING STARTED
					setError(''); // Very importrant to reset errors
					const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&S=${query}`, { singal: controller.signal });

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
			handleCloseMovie();
			fetchMovies(); // The function must be called to produce results, but it is being
			return function () {
				controller.abort();
			};
		},
		[query]
	);

	// This should never be allowed in render logic as it accesses infromation from outside

	return (
		<>
			{/* This technique like this tree, Is moving us towards real react code writing */}
			<NavBar>
				<Search
					query={query}
					setQuery={setQuery}
				/>
				<NumResults movies={movies} />
			</NavBar>
			{/* We use the prop drilling here on 3 levels deep, later on we will learn how to avoid it as it does creates some issues */}
			{/* Can be fixed with Component Composistion */}
			{/* Thanks to this solution I am only passing it once and this is achieved by a Component Composistion Which Creates a Visible tree, which is exttracted from other children components */}
			<Main>
				<Box>
					{/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
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
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
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
	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	// console.log(`isWatched:`, isWatched);
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
	useEffect(
		function () {
			function callback(e) {
				if (e.code === 'Escape') onCloseMovie();
			}
			document.addEventListener('keydown', callback);
			return function () {
				document.removeEventListener('keydown', callback);
			};
		},
		[onCloseMovie]
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
		};
		// console.log(newWatchedMovie);
		onAddWatched(newWatchedMovie);
		onCloseMovie();
	}

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

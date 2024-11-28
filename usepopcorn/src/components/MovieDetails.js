import { useState, useRef, useEffect, useKey } from 'react';
import { Loader } from './Loader';
import StarRating from './StarRating';
const KEY = '2cf29f28';

export function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
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

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
		imdbRating,
	} = movie;

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
	// useKey('Escape', onCloseMovie);

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

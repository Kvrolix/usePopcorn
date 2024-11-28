import { Movie } from './Movie';

// Stateful Component

export function MovieList({ movies, onSelectMovie, onCloseMovie }) {
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

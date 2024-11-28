import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import StarRating from './StarRating';

function Test() {
	const [moveiRating, setMovieRating] = useState(0);
	return (
		<div>
			<StarRating
				color="blue"
				maxRating={10}
				onSetRating={setMovieRating} // this enables to get the info about the state
			/>
			<p>This movie was rated {moveiRating} star</p>;
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
// 	<React.StrictMode>
// 		<App />
// 		<Test />
// 		<StarRating
// 			maxRating={5}
// 			messages={[`Terrible`, `Bad`, `Okay`, `Good`, `Amazing`]}
// 		/>
// 		<StarRating
// 			maxRating={10}
// 			size={24}
// 			color="red"
// 			className="test" // To add more stuff
// 			defaultRating={3}
// 		/>
// 	</React.StrictMode>
// );

import { useRef } from 'react';
import { useKey } from '../useKey';

// Stateful Component
export function Search({ query, setQuery }) {
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
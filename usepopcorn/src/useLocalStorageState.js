import { useState, useEffect } from 'react';
export function useLocalStorageState(initialState, key) {
	const [value, setValue] = useState(function () {
		const storedValue = localStorage.getItem(key);
		// As the app first renders the value is null, therefore we need to check it so it won't throw the error
		return storedValue ? JSON.parse(storedValue) : initialState;
	});
	useEffect(
		function () {
			localStorage.setItem(key, JSON.stringify(value));
		},
		[value, key]
	);
	return [value, setValue];
}

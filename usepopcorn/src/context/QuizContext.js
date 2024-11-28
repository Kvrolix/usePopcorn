// Here i need to move all the stuff that gets the data

import { createContext, useReducer, useState } from 'react';

const QuizContext = createContext();
const initialState = { query: '', selectedId: null };

function reducer(state, action) {}

function QuizProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const [query, setQuery] = useState('');
	// const tempQuery = 'godfather';
	const [selectedId, setSelectedId] = useState(null);

	return <QuizContext.Provider value={{}}></QuizContext.Provider>;
}

function useQuiz() {}

export { QuizProvider, useQuiz };

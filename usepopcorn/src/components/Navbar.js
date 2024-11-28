import { Logo } from './Logo';

// Structural Component - Providing structure
export function Navbar({ children }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{/* Going more deep would be unecessary but it is possible */}
			{children}
		</nav>
	);
}

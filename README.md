# 🎥 Movie Watchlist App

The **usePopcorn** is a React-based application designed to help users search for movies, view details, and maintain a personalized watchlist. With dynamic data fetching from the OMDb API, users can efficiently browse, add, and manage their movie collections, along with ratings and summaries.

---

## 🚀 Features

### **1. Movie Search**
- Search movies dynamically using the OMDb API.
- Display search results with movie posters, titles, and release years.

### **2. View Movie Details**
- Fetch and display detailed information about a selected movie, including:
  - Title, Year, Runtime, Genre, Plot, Actors, and Director.
  - IMDb rating and user rating functionality.

### **3. Add Movies to Watchlist**
- Save movies to a watchlist with custom ratings and runtime statistics.
- Prevent duplicate additions by checking the movie's ID.

### **4. Manage Watchlist**
- View a detailed summary of watched movies:
  - Total movies watched.
  - Average IMDb and user ratings.
  - Average runtime.
- Remove movies from the watchlist with a single click.

### **5. Dynamic and Responsive Design**
- Responsive UI with collapsible sections for a clean user experience.
- Search bar with keyboard shortcuts for ease of use:
  - Press `Enter` to focus on the search bar.
  - Press `Escape` to clear the current selection.

### **6. Local Storage Integration**
- Persist the watchlist data using `localStorage`.
- Ensure data retention across sessions.

### **7. Error Handling**
- Display error messages for invalid searches or failed API requests.
- Use an abort controller to handle rapid search queries efficiently.

---

## 🛠️ Technologies Used

- **React**: Component-based UI development.
- **JavaScript (ES6+)**: Modern syntax and functional programming concepts.
- **CSS**: Basic styling for layout and user experience.
- **OMDb API**: Data source for movie information.

---



## 📖 What I Learned

This project allowed me to explore and implement the following React concepts and techniques:

1. **Custom Hooks**:
   - Built reusable hooks (`useMovies` and `useLocalStorageState`) to manage data fetching and local storage integration.

2. **State Management**:
   - Used `useState` for managing component states such as queries, selected movies, and watchlists.
   - Explored `useEffect` for side effects like fetching data and updating document titles.

3. **Keyboard Shortcuts**:
   - Integrated `useKey` for custom keyboard shortcuts, enhancing accessibility and user experience.

4. **Dynamic UI**:
   - Displayed real-time search results and summaries based on user interactions.
   - Implemented collapsible sections for better UI management.

5. **Error Handling**:
   - Added robust error handling for failed API requests and invalid searches.

6. **Local Storage**:
   - Ensured persistent data storage using `localStorage`.

7. **Component Design**:
   - Followed a modular and reusable component-based architecture.

---

## 🌟 Future Improvements

- **User Authentication**:
  - Add user accounts to save and sync watchlists across devices.

- **Improved UI/UX**:
  - Add filtering and sorting options for the watchlist.
  - Enhance responsiveness for mobile devices.

- **Advanced Features**:
  - Integrate movie recommendations based on watchlist preferences.
  - Allow users to leave reviews and share their watchlists.

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js installed on your local machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Kvrolix/usePopcorn.git
   ```
2. Navigate to the project directory:
   ```bash
   cd movie-watchlist-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

---

## 📷 Screenshots


---

## 🤝 Contributions

The project have been completed during the Jonas Schmedtmann course.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

For any questions or suggestions, reach out to me at:
- **Email**: your.email@example.com
- **GitHub**: [your-username](https://github.com/your-username)

---

Enjoy exploring movies! 🎬

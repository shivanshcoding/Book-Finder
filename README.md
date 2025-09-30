# Book Finder

A modern web application for searching and discovering books using the Open Library API. This project features a responsive frontend built with Next.js and a backend API server built with Express.js.

![Book Finder Screenshot](https://via.placeholder.com/800x400?text=Book+Finder+Screenshot)

## Features

- **Advanced Book Search**: Search books by title, author, subject, or ISBN
- **Autocomplete Suggestions**: Get real-time suggestions as you type
- **Advanced Filters**: Filter results by publication year and language
- **Search History**: Track your recent searches in a minimizable sidebar
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern interface with animations and visual feedback

## Tech Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: For state management and side effects

### Backend
- **Express.js**: Web application framework for Node.js
- **Axios**: Promise-based HTTP client
- **CORS**: Cross-Origin Resource Sharing middleware

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/book-finder.git
cd book-finder
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm start
```
The backend server will run on http://localhost:5000

2. Start the frontend development server
```bash
cd frontend
npm run dev
```
The frontend will be available at http://localhost:3000

## API Endpoints

### GET `/api/books`
Search for books with various parameters.

**Parameters:**
- `title`: Search by book title
- `author`: Search by author name
- `subject`: Search by subject/category
- `isbn`: Search by ISBN
- `year`: Filter by publication year
- `language`: Filter by language

**Example:**
```
GET /api/books?title=Harry%20Potter&language=eng
```

### GET `/api/autocomplete`
Get autocomplete suggestions for search queries.

**Parameters:**
- `query`: The search term
- `type`: Type of search (title, author, subject, isbn)

**Example:**
```
GET /api/autocomplete?query=Harry&type=title
```

## Project Structure

```
book-finder/
├── backend/
│   ├── server.js       # Express server and API routes
│   └── package.json    # Backend dependencies
└── frontend/
    ├── src/
    │   ├── app/        # Next.js app directory
    │   │   └── page.js # Main page component
    │   ├── components/ # React components
    │   └── styles/     # CSS styles
    ├── public/         # Static assets
    └── package.json    # Frontend dependencies
```

## Future Enhancements

- User authentication and personalized recommendations
- Book details page with more information
- Save favorite books functionality
- Dark mode toggle
- Integration with additional book APIs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Open Library API](https://openlibrary.org/developers/api) for providing book data
- [Next.js](https://nextjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
# 📚 Book Finder

A full-stack MERN application that allows users to search for books using the Open Library API, with real-time autocomplete suggestions and a responsive UI.

## Features

- **Real-time Book Search**: Search books from the Open Library API
- **Autocomplete Suggestions**: Get suggestions as you type in the search bar
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Graceful handling of empty inputs, network errors, and no results
- **Loading States**: Visual feedback during API requests
- **SEO Optimized**: Server-side rendering for main pages with proper meta tags

## Tech Stack

### Frontend
- **Next.js 14**: React framework with server-side rendering
- **React**: Functional components with hooks
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **Axios**: HTTP client for API requests

## Project Structure

```
book-finder/
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   └── styles/          # CSS styles
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
└── backend/                 # Express backend
    ├── server.js            # Main server file
    └── package.json         # Backend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:3000

## API Endpoints

### Backend API
- `GET /api/books?title={bookTitle}`: Search books by title
- `GET /api/autocomplete?query={searchQuery}`: Get autocomplete suggestions

### External API
- Open Library API: `https://openlibrary.org/search.json?title={bookTitle}`

## Future Enhancements

- User authentication
- Save favorite books to MongoDB
- Advanced search filters (author, genre, year)
- Book details page with more information
- Dark mode toggle

## License

MIT
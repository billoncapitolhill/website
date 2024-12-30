# Bill on Capitol Hill

A modern web application for tracking and analyzing bills in Congress with AI-powered insights.

## Features

- View recent bills and amendments with AI-generated summaries
- Detailed bill information including latest actions and constitutional authority
- Amendment tracking and analysis
- Sentiment analysis for bills and amendments
- Modern, responsive UI built with React and Chakra UI

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite for build tooling
  - Chakra UI for components
  - React Query for data fetching
  - React Router for navigation
  - Axios for API requests

- Backend:
  - FastAPI (Python)
  - AI-powered analysis
  - Congress.gov API integration

- Deployment:
  - Frontend: Netlify
  - Backend: DigitalOcean
  - Database: Supabase

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bill-on-capitol-hill.git
   cd bill-on-capitol-hill
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## API Documentation

The application uses a RESTful API with the following endpoints:

### Bills

- `GET /bills/{congress}/{bill_type}/{bill_number}` - Get bill details
- `GET /amendments/{congress}/{amendment_type}/{amendment_number}` - Get amendment details
- `GET /summaries/recent` - Get recent AI-generated summaries
- `GET /status/errors` - Get processing errors

For detailed API documentation, see the [API Guide](API_GUIDE.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

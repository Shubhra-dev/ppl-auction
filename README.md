# PPL Auction Platform

A modern web application for managing the Pakistan Premier League (PPL) player auctions. This platform allows users to browse players and teams while providing administrators with comprehensive tools to manage auction events, players, and bidding in real-time.

## Features

### Public Features

- **Player Browsing**: View all available players with detailed cards displaying stats and information
- **Advanced Search**: Search and filter players by name and other attributes
- **Pagination**: Efficient browsing with configurable page sizes
- **Team Overview**: Explore teams participating in the auction
- **Live Auction View**: Watch live auction events as they happen
- **Responsive Design**: Optimized for desktop and mobile devices

### Admin Features

- **Secure Authentication**: Admin login system with role-based access control
- **Player Management**: Add, edit, and manage player information
- **Team Management**: Create and manage teams for the auction
- **Auction Control**: orchestrate live auction events
- **Asset Management**: Upload player photos and team assets to cloud storage

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Backend/Database**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router DOM 7
- **Code Quality**: ESLint 9
- **Language**: JavaScript (ES Module)

## Project Structure

```
ppl-auction/
├── src/
│   ├── app/                    # App configuration
│   │   ├── auth.js            # Authentication logic
│   │   └── supabaseClient.js  # Supabase initialization
│   ├── components/            # Reusable React components
│   │   ├── GuardAdmin.jsx     # Authentication wrapper
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── PlayerCard.jsx     # Player display card
│   │   ├── PlayerRow.jsx      # Player table row
│   │   ├── TeamCard.jsx       # Team display card
│   │   └── Pagination.jsx     # Pagination controls
│   ├── pages/                 # Page components
│   │   ├── Home.jsx           # Player browsing and search
│   │   ├── Teams.jsx          # Teams overview
│   │   ├── Live.jsx           # Live auction view
│   │   ├── AdminLogin.jsx     # Admin authentication
│   │   ├── AdminDashboard.jsx # Main admin panel
│   │   ├── AdminPlayers.jsx   # Player management
│   │   └── AdminTeams.jsx     # Team management
│   ├── services/              # API and business logic
│   │   ├── players.js         # Player-related services
│   │   ├── teams.js           # Team-related services
│   │   └── pagedPlayers.js    # Pagination logic
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   ├── App.css                # Global styles
│   └── index.css              # Base styles
├── public/                    # Static assets
├── package.json               # Project dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── eslint.config.js           # ESLint rules
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ppl-auction
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server with hot module reloading
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Pages Overview

### Public Pages

- **Home (/)** - Main dashboard with player search, filtering, and pagination
- **Teams (/teams)** - Display all teams participating in the auction
- **Live (/live)** - Real-time auction view with live updates

### Admin Pages

- **Admin Login (/admin/login)** - Secure authentication for administrators
- **Admin Dashboard (/admin)** - Overview and controls for the auction
- **Admin Players** - Manage player database (add, edit, delete)
- **Admin Teams** - Manage team information and rosters

## Admin Access

To access the admin panel:

1. Navigate to `/admin/login`
2. Enter admin credentials
3. Successful authentication redirects to `/admin`
4. The `GuardAdmin` component protects admin routes from unauthorized access

## Database Schema (Supabase)

The application uses Supabase PostgreSQL with the following main tables:

- **players** - Player information, stats, and metadata
- **teams** - Team details and information
- **auctions** - Auction event records
- **bids** - Bidding history and records

## Asset Storage

Player photos and team assets are stored in Supabase Storage under the `ppl-assets` bucket with organized folder structure.

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting

The production-ready files are in the `dist` folder. Deploy to your preferred platform (Vercel, Netlify, GitHub Pages, etc.)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Vite's lightning-fast build and HMR
- Optimized pagination for large player datasets
- Tailwind CSS for minimal CSS bundle size
- SWC for fast JavaScript transformation

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Code Quality

- ESLint is configured for code consistency
- Run `npm run lint` before committing
- Follow React best practices and hooks guidelines

## License

This project is proprietary and intended for PPL (Pakistan Premier League) auction management.

## Support

For issues, feature requests, or questions, please contact the development team.

---

**Last Updated**: February 2026
**Version**: 1.0.0

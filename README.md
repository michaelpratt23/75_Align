# 75 Align

A full-stack web application to help users stay on track with their 75-day wellness challenge, inspired by 75 Hard.

## Features

- **Authentication**: Secure email/password authentication with JWT
- **Onboarding Flow**: Customizable pledges across 4 categories (Activity, Nutrition, Mind, Growth)
- **Daily Tracking**: Interactive checklist to track daily progress
- **Inspirational Quotes**: Daily motivational quotes via external API
- **Progress Tracking**: Day counter and completion status
- **Responsive Design**: Mobile-first design with minimalist Japanese aesthetic

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS with custom Japanese-inspired design
- **External API**: ZenQuotes.io for daily inspirational quotes

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 75-align
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/align75"
   JWT_SECRET="your-jwt-secret-here"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:

- **User**: Stores user information and authentication data
- **Pledge**: Stores user's customized pledges with categories and types
- **DailyProgress**: Tracks daily completion status
- **UserProfile**: Stores onboarding completion and start date

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/onboarding` - Complete onboarding
- `GET /api/pledges` - Get user pledges
- `POST /api/daily-progress` - Update daily progress
- `GET /api/quotes` - Get daily inspirational quote

## Features in Detail

### Onboarding Flow
- 4-step process covering Activity, Nutrition, Mind, and Growth categories
- Pre-populated default pledges that users can customize
- Final commitment step with personalized pledge statement

### Daily Tracking
- Clean checklist interface for daily pledges
- Automatic reset at midnight
- Progress persistence across sessions

### Design Philosophy
- Minimalist Japanese-inspired design (Muji/Zen aesthetic)
- Extensive use of whitespace
- Mobile-first responsive design
- Clean typography and subtle interactions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 
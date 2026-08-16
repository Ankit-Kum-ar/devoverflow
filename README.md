# DevOverflow

A modern, full-stack community-driven Q&A platform built with Next.js, inspired by Stack Overflow. DevOverflow enables users to ask questions, share answers, and collaborate with the developer community.

## 📋 Overview

DevOverflow is a comprehensive question-and-answer platform designed for developers. It provides a seamless experience for knowledge sharing, problem-solving, and community engagement. The application features a robust authentication system, intelligent search capabilities, and an AI-powered answer generation system.

## ✨ Key Features

- **Authentication System**
  - Multi-provider support (GitHub, Google, Email/Password)
  - Secure credential-based authentication with bcryptjs
  - NextAuth v5 integration for OAuth and session management

- **Questions & Answers**
  - Create, read, update, and delete questions
  - Post detailed answers with rich text editing
  - Track view counts, upvotes, and downvotes
  - Answer counter and engagement metrics

- **User Features**
  - Comprehensive user profiles with statistics
  - User collections for saving favorite questions
  - Follow community members
  - Track user interactions and activity

- **Search & Discovery**
  - Global search across questions, tags, and users
  - Local search within question lists
  - Advanced filtering options (newest, popular, unanswered)
  - Tag-based categorization and browsing

- **Community Features**
  - Browse active community members
  - Explore and manage tags
  - Job board for career opportunities
  - User reputation and achievement tracking

- **AI-Powered Features**
  - AI-generated answer suggestions using Google AI SDK
  - Intelligent content recommendations

- **User Experience**
  - Dark/Light theme support
  - Responsive mobile-first design
  - Real-time notifications via Sonner
  - Rich text editing with MDX support
  - Smooth animations and transitions

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.5 (App Router)
- **Language:** TypeScript
- **UI Components:** Radix UI + custom components
- **Styling:** TailwindCSS + Tailwind Merge
- **Form Management:** React Hook Form
- **Content Editor:** MDXEditor
- **Icons:** Lucide React
- **Theme Management:** next-themes

### Backend
- **Runtime:** Node.js
- **API Routes:** Next.js API Routes
- **Authentication:** NextAuth v5
- **Database:** MongoDB with Mongoose ODM
- **Password Encryption:** bcryptjs
- **Validation:** Zod

### AI & External Services
- **AI Provider:** Google AI SDK
- **AI Framework:** Vercel AI SDK

### Development Tools
- **Linting:** ESLint
- **Code Formatting:** Prettier
- **Logging:** Pino + Pino Pretty
- **Query String:** query-string

## 📁 Project Structure

```
devoverflow/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/                   # Main application routes
│   │   ├── page.tsx              # Home page with questions list
│   │   ├── ask-question/         # Question creation
│   │   ├── collections/          # Saved collections
│   │   ├── community/            # Community members
│   │   ├── jobs/                 # Job listings
│   │   ├── profile/              # User profiles
│   │   ├── questions/            # Question details and editing
│   │   └── tags/                 # Tag browsing
│   ├── api/                      # Backend API routes
│   │   ├── accounts/             # Account management
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── ai/                   # AI answer generation
│   │   └── users/                # User operations
│   ├── constants/                # App-wide constants
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # Reusable React components
│   ├── cards/                    # Card components
│   │   ├── AnswerCard.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── JobCard.tsx
│   │   ├── TagCard.tsx
│   │   └── UserCard.tsx
│   ├── forms/                    # Form components
│   │   ├── AuthForm.tsx          # Sign in/up form
│   │   ├── QuestionForm.tsx      # Question creation/editing
│   │   ├── AnswerForm.tsx        # Answer submission
│   │   ├── ProfileForm.tsx       # Profile editing
│   │   └── SocialAuthForm.tsx
│   ├── filters/                  # Filtering components
│   │   ├── CommonFilter.tsx
│   │   ├── HomeFilter.tsx
│   │   └── JobFilter.tsx
│   ├── search/                   # Search components
│   │   ├── GlobalSearch.tsx      # App-wide search
│   │   └── LocalSearch.tsx       # Page-level search
│   ├── navigation/               # Navigation components
│   │   ├── LeftSidebar.tsx
│   │   ├── RightSidebar.tsx
│   │   └── navbar/
│   ├── editor/                   # Rich text editor
│   │   └── index.tsx
│   ├── ui/                       # UI primitives
│   ├── user/                     # User-related components
│   └── votes/                    # Voting components
│
├── database/                     # Mongoose models & schemas
│   ├── user.model.ts             # User model
│   ├── question.model.ts         # Question model
│   ├── answer.model.ts           # Answer model
│   ├── tag.model.ts              # Tag model
│   ├── account.model.ts          # OAuth account model
│   ├── collection.model.ts       # User collections model
│   ├── vote.model.ts             # Voting model
│   ├── interaction.model.ts      # User interactions model
│   └── tag-question.model.ts     # Tag-question relationships
│
├── lib/                          # Utility functions & business logic
│   ├── actions/                  # Server actions
│   │   ├── question.action.ts
│   │   ├── answer.action.ts
│   │   ├── user.action.ts
│   │   ├── auth.action.ts
│   │   ├── tag.action.ts
│   │   └── ...
│   ├── handlers/                 # Event & error handlers
│   ├── api.ts                    # API client
│   ├── mongoose.ts               # Database connection
│   ├── logger.ts                 # Logging setup
│   ├── validations.ts            # Zod schemas
│   ├── utils.ts                  # Helper utilities
│   ├── url.ts                    # URL utilities
│   └── http-errors.ts            # Custom error classes
│
├── context/                      # React Context
│   └── Theme.tsx                 # Theme context
│
├── constants/                    # Application constants
│   ├── route.ts                  # Route definitions
│   ├── filters.ts                # Filter options
│   ├── states.ts                 # Default states
│   └── TechMap.ts                # Technology mapping
│
├── types/                        # TypeScript type definitions
│   ├── action.d.ts               # Action response types
│   └── global.d.ts               # Global types
│
├── public/                       # Static assets
│   ├── icons/
│   └── images/
│
├── docs/                         # Documentation
│   └── mermaids/                 # Architecture diagrams
│
├── auth.ts                       # NextAuth configuration
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
└── package.json                  # Project dependencies
```

## 🗄️ Database Schema

### Core Models

**User**
- User profile information
- Email and authentication details
- Reputation points and achievements
- Account creation timestamp

**Question**
- Title and detailed content
- Associated tags
- View count, upvotes, downvotes
- Answer count
- Author reference

**Answer**
- Answer content
- Associated question reference
- Author information
- Voting metrics

**Tag**
- Tag name and description
- Question associations
- Usage statistics

**Account**
- OAuth provider details
- External provider IDs
- User association

**Collection**
- User-saved question collections
- Collection metadata
- Question references

**Vote**
- Vote type (upvote/downvote)
- Related question/answer
- User information

**Interaction**
- User interaction tracking
- Question/answer interactions
- Action timestamps

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB instance (local or cloud)
- GitHub and Google OAuth applications (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devoverflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=<your-mongodb-connection-string>
   
   # NextAuth
   NEXTAUTH_SECRET=<your-secret-key>
   NEXTAUTH_URL=http://localhost:3000
   
   # OAuth Providers
   GITHUB_ID=<your-github-oauth-id>
   GITHUB_SECRET=<your-github-oauth-secret>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   
   # AI Services
   GOOGLE_GENERATIVE_AI_API_KEY=<your-google-ai-api-key>
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

## 🔐 Authentication Flow

DevOverflow supports multiple authentication methods:

1. **OAuth Authentication** (GitHub, Google)
   - Redirects to provider
   - Account linkage and creation
   - Session establishment

2. **Email/Password Authentication**
   - User registration with email verification
   - Secure password hashing with bcryptjs
   - Login with credentials

3. **Session Management**
   - NextAuth v5 handles session tokens
   - Secure cookie-based sessions
   - CSRF protection

## 🔍 Search & Filtering

- **Global Search:** Search across all questions, tags, and users
- **Local Search:** Search within current page results
- **Filters:**
  - Newest questions
  - Most popular questions
  - Unanswered questions
  - Most viewed questions
  - Trending questions

## 🤖 AI Features

The platform integrates Google's Generative AI to provide intelligent answer suggestions. Users can request AI-generated answers for their questions, which are processed through the `/api/ai/answers` endpoint.

## 🎨 Component Library

The application uses Radix UI primitives combined with custom styling for a consistent, accessible UI:

- Buttons
- Forms and inputs
- Dropdowns and menus
- Dialog boxes
- Tabs and navigation
- Alerts and notifications
- Avatars and badges

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly navigation
- Adaptive layouts

## 🌙 Theme Support

- Light and dark themes
- User preference persistence
- System preference detection
- Smooth theme transitions

## 🔗 API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/signin-with-oauth` - OAuth sign-in

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user details
- `POST /api/users/email` - Email operations

### Accounts
- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts/[id]` - Get account
- `GET /api/accounts/provider` - Provider lookup

### AI
- `POST /api/ai/answers` - Generate AI answer

## 📊 Performance

- **Turbopack:** Fast builds with Turbopack instead of webpack
- **Optimized Images:** Next.js image optimization
- **Code Splitting:** Automatic code splitting by routes
- **Caching:** Strategic caching with server components

## 🛡️ Security Features

- **Password Hashing:** bcryptjs for secure password storage
- **CSRF Protection:** Built-in with NextAuth
- **HTTPS:** Recommended for production
- **Environment Variables:** Sensitive data protected
- **Input Validation:** Zod schema validation
- **SQL/NoSQL Injection:** Protected by MongoDB and Mongoose

## 📝 Validation

The application uses Zod for runtime validation:
- Form input validation
- API request validation
- Type-safe schema definitions

## 📖 Development Workflow

1. Create feature branches for new features
2. Follow the existing component and file structure
3. Use TypeScript for type safety
4. Write reusable, modular components
5. Follow ESLint and Prettier configurations
6. Test thoroughly before submitting PR

## 🐛 Debugging

- Check `lib/logger.ts` for application logging
- Use `lib/http-errors.ts` for consistent error handling
- Leverage Next.js server component logging
- Monitor database connections in `lib/mongoose.ts`

## 🚢 Deployment

The application can be deployed on:
- **Vercel** (recommended for Next.js)
- **AWS (EC2, Lambda)**
- **GCP (Cloud Run, App Engine)**
- **Azure (App Service)**
- **Self-hosted servers**

### Pre-deployment Checklist
- Set production environment variables
- Run `npm run build` and verify no errors
- Test authentication flows
- Verify database connections
- Set up CDN for static assets
- Configure error tracking (Sentry, etc.)

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [NextAuth Documentation](https://next-auth.js.org)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For issues, questions, or suggestions, please open an issue on the repository or contact the development team.

---

**Built with ❤️ by the Ankit Kumar**

*Last Updated: 2026*

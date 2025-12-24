# AI Builder MVP

An AI-powered web application builder that generates complete, production-ready applications using Claude AI from Anthropic. Similar to v0 and Lovable, but with full transparency into the AI's thinking process.

## Features

- **AI-Powered Generation**: Generate complete web applications from natural language prompts
- **Real-time Streaming**: Watch the AI think and build your application in real-time
- **Live Preview**: See your generated application rendered instantly in a sandboxed preview
- **Conversation History**: Save and revisit previous generations with PostgreSQL
- **Code Export**: Download or copy generated code
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **State Management**: Zustand
- **Database**: PostgreSQL
- **AI**: Anthropic Claude API (Sonnet 4)
- **UI Components**: Custom components with Framer Motion animations
- **Notifications**: React Hot Toast

## Prerequisites

Before you begin, ensure you have:

- Node.js 20+ installed
- PostgreSQL database (local or hosted)
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

## Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd pbuilder
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Database (PostgreSQL)
POSTGRES_URL=postgresql://user:password@localhost:5432/pbuilder
POSTGRES_PRISMA_URL=postgresql://user:password@localhost:5432/pbuilder
POSTGRES_URL_NON_POOLING=postgresql://user:password@localhost:5432/pbuilder

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

4. **Initialize the database**

Run the schema SQL file to create the necessary tables:

```bash
# Using psql
psql -U your_username -d pbuilder -f lib/db/schema.sql

# Or connect to your database and run the schema manually
```

The schema will create:
- `users` table (with a mock user for development)
- `conversations` table
- `messages` table
- `artifacts` table
- Necessary indexes

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
pbuilder/
├── app/
│   ├── (main)/              # Main app layout and pages
│   ├── api/                 # API routes
│   │   ├── ai/              # AI generation endpoints
│   │   └── conversations/   # Conversation CRUD endpoints
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── layout/              # Layout components (Header, Sidebar, etc.)
│   ├── sidebar/             # Sidebar-specific components
│   ├── preview/             # Preview frame and toolbar
│   ├── conversations/       # Conversation list components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── ai/                  # Anthropic API integration
│   ├── db/                  # Database client and queries
│   └── preview/             # Preview utilities
├── store/                   # Zustand state management
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## Usage

### Generating an Application

1. Enter a description of what you want to build in the chat input
2. Watch the AI thinking process in real-time on the left sidebar
3. See your generated application appear in the preview area
4. Export or copy the code using the toolbar buttons

### Managing Conversations

1. Click the "Conversations" tab in the sidebar
2. Create new conversations with the "New Conversation" button
3. Click on any conversation to load its history
4. Delete conversations by hovering and clicking the trash icon

### Preview Modes

Use the toolbar buttons to preview your application in different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

## API Routes

### AI Generation

- `POST /api/ai/generate` - Stream AI generation
  - Body: `{ prompt: string, conversationId?: string }`
  - Returns: Server-Sent Events stream

### Conversations

- `GET /api/conversations` - List all conversations
- `POST /api/conversations` - Create new conversation
  - Body: `{ title: string }`
- `GET /api/conversations/[id]` - Get specific conversation
- `PATCH /api/conversations/[id]` - Update conversation
- `DELETE /api/conversations/[id]` - Delete conversation
- `GET /api/conversations/[id]/messages` - Get conversation messages

## Database Schema

### Users
Mock authentication - single user for MVP.

### Conversations
Stores chat sessions with titles and metadata.

### Messages
Stores both user prompts and AI responses with thinking steps (as JSONB) and generated code.

### Artifacts
Stores complete generated code with language/framework detection and dependencies.

## Development Notes

### Mock Authentication
The current implementation uses a mock user (ID: `00000000-0000-0000-0000-000000000001`). All users interact with the same account. To implement real authentication, integrate NextAuth.js or a similar solution.

### Credits System
The credits display is visual-only and not enforced. To implement real credit tracking, add logic to decrement credits on generation and block requests when credits are depleted.

### AI Prompt Engineering
The system prompt in `lib/ai/prompts.ts` instructs Claude to format responses with specific sections (Thinking, Design, Code). Modify this prompt to change the AI's behavior.

### Code Sandboxing
Generated code runs in an iframe with `sandbox="allow-scripts allow-same-origin"` for security. This prevents malicious code from affecting the parent application.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Database Setup for Production

Use a hosted PostgreSQL service:
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

Update your `.env.local` (or Vercel environment variables) with the production database URL.

## Troubleshooting

### Database Connection Issues

- Verify your `POSTGRES_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings if using remote database

### AI Generation Not Working

- Verify `ANTHROPIC_API_KEY` is set correctly
- Check API key has sufficient credits
- Review browser console for errors

### Preview Not Rendering

- Check if generated code is valid HTML
- Open browser console for iframe errors
- Verify Tailwind CDN is loading

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Acknowledgments

- Design inspired by v0.dev and Lovable
- Powered by Anthropic Claude
- Built with Next.js and Tailwind CSS

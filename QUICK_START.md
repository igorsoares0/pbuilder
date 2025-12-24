# Quick Start Guide - AI Builder MVP

## What's Been Built

Congratulations! Your AI Builder MVP is complete with all core features:

✅ **AI Integration** - Anthropic Claude API with streaming responses
✅ **Real-time UI** - Watch AI thinking process as it generates
✅ **Live Preview** - Sandboxed iframe rendering of generated code
✅ **Database** - PostgreSQL for conversation history
✅ **State Management** - Zustand stores for global state
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Code Export** - Download or copy generated code
✅ **Conversation History** - Save and load previous chats

## Next Steps to Run

### 1. Set Up Environment Variables

Create a `.env.local` file (use `.env.local.example` as template):

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add:
- Your Anthropic API key
- Your PostgreSQL connection URL

### 2. Initialize Database

Run the SQL schema to create tables:

```bash
psql -U postgres -d pbuilder -f lib/db/schema.sql
```

Or use your preferred PostgreSQL client to run `lib/db/schema.sql`.

### 3. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and start building!

## How to Use

1. **Enter a prompt** in the chat input at the bottom of the sidebar
   - Example: "Create a landing page for a SaaS product with pricing cards"

2. **Watch the AI think** in the sidebar as it generates your app

3. **See the preview** render in real-time on the right side

4. **Export your code** using the toolbar buttons

5. **Save conversations** by clicking the "Conversations" tab

## What to Build On

### Immediate Improvements

1. **Better Error Handling**
   - Add retry logic for failed API calls
   - Show user-friendly error messages
   - Handle database connection errors gracefully

2. **Real Authentication**
   - Integrate NextAuth.js or Clerk
   - Create proper user sessions
   - Per-user conversation isolation

3. **Credits System**
   - Track actual API usage
   - Implement credit deduction logic
   - Add payment integration (Stripe)

4. **Enhanced Preview**
   - Support for React components
   - Multi-file projects
   - Package installation preview

### Advanced Features

5. **Conversation Context**
   - Load and continue previous conversations
   - Edit previous messages
   - Branch conversations

6. **Template Library**
   - Pre-made prompts for common apps
   - Save custom templates
   - Share templates with others

7. **Code Editor**
   - Edit generated code inline
   - Syntax highlighting
   - Real-time preview updates

8. **Collaboration**
   - Share generated apps
   - Public gallery
   - Comments and ratings

9. **Export Formats**
   - ZIP with full project structure
   - Deploy to Vercel/Netlify directly
   - GitHub repository creation

10. **AI Improvements**
    - Multi-turn conversations with context
    - Ability to refine and iterate
    - Different AI models (GPT, etc.)

## Architecture Highlights

### State Flow
```
User Input → Zustand Store → API Route → Anthropic → SSE Stream → UI Update
```

### Component Hierarchy
```
App Layout
├── Header (fixed top)
├── Sidebar (fixed left, 300px)
│   ├── Tab Selector (Thinking/Conversations)
│   ├── Content Area (scrollable)
│   ├── Chat Input (fixed bottom)
│   └── User Info (fixed bottom)
└── Main Content (flexible)
    ├── Preview Toolbar
    └── Preview Frame (sandboxed iframe)
```

### Database Schema
```
users → conversations → messages → artifacts
              ↓
         (JSONB thinking_steps)
```

## Common Issues & Solutions

### "Database connection failed"
- Check `POSTGRES_URL` in `.env.local`
- Ensure PostgreSQL is running
- Verify database exists

### "Anthropic API error"
- Check `ANTHROPIC_API_KEY` is valid
- Verify you have API credits
- Check rate limits

### "Preview not rendering"
- Check browser console for errors
- Verify generated code is valid HTML
- Try refreshing the preview

## Testing Your Build

### Test Cases to Try

1. **Simple HTML Page**
   ```
   "Create a simple landing page with a hero section and contact form"
   ```

2. **Interactive App**
   ```
   "Build a todo list app with add, complete, and delete functionality"
   ```

3. **Complex Layout**
   ```
   "Create a dashboard with sidebar navigation and data cards"
   ```

## Performance Tips

- Enable Next.js Edge Runtime for API routes (faster response)
- Implement request caching for repeated prompts
- Add rate limiting to prevent abuse
- Optimize database queries with proper indexes (already done)

## Security Checklist

- [x] Iframe sandboxing enabled
- [x] Environment variables not exposed to client
- [ ] Add rate limiting (implement this)
- [ ] Add CSRF protection (implement this)
- [ ] Validate all user inputs (partially done)
- [ ] Implement proper authentication (not MVP)

## Deployment Checklist

Before deploying to production:

- [ ] Set up production PostgreSQL database
- [ ] Configure environment variables in hosting platform
- [ ] Test all features in production environment
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Add analytics (PostHog, Plausible, etc.)
- [ ] Configure custom domain
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring and alerts

## Resources

- [Anthropic API Docs](https://docs.anthropic.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the code comments in critical files
3. Check browser console for error messages
4. Review API responses in Network tab

---

**Built with ❤️ using Next.js, React, Anthropic Claude, and PostgreSQL**

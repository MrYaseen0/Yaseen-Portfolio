# Yaseen Ahmad — Portfolio Website

> Full-Stack Developer | Building production-grade SaaS applications with MERN Stack

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Express.js 5 + Node.js |
| Database | MongoDB (Atlas + Compass) |
| Auth | JWT + HTTP-only Cookies + Refresh Tokens |
| Animations | Framer Motion |
| Icons | Lucide React + Custom SVG |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example server/.env
# Edit server/.env with your MongoDB URI and secrets

# Start development
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Environment Variables

See `.env.example` for required variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `CLIENT_URL` | Frontend URL (e.g., `http://localhost:5173`) |
| `ADMIN_EMAIL` | Initial admin email |
| `ADMIN_PASSWORD` | Initial admin password |

## Security Features

- HTTP-only cookies for JWT tokens
- Refresh token rotation
- Rate limiting on all API endpoints
- Input validation with express-validator
- Helmet security headers
- Account lockout after 5 failed attempts
- Activity logging and session management
- CSRF protection via SameSite cookies

## Admin Dashboard

Access at `http://localhost:5173/admin`:

- **Messages** — Contact form submissions
- **Hire Requests** — Client inquiries with status tracking
- **Visitors** — Recent visitor analytics
- **Security** — Active sessions, activity logs, password change

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create admin account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/auth/me` | Yes | Verify token |
| GET | `/api/auth/sessions` | Yes | List active sessions |
| GET | `/api/auth/activity` | Yes | Activity log |
| POST | `/api/auth/change-password` | Yes | Change password |
| POST | `/api/contact` | No | Submit contact form |
| POST | `/api/hire` | No | Submit hire request |
| GET | `/api/admin/dashboard` | Admin | Dashboard data |
| GET | `/api/admin/security` | Admin | Security overview |
| GET | `/api/github/repos` | No | GitHub repositories |
| GET | `/api/github/stats` | No | GitHub statistics |

## Production Build

```bash
npm run build
npm run start
```

## License

MIT

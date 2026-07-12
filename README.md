# 🏠 StayNest — Rental Property Platform

A modern, full-stack rental property marketplace built with **Next.js 16**, **Better Auth**, and **MongoDB**. StayNest connects property owners with potential renters through an intuitive, feature-rich platform.

---

## ✨ Features

### 🔐 Authentication
- Email/password authentication with Better Auth
- Google OAuth 2.0 social login
- Secure session management with cookies
- Protected routes and role-based access
- Demo account for quick testing

### 🏘️ Property Management
- **CRUD Operations** — Create, read, update, and delete property listings
- **Rich Property Data** — Title, description, price, location, amenities, images, availability status
- **Smart Filtering** — Search by city, property type, price range, bedrooms, and more
- **Pagination** — Efficient browsing with server-side pagination
- **Property Status** — Available, Rented, or Pending
- **Featured Listings** — Highlight premium properties

### 👤 User Dashboard
- Property overview with key metrics
- Analytics: income vs. expenses charts, property type distribution
- Performance metrics: monthly rent value, active listings, views, ratings
- Quick actions: add, edit, or delete properties from the dashboard

### ⭐ Review System
- Star ratings (1–5) with detailed comments
- Review aggregation and distribution charts
- Authenticated users only
- Real-time updates

### 🎨 UI/UX
- Responsive, mobile-first design with Tailwind CSS
- Shadcn/ui-inspired components
- Interactive elements: modal dialogs, dropdowns, toast notifications
- Skeleton loading states for better UX
- Dark/light mode (via `next-themes`)

### 🔌 Technical Features
- Secure API proxy with session token forwarding
- End-to-end TypeScript type safety
- MongoDB database with Better Auth adapter
- Feature-based file structure
- Server Components, lazy loading, and image optimization

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework with App Router |
| React 19 | UI library |
| Tailwind CSS 4 | Utility-first styling |
| Lucide React | Icon library |
| Recharts | Data visualization charts |
| React Hot Toast | Toast notifications |
| Better Auth Client | Authentication client |

### Backend
| Technology | Purpose |
|---|---|
| Better Auth | Authentication server |
| MongoDB | Database |
| MongoDB Adapter | Database adapter for Better Auth |
| Next.js API Routes | Backend proxy endpoints |

### Development
| Tool | Purpose |
|---|---|
| TypeScript | Static type checking |
| ESLint | Code linting |
| Next.js Dev Server | Local development |

---

## 📦 Installation & Setup

### 1. Prerequisites
- Node.js (v20 or higher)
- MongoDB instance (local or cloud)
- Google OAuth credentials (optional)

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/staynest.git
cd staynest
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/staynest

# Backend API (if different from Next.js)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Security
BETTER_AUTH_SECRET=your_secret_key_here
```

### 4. Database Setup
Make sure MongoDB is running:

```bash
# Local MongoDB
mongod --dbpath /path/to/data

# Or use MongoDB Atlas for cloud deployment
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
staynest/
├── src/
│   ├── app/
│   │   ├── about/page.tsx
│   │   ├── add-property/page.tsx
│   │   ├── auth/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── explore/page.tsx
│   │   ├── manage/page.tsx
│   │   ├── manage/edit/[id]/page.tsx
│   │   ├── property/[id]/page.tsx
│   │   └── api/
│   │       ├── auth/[...all]/route.ts
│   │       └── backend/[...path]/route.ts
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── Badge.tsx
│   │   ├── Footer.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── SkeletonCard.tsx
│   │   └── Stars.tsx
│   ├── context/
│   │   └── PropertyContext.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth-client.ts
│   │   └── auth.ts
│   └── types/
│       └── index.ts
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔧 Core Functionality

### Authentication Flow
1. **Sign Up** — User registers with email/password or Google
2. **Session Management** — JWT stored in HTTP-only cookies
3. **Protected Routes** — Middleware checks authentication status
4. **Sign Out** — Clears session and redirects

### Property CRUD

**Create** — `POST /api/backend/properties`
```typescript
const property = await createProperty({
  title: "Spacious Apartment",
  rent: 2500,
  city: "San Francisco",
  // ...
});
```

**Read** — `GET /api/backend/properties`
```typescript
const properties = await fetchProperties({
  city: "SF",
  minPrice: 1000,
  maxPrice: 5000,
  beds: 2,
});
```

**Update** — `PUT /api/backend/properties/:id`
```typescript
const updated = await updateProperty(id, {
  rent: 2600,
  status: "rented",
});
```

**Delete** — `DELETE /api/backend/properties/:id`
```typescript
await deleteProperty(id);
```

### Review System
```typescript
const review = await createReview({
  propertyId: id,
  rating: 5,
  comment: "Amazing place!",
  userName: "John Doe",
});
```

---

## 🔒 Security Considerations
- **HTTP-only Cookies** — Session tokens are not accessible via JavaScript
- **CORS** — Proper origin validation in production
- **Ownership Checks** — Users can only modify their own properties
- **Input Validation** — Server-side validation for all form submissions
- **Environment Variables** — Sensitive data stored in `.env.local`

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing
```bash
# Run tests (if configured)
npm test

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript for all new files
- Follow ESLint rules
- Write meaningful component and function names
- Add comments for complex logic
- Keep components focused and reusable

---

## 📄 License
This project is licensed under the MIT License — see the `LICENSE` file for details.

---

## 🙏 Acknowledgments
- [Better Auth](https://www.better-auth.com/) for authentication
- [MongoDB](https://www.mongodb.com/) for database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Unsplash](https://unsplash.com/) for placeholder images
- [Lucide Icons](https://lucide.dev/) for beautiful icons

---

## 📞 Support
- **Email:** support@staynest.com
- **Documentation:** docs.staynest.com
- **GitHub Issues:** github.com/yourusername/staynest/issues

---

## 🗺️ Roadmap
- [x] Authentication with Google OAuth
- [x] Property CRUD operations
- [x] Review system
- [ ] Admin dashboard
- [ ] Advanced search & filtering
- [ ] Booking system
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] AI-powered property recommendations

---

## 🎯 Demo Credentials

**Demo User:**
- Email: `alex@example.com`
- Password: `demo12345`

Click **"Login as Demo User"** on the auth page to try the platform instantly.

---

<p align="center">Made with ❤️ by the StayNest Team</p>
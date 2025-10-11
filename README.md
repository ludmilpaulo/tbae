# TBAE - Team Building Activities & Events

A full-stack web application for managing team building activities, venue bookings, gallery events, and newsletter campaigns.

## Tech Stack

### Backend
- **Django 5.2.3** - Web framework
- **Django REST Framework 3.16.0** - API framework
- **SQLite** (Development) / **MySQL** (Production)
- **Celery 5.5.3** - Task queue for background jobs
- **Redis 6.4.0** - Message broker
- **Python 3.13+**

### Frontend
- **Next.js 15.5.4** - React framework
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Redux Toolkit 2.8.2** - State management
- **TipTap 3.5.1** - Rich text editor

## Project Structure

```
tbae/
├── backend/              # Django backend
│   ├── activities/       # Activities & brochures management
│   ├── bookings/         # Venue booking system
│   ├── careers/          # Job applications
│   ├── core/            # About, clients, contact, FAQ
│   ├── gallery/         # Photo & video gallery
│   ├── newsletter/      # Email campaigns & subscribers
│   ├── quotes/          # Quote requests
│   ├── tracking/        # Analytics tracking
│   ├── venues/          # Venue management
│   └── ingest/          # Data import utilities
│
└── frontend/            # Next.js frontend
    ├── src/
    │   ├── app/         # Next.js pages
    │   ├── components/  # React components
    │   ├── lib/         # API utilities
    │   ├── redux/       # State management
    │   └── types/       # TypeScript types
    └── public/          # Static assets
```

## Getting Started

### Prerequisites

- Python 3.13+
- Node.js 20+
- Redis (optional, for Celery)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`
   Django Admin: `http://localhost:8000/admin/`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at: `http://localhost:3000`

## API Endpoints

### Activities
- `GET /activities/categories/` - List activity categories
- `GET /activities/activities/` - List activities
- `GET /activities/brochures/` - List brochures
- `GET /activities/brochure/latest/` - Get latest brochure

### Venues
- `GET /venues/provinces/` - List provinces
- `GET /venues/towns/` - List towns
- `GET /venues/venues/` - List venues
- `GET /venues/venueimages/` - List venue images

### Bookings
- `POST /bookings/create/` - Create booking
- `GET /bookings/bookings/` - List bookings (admin)
- `PUT /bookings/bookings/{id}/` - Update booking
- `DELETE /bookings/bookings/{id}/` - Delete booking

### Newsletter
- `GET /n/lists/` - List mailing lists
- `GET /n/subscribers/` - List subscribers
- `POST /n/subscribers/` - Add subscriber
- `GET /n/templates/` - List email templates
- `POST /n/templates/` - Create template
- `GET /n/campaigns/` - List campaigns
- `POST /n/campaigns/` - Create campaign
- `POST /n/campaigns/{id}/send/` - Send campaign

### Core
- `GET /api/about/` - About information
- `GET /api/clients/` - Client list
- `GET /api/faq/` - FAQ items
- `POST /api/contact/` - Contact form submission

## Admin Panel

The application includes a powerful admin panel at `/admin` with full CRUD operations for:

- **Activities**: Categories, activities, brochures
- **Venues**: Provinces, towns, venues, venue images
- **Bookings**: View and manage all bookings
- **Newsletter**: Lists, subscribers, templates, campaigns
- **Gallery**: Events, photos, videos
- **Core**: Clients, team members, FAQs

Access the Next.js admin: `http://localhost:3000/admin`
Access Django admin: `http://localhost:8000/admin/`

## Newsletter System

The newsletter system includes:

1. **Subscriber Management**: Import CSV, manage lists
2. **Email Templates**: Rich text editor with merge tags
3. **Campaigns**: Send to all subscribers or selected recipients
4. **Tracking**: Open rates, click tracking, unsubscribe links
5. **Background Processing**: Celery integration for bulk sending

### Compose Newsletter

Visit: `http://localhost:3000/newsletter`

Features:
- Rich text WYSIWYG editor
- Live HTML preview
- Select specific recipients or send to all
- Automatic unsubscribe link injection
- Email sanitization and CSS inlining

## Environment Variables

### Backend (.env)

Create a `.env` file in the backend directory (optional for development):

```env
DJANGO_ENV=development
SECRET_KEY=your-secret-key-here
DEBUG=True

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=465
EMAIL_HOST_USER=support@example.com
EMAIL_HOST_PASSWORD=your-password
EMAIL_USE_SSL=True
DEFAULT_FROM_EMAIL=support@example.com

# Production Database (MySQL)
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=3306
```

### Frontend

The frontend automatically detects environment:
- Development: `http://localhost:8000`
- Production: `https://africarise.pythonanywhere.com`

## Features

### ✅ Activity Management
- Browse activities by category
- Filter by premium status
- View activity details
- Download brochures

### ✅ Venue Booking System
- Search venues by province/town
- View venue images and details
- Real-time price calculation
- Email confirmation

### ✅ Gallery
- Photo galleries by event
- Video integration (YouTube)
- Filter by event type and year
- Tags for organization

### ✅ Newsletter Platform
- CSV import for subscribers
- Rich text email composer
- Campaign management
- Delivery tracking
- Unsubscribe handling

### ✅ Admin Dashboard
- Full CRUD operations
- File uploads (images, PDFs)
- Data tables with search
- Responsive design

## Development

### Running Tests

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

### Database Management

```bash
# Create new migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Load fixtures
python manage.py loaddata activities.json
python manage.py loaddata venues.json
```

### Celery (Background Tasks)

Start Redis:
```bash
redis-server
```

Start Celery worker:
```bash
cd backend
celery -A backend worker -l info
```

## Production Deployment

### Backend (PythonAnywhere/Cloud)

1. Set environment variables for production
2. Configure MySQL database
3. Set `DEBUG=False`
4. Configure static/media file serving
5. Run migrations
6. Collect static files: `python manage.py collectstatic`

### Frontend (Vercel/Netlify)

1. Build: `npm run build`
2. Update API base URL in environment
3. Deploy built files

## API Documentation

Full API documentation available at:
- Swagger UI: `http://localhost:8000/swagger/` (if configured)
- Django REST Framework: `http://localhost:8000/api/`

## Support

For issues or questions:
- Email: support@tbae.co.za
- GitHub Issues: [Create an issue](https://github.com/yourusername/tbae/issues)

## License

© 2025 TBAE Team Building. All rights reserved.


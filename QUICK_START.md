# Quick Start Guide - TBAE Application

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Start the Backend (Terminal 1)

```bash
cd backend
..\venv\Scripts\activate    # Windows
# source ../venv/bin/activate  # Mac/Linux
python manage.py runserver
```

✅ Backend will run at: **http://localhost:8000**

### Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

✅ Frontend will run at: **http://localhost:3000**

---

## 📍 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend Home** | http://localhost:3000 | Main website |
| **Admin Panel** | http://localhost:3000/admin | Full CRUD interface |
| **Newsletter** | http://localhost:3000/newsletter | Email composer |
| **Django Admin** | http://localhost:8000/admin/ | Backend admin |
| **API Root** | http://localhost:8000/ | REST API |

---

## 🎯 Quick Test Checklist

### Test Admin CRUD Operations

1. **Open Admin Panel**: http://localhost:3000/admin

2. **Test Activities**:
   - Click "Activity Categories"
   - Click "New" → Add a category → Click "Save"
   - Click "Edit" on the new category → Modify → Save
   - Click "Delete" → Confirm

3. **Test Venues**:
   - Click "Provinces"
   - Click "New" → Add "Western Cape" → Save
   - Click "Towns" → New → Add "Cape Town" with Province ID 1 → Save
   - Click "Venues" → New → Add a venue with province_id and town_id

4. **Test Newsletter**:
   - Click "Lists" → New → Create "Test List"
   - Click "Subscribers" → New → Add test@example.com
   - Visit: http://localhost:3000/newsletter
   - Select your list, compose email, send

### Test Django Admin

1. **Create Superuser** (if not done):
   ```bash
   cd backend
   python manage.py createsuperuser
   ```

2. **Login**: http://localhost:8000/admin/
   - Add activities, venues, bookings through Django interface

---

## 🔧 Common Issues

### Issue: Backend won't start
**Solution:**
```bash
cd backend
..\venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

### Issue: Frontend won't start
**Solution:**
```bash
cd frontend
npm install
npm run dev
```

### Issue: CORS errors
**Check:** Backend is running on port 8000, frontend on port 3000

### Issue: 404 on API calls
**Check:** Correct URL format in browser network tab
- Activities: http://localhost:8000/activities/activities/
- Venues: http://localhost:8000/venues/venues/
- Newsletter: http://localhost:8000/n/lists/

---

## 📊 API Testing with cURL

### Test GET endpoint:
```bash
curl http://localhost:8000/activities/activities/
```

### Test POST (Create Activity Category):
```bash
curl -X POST http://localhost:8000/activities/categories/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Outdoor Activities", "order": 1}'
```

### Test PUT (Update):
```bash
curl -X PUT http://localhost:8000/activities/categories/1/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "order": 2}'
```

### Test DELETE:
```bash
curl -X DELETE http://localhost:8000/activities/categories/1/
```

---

## 🎨 Admin Panel Features

### Available Resources:

**Activities Group:**
- Activity Categories - Manage categories
- Activities - Full activity management
- Brochures - PDF brochure uploads

**Venues Group:**
- Provinces - South African provinces
- Towns - Cities within provinces
- Venues - Event venues with pricing
- Venue Images - Photo galleries for venues

**Bookings Group:**
- Bookings - View and manage all bookings

**Newsletter Group:**
- Lists - Mailing list management
- Subscribers - Contact database
- Templates - Email templates
- Campaigns - Email campaigns

### CRUD Operations:
- **Create**: Click "New" button
- **Read**: View table of all records
- **Update**: Click "Edit" on any row
- **Delete**: Click "Delete" on any row

---

## 📧 Newsletter System

### Compose & Send Email:

1. Visit: http://localhost:3000/newsletter
2. Select a mailing list
3. Set "From email" (e.g., news@tbae.co.za)
4. Set subject line
5. Compose email in rich text editor
6. **Important**: Include `{{unsubscribe_url}}` in footer
7. Choose:
   - **Send to all**: Sends to all confirmed subscribers
   - **Send to selected**: Pick specific recipients
8. Click "Send"

### Features:
- ✅ Rich text WYSIWYG editor
- ✅ Live HTML preview
- ✅ Image uploads
- ✅ Link insertion
- ✅ Text formatting (bold, italic, headings, lists)
- ✅ Recipient selection
- ✅ Real-time preview

---

## 💾 Database

**Development**: SQLite (db.sqlite3)
- Located in `backend/db.sqlite3`
- Automatically created on first run
- No setup required

**Production**: MySQL
- Configured in settings for production environment
- Automatically switches based on DEBUG setting

---

## 🎯 Next Steps

1. **Add Sample Data**:
   ```bash
   cd backend
   python manage.py loaddata activities.json
   python manage.py loaddata venues.json
   ```

2. **Explore API**:
   - Visit http://localhost:8000 in browser
   - Browse available endpoints
   - Test with Postman or cURL

3. **Customize**:
   - Edit frontend components in `frontend/src/components/`
   - Modify backend models in `backend/*/models.py`
   - Update API endpoints in `backend/*/views.py`

4. **Deploy**:
   - Frontend: Deploy to Vercel/Netlify
   - Backend: Deploy to PythonAnywhere/AWS/Heroku

---

## 🆘 Need Help?

- Check `README.md` for full documentation
- Check `FIXES_APPLIED.md` for technical details
- Review Django REST Framework docs: https://www.django-rest-framework.org/
- Review Next.js docs: https://nextjs.org/docs

---

## ✅ Application Status

🟢 **Backend**: Fully operational with all CRUD endpoints
🟢 **Frontend**: Admin panel and newsletter fully functional
🟢 **Database**: Migrations applied, ready to use
🟢 **API Integration**: All endpoints tested and working
🟢 **File Uploads**: Image and PDF uploads functional
🟢 **Newsletter**: Email composition and sending operational

**Ready for development and testing!** 🎉


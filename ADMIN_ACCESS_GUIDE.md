# Admin Access Guide - Hood Eatery

## How to Access Admin Dashboard

The admin dashboard is **NOT visible in the navbar** to keep it secure and hidden from regular users.

### Method 1: Direct URL Access (Recommended)

After logging in as admin, go directly to:

```
http://localhost:5173/admin
```

**Bookmark this URL** for easy access!

### Method 2: Login and Navigate

1. Go to: `http://localhost:5173/login`
2. Login with admin credentials:
   - **Email:** `admin@hoodeatery.com`
   - **Password:** `admin123`
3. After login, manually type in browser: `http://localhost:5173/admin`

## Admin Pages Available

Once logged in as admin, you can access:

### 1. Admin Dashboard
**URL:** `http://localhost:5173/admin`
- Overview of all orders
- Quick stats
- Recent activity

### 2. Menu Management (Upload Food Images Here!)
**URL:** `http://localhost:5173/admin/menu`
- ✅ **Add new food items with images**
- ✅ Edit existing items
- ✅ Delete items
- ✅ Set availability
- ✅ Mark as featured

### 3. Order Management
**URL:** `http://localhost:5173/admin/orders`
- View all orders
- Update order status
- Real-time order tracking

## How to Upload Food Images

### Step-by-Step Guide:

1. **Access Menu Management Page:**
   ```
   http://localhost:5173/admin/menu
   ```

2. **Click "Add New Item" Button**
   - You'll see a modal/popup form

3. **Fill in the Form:**
   - **Category**: Select from dropdown (Appetizers, Main Course, Desserts, Beverages)
   - **Name**: Name of the food/drink (e.g., "Chicken Burger")
   - **Description**: Brief description (e.g., "Juicy grilled chicken with fresh veggies")
   - **Price**: Enter price (e.g., 12.99)
   - **Image**: **Click "Choose File" and select your food image**
   - **Available for order**: Check this box
   - **Featured item**: Check if you want it on homepage

4. **Click "Add Item"**
   - Your food item will be saved
   - Image will be uploaded to the server
   - Item will appear on customer menu immediately

### Supported Image Formats:
- JPG/JPEG
- PNG
- GIF

### Image Upload Location:
Images are stored in: `Hood Eatery Backend/uploads/menu/`

## Editing Existing Items

1. Go to: `http://localhost:5173/admin/menu`
2. Find the item you want to edit
3. Click the **"Edit"** button
4. Update any fields (including uploading a new image)
5. Click **"Update Item"**

## Deleting Items

1. Go to: `http://localhost:5173/admin/menu`
2. Find the item you want to delete
3. Click the **"Delete"** button
4. Confirm deletion

## Important Security Notes

### ✅ Admin Protection:
- Only users with `role: 'admin'` can access admin pages
- Regular users who try to access `/admin` are redirected to home
- Admin dashboard link is NOT in the navbar (hidden from public view)

### 🔐 Access Control:
- Admin pages are protected by `PrivateRoute` with `adminOnly` flag
- JWT token authentication required
- Role validation on both frontend and backend

## Troubleshooting

### "I don't see the Add New Item button"
- Make sure you're logged in as admin
- Check the URL is exactly: `http://localhost:5173/admin/menu`
- Clear browser cache and refresh

### "Image upload not working"
- Check the backend server is running: `npm run dev` in Backend folder
- Verify uploads folder exists: `Hood Eatery Backend/uploads/menu/`
- Check image file size (should be < 5MB)
- Make sure image format is JPG, PNG, or GIF

### "Can't access admin dashboard"
- Verify you're logged in with admin account
- Check credentials: `admin@hoodeatery.com` / `admin123`
- Clear browser cookies and login again

## Quick Admin URLs Reference

**Login:**
```
http://localhost:5173/login
```

**Admin Dashboard:**
```
http://localhost:5173/admin
```

**Upload Food/Drinks:**
```
http://localhost:5173/admin/menu
```

**Manage Orders:**
```
http://localhost:5173/admin/orders
```

## Tips for Best Results

1. **Use High-Quality Images**: Food photos should be appetizing and well-lit
2. **Consistent Image Sizes**: Try to use images with similar aspect ratios
3. **Optimize Before Upload**: Compress large images to improve page load speed
4. **Descriptive Names**: Use clear, appetizing names for menu items
5. **Set Availability**: Uncheck "Available" if item is temporarily out of stock

## Need Help?

If the image upload still doesn't work:
1. Check browser console for errors (F12 → Console tab)
2. Check backend terminal for error messages
3. Verify the backend `.env` file has correct `DATABASE_URL`
4. Restart both frontend and backend servers

---

**Remember:** The admin panel is intentionally hidden from the navbar for security. Always access it via direct URL: `http://localhost:5173/admin`

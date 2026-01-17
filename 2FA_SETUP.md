# Two-Factor Authentication (2FA) Setup Guide

## Overview
Your admin panel now has two-factor authentication (2FA) for enhanced security. When logging in, you'll need to:
1. Enter your admin password
2. Receive a 6-digit alphanumeric OTP via email
3. Enter the OTP to complete login

## Required Environment Variables

Add these to your `.env.local` file:

```env
# SMTP Configuration for Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

### Setting Up Gmail SMTP

1. **Enable 2-Step Verification** on your Gmail account
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. **Create App Password**
   - Visit [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "Portfolio 2FA"
   - Copy the 16-character password
   - Use this as your `SMTP_PASS`

3. **Update Environment Variables**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=youremail@gmail.com
   SMTP_PASS=abcd efgh ijkl mnop  # 16-char app password
   ```

### Using Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## How It Works

### Login Flow

1. **Step 1: Password Verification**
   - User enters admin password
   - System verifies password
   - If valid, proceeds to OTP step

2. **Step 2: OTP Generation & Email**
   - System generates 6-digit alphanumeric OTP
   - OTP saved to MongoDB with 5-minute expiry
   - Email sent to admin email (fetched from Settings)
   - OTP field appears on login page

3. **Step 3: OTP Verification**
   - User enters OTP from email
   - System verifies OTP against database
   - If valid, creates JWT session token
   - User logged into admin panel

### Security Features

✅ **OTP Expiration**: 5 minutes validity
✅ **Single Use**: OTP deleted after verification
✅ **Email Masking**: Email partially hidden for privacy
✅ **Resend Capability**: Can request new OTP if expired
✅ **Auto-Cleanup**: MongoDB TTL index removes expired OTPs

## Database Schema

**OTP Collection** (`lib/models/OTP.ts`):
```typescript
{
  email: string,        // Admin email
  otp: string,          // 6-char alphanumeric
  expiresAt: Date,      // 5 minutes from creation
  verified: boolean,    // Prevents reuse
  createdAt: Date       // Auto-timestamp
}
```

## API Endpoints

### 1. Verify Password
**POST** `/api/admin/auth/login`
```json
Request: { "password": "your-admin-password" }
Response: { "success": true, "requireOTP": true }
```

### 2. Send OTP
**POST** `/api/admin/auth/send-otp`
```json
Request: {} // No body needed
Response: { 
  "success": true, 
  "email": "ad***@gmail.com",
  "message": "OTP sent to your email"
}
```

### 3. Verify OTP
**POST** `/api/admin/auth/verify-otp`
```json
Request: { "otp": "A1B2C3" }
Response: { 
  "success": true, 
  "token": "jwt-token-here",
  "expiresIn": 14400
}
```

## Email Configuration

The OTP email includes:
- Professional HTML template
- Large, easy-to-read OTP code
- 5-minute expiration notice
- Green theme matching your portfolio
- Security warning about unauthorized access

## Testing Locally

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Admin Login**
   ```
   http://localhost:5173/admin/login
   ```

3. **Enter Password**
   - Enter your admin password
   - Click "Continue"

4. **Check Email**
   - Open your inbox
   - Find "Admin Login OTP" email
   - Copy the 6-digit code

5. **Enter OTP**
   - Paste OTP in the field
   - Click "Verify & Login"

## Troubleshooting

### "Failed to send OTP"
- Check SMTP credentials in `.env.local`
- Verify Gmail App Password is correct
- Ensure 2-Step Verification is enabled
- Check MongoDB connection

### "Admin email not configured"
- Go to Admin Settings page
- Add your email address
- Save settings
- Try login again

### "Invalid or expired OTP"
- OTP expires after 5 minutes
- Click "Resend OTP" for new code
- Check spam/junk folder
- Verify email in settings matches recipient

### Email Not Arriving
- Check spam/junk folder
- Verify SMTP_USER matches sender email
- Test SMTP connection:
  ```bash
  node -e "const n=require('nodemailer');n.createTransport({host:'smtp.gmail.com',port:587,auth:{user:'email',pass:'pass'}}).verify((e,s)=>console.log(s?'✅':'❌',e||'OK'))"
  ```

## Security Best Practices

1. **Never Share OTP**: Each OTP is single-use and time-limited
2. **Email Security**: Use a secure email with 2FA enabled
3. **Password Strength**: Maintain strong admin password
4. **SMTP Credentials**: Keep app passwords secure
5. **Monitor Access**: Check email for unauthorized login attempts

## Deployment Notes

### Vercel Deployment

1. **Add Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all SMTP variables
   - Redeploy project

2. **MongoDB Atlas**
   - Ensure IP whitelist allows Vercel IPs (0.0.0.0/0 for all)
   - OTP collection will auto-create on first use

### Netlify Deployment

1. **Site Settings → Environment Variables**
   - Add SMTP configuration
   - Trigger manual deploy

2. **Serverless Functions**
   - OTP endpoints work as serverless functions
   - No additional configuration needed

## Backup Access

If email system fails:
1. Check MongoDB `otp` collection manually
2. Use generated OTP directly (for emergency only)
3. Or temporarily disable 2FA by reverting `api/admin/auth/login.ts`

## Future Enhancements

Possible improvements:
- SMS OTP option
- Authenticator app support (TOTP)
- Remember device for 30 days
- Login attempt rate limiting
- Failed attempt notifications
- Admin audit log

## Support

If you encounter issues:
1. Check MongoDB connection
2. Verify SMTP credentials
3. Review console logs
4. Check email spam folder
5. Ensure admin email is set in Settings

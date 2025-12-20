# 🧪 Testing Guide - Authentication & Payment Flow

## 📋 Overview

This guide covers how to test the complete authentication and payment flow in Aethermind Landing Page.

---

## 🔧 Setup

### 1. Environment Variables

Create `.env.local` in `apps/home/` with:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://aethermindapi-production.up.railway.app/api

# Dashboard
NEXT_PUBLIC_DASHBOARD_URL=https://aethermind-agent-os-dashboard.vercel.app

# Stripe (use test mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
```

### 2. Backend Requirements

Verify your backend has these endpoints:

```
✅ POST /api/auth/signup - Register new user
✅ POST /api/auth/login - Login existing user
✅ GET /api/auth/me - Get current user with membership info
✅ GET /api/auth/google - Initiate Google OAuth
✅ GET /api/auth/github - Initiate GitHub OAuth
✅ POST /api/stripe/create-checkout-session - Create Stripe session
```

### 3. User Response Format

`GET /api/auth/me` should return:

```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "plan": "free" | "pro" | "enterprise",
  "subscription": {
    "status": "active" | "inactive" | "canceled",
    "plan": "pro"
  }
}
```

---

## 🧪 Test Cases

### Test 1: New User Signup → Pricing

**Steps**:

1. Go to `/signup`
2. Fill form with valid data:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Create Account"

**Expected Result**:

```
✅ User created in backend
✅ JWT token saved to localStorage
✅ Redirect to /pricing?checkout=true
✅ Welcome message shown on pricing page
```

**Verify**:

- Check localStorage: `token` present
- Check URL: `/pricing?checkout=true`

---

### Test 2: Existing User Login (No Membership) → Pricing

**Steps**:

1. Go to `/login`
2. Login with existing user (plan: "free")
3. Click "Sign In"

**Expected Result**:

```
✅ Login successful
✅ JWT token saved
✅ Redirect to /pricing?checkout=true
```

---

### Test 3: Existing User Login (With Membership) → Dashboard

**Steps**:

1. Go to `/login`
2. Login with user that has active Pro subscription
3. Click "Sign In"

**Expected Result**:

```
✅ Login successful
✅ User membership verified (plan: "pro" or subscription.status: "active")
✅ Redirect to Dashboard directly
✅ URL: https://aethermind-agent-os-dashboard.vercel.app/dashboard
```

---

### Test 4: Google OAuth → Smart Redirect

**Steps**:

1. Go to `/signup` or `/login`
2. Click "Continue with Google"
3. Authorize on Google
4. Backend redirects to `/auth/callback?token=xxx`

**Expected Flow**:

```
1. Click Google button
   → Redirect to: {API_URL}/auth/google?redirect={origin}/auth/callback

2. User authorizes on Google
   → Backend processes OAuth
   → Backend redirects to: /auth/callback?token=jwt_token

3. Callback page processes token
   → Save token to localStorage
   → Fetch user data (GET /api/auth/me)
   → Check membership
   → Redirect based on plan:
      - No membership → /pricing?checkout=true
      - Has membership → Dashboard
```

**Expected Result**:

```
✅ Google OAuth successful
✅ Token saved
✅ Smart redirect based on membership
```

---

### Test 5: GitHub OAuth → Smart Redirect

Same as Test 4 but with GitHub.

**Expected Flow**:

```
✅ Click "Continue with GitHub"
✅ Authorize on GitHub
✅ Redirect to /auth/callback?token=xxx
✅ Smart redirect based on membership
```

---

### Test 6: Stripe Checkout (Pro Plan)

**Prerequisites**:

- User must be logged in (have JWT token in localStorage)
- Stripe test mode enabled

**Steps**:

1. Go to `/pricing`
2. Click "Subscribe" on Pro plan
3. Fill Stripe Checkout form with test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
4. Click "Pay"

**Expected Result**:

```
✅ Checkout session created
✅ Redirect to Stripe Checkout page
✅ Payment successful
✅ Redirect to /pricing/success
✅ Auto-redirect to Dashboard after 5 seconds
```

**Verify in Backend**:

```
- User subscription updated to "pro"
- Stripe webhook received (if configured)
- Database updated with subscription info
```

---

### Test 7: Free Plan Selection

**Steps**:

1. Go to `/pricing`
2. Click "Start Free" on Free plan

**Expected Result**:

```
✅ No Stripe checkout (skipped)
✅ Direct redirect to Dashboard
```

---

### Test 8: Enterprise Plan Selection

**Steps**:

1. Go to `/pricing`
2. Click "Contact Sales" on Enterprise plan

**Expected Result**:

```
✅ Redirect to /contact?plan=enterprise
✅ Pre-filled contact form (if implemented)
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find name 'authAPI'"

**Solution**: Make sure you have this import in the component:

```typescript
import { authAPI } from "@/lib/api/auth";
```

### Issue 2: Redirect to pricing instead of dashboard after login

**Cause**: Backend not returning correct `plan` or `subscription` field.

**Debug**:

```typescript
// In your browser console after login:
const token = localStorage.getItem("token");
fetch("https://aethermindapi-production.up.railway.app/api/auth/me", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((r) => r.json())
  .then(console.log);

// Check the response: does it have "plan" or "subscription.status"?
```

**Fix**: Update backend to return membership info correctly.

### Issue 3: OAuth callback error

**Cause**: Backend not redirecting to correct callback URL.

**Solution**: Backend OAuth endpoints should redirect to:

```
http://localhost:3001/auth/callback?token=xxx  (local)
https://aethermind-page.vercel.app/auth/callback?token=xxx  (production)
```

### Issue 4: Stripe checkout fails

**Error**: "Failed to create checkout session"

**Debug**:

1. Check console for error message
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Verify user is logged in (token in localStorage)
4. Check backend logs for Stripe API errors

**Common Causes**:

- Stripe API key not configured in backend
- Invalid price ID
- User not authenticated

---

## 🔍 Manual Testing Checklist

### Authentication

- [ ] Email signup works
- [ ] Email login works
- [ ] Password validation works (min 8 chars)
- [ ] Password match validation works
- [ ] Error messages display correctly
- [ ] Success message after signup
- [ ] Google OAuth works
- [ ] GitHub OAuth works
- [ ] OAuth callback handles token correctly
- [ ] OAuth callback handles errors correctly

### Smart Redirect Logic

- [ ] New user → Pricing page
- [ ] User with free plan → Pricing page
- [ ] User with active Pro → Dashboard
- [ ] User with active Enterprise → Dashboard
- [ ] OAuth user without membership → Pricing
- [ ] OAuth user with membership → Dashboard

### Pricing Page

- [ ] All 3 plans display correctly
- [ ] Free plan button says "Start Free"
- [ ] Pro plan button says "Subscribe"
- [ ] Enterprise plan button says "Contact Sales"
- [ ] Checkout message shows if ?checkout=true
- [ ] Error message displays if checkout fails
- [ ] Loading state shows during checkout
- [ ] Free plan redirects to dashboard
- [ ] Enterprise plan redirects to contact page

### Stripe Integration

- [ ] Pro plan creates checkout session
- [ ] Redirects to Stripe Checkout
- [ ] Test payment completes successfully
- [ ] Success page displays after payment
- [ ] Auto-redirect to dashboard works
- [ ] Receipt email sent (verify in Stripe dashboard)
- [ ] Subscription created in backend
- [ ] User can access dashboard after payment

---

## 📊 Test Data

### Test Users

Create these test users in your backend:

**User 1: Free Plan**

```json
{
  "email": "free@test.com",
  "password": "password123",
  "plan": "free"
}
```

**User 2: Pro Plan**

```json
{
  "email": "pro@test.com",
  "password": "password123",
  "plan": "pro",
  "subscription": {
    "status": "active",
    "plan": "pro"
  }
}
```

**User 3: Enterprise**

```json
{
  "email": "enterprise@test.com",
  "password": "password123",
  "plan": "enterprise"
}
```

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Authentication: 4000 0027 6000 3184
```

---

## 🚀 Running Tests

### Local Development

```bash
cd apps/home
npm run dev
# Visit http://localhost:3001
```

### Production Testing

```bash
# Use production URLs in .env.local
NEXT_PUBLIC_API_URL=https://aethermindapi-production.up.railway.app/api
NEXT_PUBLIC_DASHBOARD_URL=https://aethermind-agent-os-dashboard.vercel.app
```

---

## 📝 Notes

- Always use Stripe **test mode** for testing
- Test both local (localhost:3001) and production (Vercel) environments
- Verify all redirects work correctly
- Check browser console for errors
- Monitor backend logs during testing

---

**Need Help?** Check backend logs or contact the team.

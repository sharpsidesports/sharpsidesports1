# Meta Pixel Integration Documentation

## Overview
This document outlines the Meta Pixel integration implemented in the Sharpside Golf React application. The integration tracks key user actions and conversion events for advertising optimization.

## Setup

### 1. Environment Variables
Add the following environment variable to your deployment platform (Vercel):

```
VITE_META_PIXEL_ID=2111250412705158
```

**Note**: This variable is already added to the local `.env` file. For production, you need to add it to your Vercel environment variables.

### 2. Files Modified/Created

#### Created Files:
- `src/utils/metaPixel.ts` - Meta Pixel utility functions
- `META_PIXEL_INTEGRATION.md` - This documentation

#### Modified Files:
- `.env` - Added Meta Pixel ID
- `src/main.tsx` - Initialize Meta Pixel on app start
- `src/App.tsx` - Added page view tracking on route changes
- `src/pages/CheckoutSuccess.tsx` - Purchase conversion tracking
- `src/components/subscription/PricingPlans.tsx` - Checkout initiation tracking
- `src/components/landing/PricingSection.tsx` - Checkout initiation tracking
- `src/context/AuthContext.tsx` - Login and signup event tracking

## Tracked Events

### 1. PageView
- **Trigger**: On every route change
- **Purpose**: Track page views and user navigation
- **Implementation**: `App.tsx` with `PageViewTracker` component

### 2. Purchase
- **Trigger**: When subscription is confirmed on `/subscription/success`
- **Data Tracked**:
  - Value: Subscription price (Basic: $59.99, Pro: $239.99 monthly default)
  - Currency: USD
  - Content Name: "Basic Plan" or "Pro Plan"
  - Content IDs: ["plan_subscription"]
  - Content Type: "product"
- **Implementation**: `CheckoutSuccess.tsx`

### 3. InitiateCheckout
- **Trigger**: When user clicks subscription buttons
- **Data Tracked**:
  - Value: Selected plan price
  - Currency: USD
  - Content Name: Plan name
  - Content Category: "subscription"
- **Implementation**: Both pricing components

### 4. CompleteRegistration
- **Trigger**: When user successfully signs up
- **Data Tracked**:
  - Method: "email"
- **Implementation**: `AuthContext.tsx`

### 5. Login
- **Trigger**: When user successfully logs in
- **Data Tracked**:
  - Method: "email"
- **Implementation**: `AuthContext.tsx`

## Technical Implementation

### Utility Functions (`src/utils/metaPixel.ts`)

```typescript
// Initialize Meta Pixel
initializeMetaPixel()

// Track page views
trackPageView()

// Track purchases
trackPurchase(value, currency, contentName)

// Track custom events
trackEvent(eventName, parameters)
```

### Key Features

1. **Environment-based Configuration**: Uses `VITE_META_PIXEL_ID` environment variable
2. **Server-side Safety**: All functions check for `window` object existence
3. **Graceful Degradation**: Functions fail silently if Meta Pixel isn't loaded
4. **TypeScript Support**: Proper type declarations for `window.fbq`

## Deployment Instructions

### For Vercel:

1. Go to your Vercel Dashboard
2. Navigate to your project → Settings → Environment Variables
3. Add:
   ```
   Name: VITE_META_PIXEL_ID
   Value: 2111250412705158
   Environment: Production (and optionally Preview/Development)
   ```
4. Redeploy your application

### Verification

After deployment, you can verify the integration by:

1. **Facebook Events Manager**: Check for incoming events
2. **Browser Console**: Look for `fbq` function calls
3. **Meta Pixel Helper**: Use the Chrome extension to validate pixel firing
4. **Network Tab**: Check for requests to `facebook.net/tr`

## Event Flow

```
User visits site → PageView tracked
User clicks pricing → InitiateCheckout tracked
User signs up → CompleteRegistration tracked
User logs in → Login tracked
User completes purchase → Purchase tracked
User navigates → PageView tracked
```

## Pricing Values Tracked

| Plan | Weekly | Monthly | Yearly |
|------|--------|---------|--------|
| Basic | $17.99 | $59.99 | $599.99 |
| Pro | $59.99 | $239.99 | $599.99 |

**Note**: Purchase tracking currently defaults to monthly pricing. This could be enhanced by storing the selected billing interval in user metadata.

## Troubleshooting

### Common Issues:

1. **Pixel not firing**: Check that `VITE_META_PIXEL_ID` is set correctly
2. **Events not appearing**: Ensure Meta Pixel is approved and active
3. **Development testing**: Events won't appear in development without the environment variable

### Debug Mode:
Add this to browser console to see pixel events:
```javascript
window.fbq('debug', true);
```

## Future Enhancements

1. **Enhanced Purchase Tracking**: Store billing interval in user metadata for accurate value tracking
2. **Custom Audiences**: Track specific user segments (trial users, power users, etc.)
3. **Additional Events**: Add events for feature usage, content engagement
4. **Server-side Events**: Implement Conversions API for better data reliability
5. **A/B Testing**: Track different user experiences and conversion paths

## Security Notes

- The Meta Pixel ID is safe to expose in client-side code
- No sensitive user data is transmitted
- All tracking complies with Meta's data usage policies
- Users can opt-out via browser settings or ad blockers 
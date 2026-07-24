# BizBot AI - Payment Integration Setup Guide

## Overview
This project now has Stripe payment integration for handling subscriptions. Follow these steps to set it up properly.

## Prerequisites
- Node.js and npm installed
- Stripe account (free tier available at stripe.com)
- Backend server (Node.js with Express recommended)

## Files Included

1. **code 1.txt** (or index.html) - Updated with payment modal
2. **script.js** - Stripe payment handling JavaScript
3. **style.css** - Styling for payment modal
4. **server.js** - Backend server (create this file)

## Step 1: Get Your Stripe Keys

1. Go to https://dashboard.stripe.com
2. Sign in or create an account
3. Navigate to **Developers > API Keys**
4. Copy your **Publishable Key** (starts with pk_test_ or pk_live_)
5. Copy your **Secret Key** (starts with sk_test_ or sk_live_)

⚠️ **Never share your Secret Key!**

## Step 2: Update Stripe Publishable Key

In `script.js`, find this line:
```javascript
const stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');
```

Replace `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY` with your actual Stripe Publishable Key.

## Step 3: Create Backend Server

Create a file named `server.js`:

```javascript
const express = require('express');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY'); // Replace with your Secret Key
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Create subscription endpoint
app.post('/create-subscription', async (req, res) => {
  try {
    const { paymentMethodId, email, name, plan, amount } = req.body;

    // Create or get customer
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    let customerId;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: email,
        name: name
      });
      customerId = customer.id;
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan === 'starter' ? 'BizBot Starter Plan' : 'BizBot Pro Shop Plan',
              description: 'Monthly subscription for BizBot AI'
            },
            unit_amount: amount,
            recurring: {
              interval: 'month'
            }
          }
        }
      ],
      default_payment_method: paymentMethodId,
      off_session: true
    });

    res.json({ 
      success: true, 
      message: 'Subscription created successfully',
      subscriptionId: subscription.id,
      customerId: customerId
    });

  } catch (error) {
    console.error('Error:', error);
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 4: Install Dependencies

```bash
npm init -y
npm install express stripe cors dotenv
```

## Step 5: Create .env File

Create a `.env` file in your project root:

```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
PORT=3000
```

## Step 6: Update HTML File Path

In your frontend, update the fetch URL if needed. Currently it calls `/create-subscription`. Make sure your backend is running on the same domain or configure CORS properly.

## Step 7: Run the Server

```bash
node server.js
```

Your server should now be running on http://localhost:3000

## Testing Payment

### Test Card Numbers (Stripe provides these):
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005

Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)

## Features Implemented

✅ Payment modal with Stripe card element
✅ Customer creation/retrieval
✅ Subscription creation
✅ Plan selection (Starter $29, Pro $59)
✅ Error handling
✅ Payment status feedback
✅ Responsive design

## Payments Flow

1. User clicks "Start Free Trial" or "Get Started"
2. Payment modal opens
3. User enters email, name, and card details
4. On submit:
   - Stripe creates a payment method
   - Frontend sends payment method ID to backend
   - Backend creates a customer and subscription
   - Confirmation email sent to user
5. Modal closes on success

## Important Notes

- **Test Mode**: Start with Stripe test keys (pk_test_, sk_test_)
- **Production**: Switch to live keys only after thorough testing
- **Security**: Never expose your Secret Key in frontend code
- **Receipts**: Stripe automatically sends receipts to customer emails
- **Webhooks**: For production, set up webhooks to handle failed payments

## Troubleshooting

**Issue**: "Invalid API Key"
- Check that your publishable key is correct in script.js
- Check that your secret key is correct in server.js

**Issue**: CORS Error
- Ensure `cors` is properly configured in server.js
- Check that frontend and backend are communicating

**Issue**: Payment Fails
- Use test card numbers provided above
- Check browser console for error messages
- Check server logs for details

## Security Best Practices

1. ✅ Never commit .env files to Git
2. ✅ Always use HTTPS in production
3. ✅ Validate inputs on backend
4. ✅ Use webhook signatures to verify Stripe events
5. ✅ Keep Stripe SDKs updated

## Support

For more help:
- Stripe Docs: https://stripe.com/docs
- GitHub Issues: Check your repository
- Community: Stack Overflow, Dev.to

---

**Status**: Payment integration ready for testing! 🎉

const express = require('express');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY'); // Replace with your Secret Key
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('./'));

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
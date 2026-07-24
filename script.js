// ========== PAGE NAVIGATION ==========
function showPage(page) {
  const landingPage = document.getElementById('landing-page');
  const dashboardPage = document.getElementById('dashboard-page');

  if (page === 'landing') {
    landingPage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
  } else if (page === 'dashboard') {
    landingPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
  }
}

// ========== CHAT FUNCTIONALITY ==========
function sendChatMessage(event) {
  event.preventDefault();
  const userInput = document.getElementById('user-input');
  const chatWindow = document.getElementById('chat-window');

  if (userInput.value.trim() === '') return;

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.textContent = userInput.value;
  chatWindow.appendChild(userMsg);

  // Simulate AI response
  setTimeout(() => {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-message bot';
    aiMsg.innerHTML = '<i class="fa-solid fa-robot"></i><div>' + getAIResponse(userInput.value) + '</div>';
    chatWindow.appendChild(aiMsg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 500);

  userInput.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getAIResponse(userMessage) {
  const responses = {
    'price': 'Our Starter Plan is $29/month and our Pro Shop Plan is $59/month. Which would you like to know more about?',
    'hours': 'We\'re open Monday-Saturday, 9am-6pm, and Sunday 10am-4pm.',
    'book': 'Great! I can help you book an appointment. What service are you interested in?',
    'haircut': 'Perfect! We have availability tomorrow at 2:00 PM with Marcus. Would you like to book that?',
    'available': 'We have several slots available this week. What day works best for you?',
    'default': 'Thanks for your question! Our team will be happy to help. What else can I assist you with?'
  };

  const lowerMsg = userMessage.toLowerCase();
  for (const [key, value] of Object.entries(responses)) {
    if (lowerMsg.includes(key)) {
      return value;
    }
  }
  return responses['default'];
}

// ========== BOOKINGS FUNCTIONALITY ==========
function addSampleBooking() {
  const bookingList = document.getElementById('booking-list');
  const newBooking = document.createElement('li');
  newBooking.className = 'booking-item';
  newBooking.innerHTML = `
    <div>
      <strong>New Client</strong>
      <p>Service Booked (Barber: TBD)</p>
    </div>
    <span class="time-badge">03:30 PM</span>
  `;
  bookingList.appendChild(newBooking);
}

// ========== CONTACT FORM ==========
function handleContactSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('contact-email').value;
  const msgDiv = document.getElementById('contact-msg');

  msgDiv.textContent = '✓ Thank you! We\'ll contact you soon at ' + email;
  msgDiv.style.display = 'block';
  document.getElementById('contact-email').value = '';

  setTimeout(() => {
    msgDiv.style.display = 'none';
  }, 5000);
}

// ========== STRIPE PAYMENT INTEGRATION ==========

// Initialize Stripe (Replace with your actual Stripe Publishable Key)
const stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');
const elements = stripe.elements();
let cardElement = null;
let selectedPlan = null;
let selectedPrice = null;

// Initialize Stripe Card Element
function initializeStripe() {
  if (!cardElement) {
    cardElement = elements.create('card');
    cardElement.mount('#card-element');

    cardElement.addEventListener('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }
}

// Open Payment Modal
function openPaymentModal(plan, price) {
  selectedPlan = plan;
  selectedPrice = price;

  const planName = plan === 'starter' ? 'Starter Plan - $29/month' : 'Pro Shop Plan - $59/month';
  document.getElementById('plan-name').textContent = '📋 Plan: ' + planName;
  document.getElementById('plan-price').textContent = '💰 Amount: $' + price;

  document.getElementById('payment-modal').classList.remove('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');

  initializeStripe();
}

// Close Payment Modal
function closePaymentModal() {
  document.getElementById('payment-modal').classList.add('hidden');
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('payment-form').reset();
  document.getElementById('payment-status').classList.add('hidden');
  document.getElementById('card-errors').textContent = '';
}

// Handle Payment Form Submission
document.addEventListener('DOMContentLoaded', () => {
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const buttonText = document.getElementById('button-text');
      const spinner = document.getElementById('spinner');
      const email = document.getElementById('email').value;
      const name = document.getElementById('name').value;

      // Show loading state
      submitBtn.disabled = true;
      buttonText.textContent = 'Processing...';
      spinner.classList.remove('hidden');

      try {
        // Create payment method
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            email: email,
            name: name
          }
        });

        if (error) {
          showPaymentStatus('error', 'Payment failed: ' + error.message);
          submitBtn.disabled = false;
          buttonText.textContent = 'Pay Now';
          spinner.classList.add('hidden');
          return;
        }

        // Send to backend to create subscription
        const response = await fetch('/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            email: email,
            name: name,
            plan: selectedPlan,
            amount: selectedPrice * 100 // Stripe uses cents
          })
        });

        const result = await response.json();

        if (result.success) {
          showPaymentStatus('success', '✓ Payment successful! Your subscription is now active. Check your email for confirmation.');
          
          // Reset form after 3 seconds
          setTimeout(() => {
            closePaymentModal();
          }, 3000);
        } else {
          showPaymentStatus('error', 'Payment failed: ' + result.message);
        }

      } catch (error) {
        showPaymentStatus('error', 'An error occurred: ' + error.message);
      }

      // Reset button state
      submitBtn.disabled = false;
      buttonText.textContent = 'Pay Now';
      spinner.classList.add('hidden');
    });
  }
});

function showPaymentStatus(type, message) {
  const statusDiv = document.getElementById('payment-status');
  statusDiv.className = 'payment-status ' + type;
  statusDiv.textContent = message;
  statusDiv.classList.remove('hidden');
}
// ==================== PAGE NAVIGATION ====================
function showPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.add('hidden'));

  // Show selected page
  const pageElement = document.getElementById(pageName + '-page');
  if (pageElement) {
    pageElement.classList.remove('hidden');
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

// ==================== CHAT FUNCTIONALITY ====================
function sendChatMessage(event) {
  event.preventDefault();

  const userInput = document.getElementById('user-input');
  const chatWindow = document.getElementById('chat-window');

  if (userInput.value.trim() === '') return;

  // Add user message to chat
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'chat-message user';
  userMessageDiv.innerHTML = `<div>${userInput.value}</div>`;
  chatWindow.appendChild(userMessageDiv);

  // Get bot response
  const userMessage = userInput.value.toLowerCase();
  userInput.value = '';

  // Simulate bot thinking
  setTimeout(() => {
    const botResponse = getBotResponse(userMessage);
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'chat-message bot';
    botMessageDiv.innerHTML = `
      <i class="fa-solid fa-robot"></i>
      <div>${botResponse}</div>
    `;
    chatWindow.appendChild(botMessageDiv);

    // Auto scroll to bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 600);

  // Auto scroll
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getBotResponse(userMessage) {
  // AI Response Logic
  const responses = {
    prices: "Our prices range from $20 for a basic haircut to $50 for premium styling services. You can view all services and pricing by visiting our pricing section!",
    booking: "I'd be happy to help you book an appointment! What service are you interested in and what time works best for you?",
    hours: "We're open Monday to Friday from 9 AM to 7 PM, Saturday 8 AM to 6 PM, and closed on Sundays.",
    location: "We're located at 123 Main Street, Downtown. You can easily find us on Google Maps!",
    stylist: "We have Marcus (barber specialist), Elena (stylist), and James (color specialist) available. Who would you prefer?",
    availability: "We have availability tomorrow at 2 PM, 3:30 PM, and 5 PM. Would any of these times work for you?",
    confirmation: "Great! Your appointment has been confirmed and you'll receive an SMS reminder 24 hours before your visit.",
    default: "Thanks for asking! I'm BizBot AI, your salon assistant. I can help you with bookings, pricing, hours, available stylists, and more. What would you like to know?"
  };

  // Check keywords
  if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('how much')) {
    return responses.prices;
  } else if (userMessage.includes('book') || userMessage.includes('appointment') || userMessage.includes('schedule')) {
    return responses.booking;
  } else if (userMessage.includes('hour') || userMessage.includes('open') || userMessage.includes('close')) {
    return responses.hours;
  } else if (userMessage.includes('location') || userMessage.includes('address') || userMessage.includes('where')) {
    return responses.location;
  } else if (userMessage.includes('stylist') || userMessage.includes('barber') || userMessage.includes('marcus') || userMessage.includes('elena')) {
    return responses.stylist;
  } else if (userMessage.includes('available') || userMessage.includes('free') || userMessage.includes('when')) {
    return responses.availability;
  } else if (userMessage.includes('confirm') || userMessage.includes('confirmed')) {
    return responses.confirmation;
  } else {
    return responses.default;
  }
}

// ==================== BOOKING MANAGEMENT ====================
function addSampleBooking() {
  const bookingList = document.getElementById('booking-list');
  const names = ['Emma Brown', 'Chris Lee', 'Jessica White', 'Tom Davis', 'Lisa Anderson'];
  const services = [
    'Haircut & Styling',
    'Beard Trim',
    'Color Treatment',
    'Hair Wash & Cut',
    'Full Makeover'
  ];
  const stylists = ['Marcus', 'Elena', 'James'];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomService = services[Math.floor(Math.random() * services.length)];
  const randomStylist = stylists[Math.floor(Math.random() * stylists.length)];
  const randomHour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
  const randomMinute = Math.random() > 0.5 ? '00' : '30';
  const timeSlot = `${String(randomHour).padStart(2, '0')}:${randomMinute} ${randomHour >= 12 ? 'PM' : 'AM'}`;

  const newBookingHTML = `
    <li class="booking-item">
      <div>
        <strong>${randomName}</strong>
        <p>${randomService} (Stylist: ${randomStylist})</p>
      </div>
      <span class="time-badge">${timeSlot}</span>
    </li>
  `;

  bookingList.insertAdjacentHTML('beforeend', newBookingHTML);
}

// ==================== CONTACT FORM ====================
function handleContactSubmit(event) {
  event.preventDefault();

  const emailInput = document.getElementById('contact-email');
  const email = emailInput.value;
  const messageDiv = document.getElementById('contact-msg');

  // Simple email validation
  if (!email.includes('@')) {
    showMessage('Please enter a valid email address.', false);
    return;
  }

  // Simulate sending
  showMessage('✓ Demo request submitted! We\'ll contact you within 24 hours.', true);
  emailInput.value = '';

  // Hide message after 5 seconds
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 5000);
}

function showMessage(text, isSuccess) {
  const messageDiv = document.getElementById('contact-msg');
  messageDiv.textContent = text;
  messageDiv.className = 'success-message show';
  if (!isSuccess) {
    messageDiv.style.background = '#ef4444';
  } else {
    messageDiv.style.background = '#10b981';
  }
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href') !== '#') {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', function() {
  // Show landing page by default
  showPage('landing');

  // Add some sample bookings on load
  setTimeout(() => {
    addSampleBooking();
    addSampleBooking();
  }, 500);
});
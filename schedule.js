const TICKETS_DATA = [
  {
    id: 1,
    title: "Cara Meminum Ramune",
    image: "",
    date: "Kamis, 27 Nov 2025",
    time: "19:00 WIB",
    members: "-",
    price: 12000
  },
];

function formatCurrency(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function renderTickets() {
  const eventsGrid = document.getElementById('eventsGrid');
  eventsGrid.innerHTML = '';

  TICKETS_DATA.forEach((ticket, index) => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.style.animationDelay = `${index * 0.1}s`;

    const eventImage = document.createElement('div');
    eventImage.className = 'event-image';
    eventImage.id = `eventImage${ticket.id}`;

    if (ticket.image && ticket.image.trim() !== '') {
      eventImage.style.backgroundImage = `url('${ticket.image}')`;
      eventImage.style.backgroundSize = 'cover';
      eventImage.style.backgroundPosition = 'center';
    } else {
      eventImage.classList.add('placeholder');
      eventImage.innerHTML = '<span class="no-visual">No Visual</span>';
    }

    eventCard.innerHTML = `
      ${eventImage.outerHTML}
      <h3 class="event-title">${ticket.title}</h3>
      <div class="event-meta">
        <div class="event-date"><i class="far fa-calendar"></i> <span>${ticket.date}</span></div>
        <div class="event-time"><i class="far fa-clock"></i> <span>${ticket.time}</span></div>
      </div>
      <div class="event-members">
        <div class="members-title">Lineup Member:</div>
        <div class="members-list">${ticket.members}</div>
      </div>
      <div class="ticket-section">
        <div class="ticket-price">${formatCurrency(ticket.price)}</div>
        <button class="btn-buy"
                data-event="${ticket.title}"
                data-price="${ticket.price}"
                data-date="${ticket.date}"
                data-time="${ticket.time}">
          BELI TIKET
        </button>
      </div>
    `;

    eventsGrid.appendChild(eventCard);
  });

  setupBuyButtons();
}

function setupBuyButtons() {
  const buyButtons = document.querySelectorAll('.btn-buy');
  buyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const event = button.getAttribute('data-event');
      const price = button.getAttribute('data-price');
      const date = button.getAttribute('data-date');
      const time = button.getAttribute('data-time');

      // Simpan ke localStorage untuk digunakan di halaman berikutnya
      localStorage.setItem('selectedEvent', event);
      localStorage.setItem('selectedPrice', price);
      localStorage.setItem('selectedDate', date);
      localStorage.setItem('selectedTime', time);

      // Redirect ke halaman pembayaran (opsional)
      alert(`Anda memilih: ${event}\nHarga: ${formatCurrency(parseInt(price))}\nTanggal: ${date}\nWaktu: ${time}`);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTickets();
});

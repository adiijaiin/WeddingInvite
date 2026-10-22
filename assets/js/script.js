/**
 * Main Interactive Logic for Indian Wedding E-Invite (Pastel Theme)
 * Handles: Event Timeline Filtering, Audio, Countdown, Calendar (.ics & Google),
 * Copy to Clipboard, RSVP with LocalStorage, Blessings Wall, and Petal Showers.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Petal Animation Engine
    if (window.petalEngine) {
        window.petalEngine.init();
    }

    // 2. "Open Royal E-Invite" / Unveil Action
    const openInviteBtn = document.getElementById('openInviteBtn');
    const waxSealBtn = document.getElementById('waxSealBtn');

    function handleUnveilInvite() {
        // Flower Petals Burst
        if (window.showerBlessings) {
            window.showerBlessings(85);
        }

        // Smoothly scroll directly to the Wedding Timeline section
        const timelineEl = document.getElementById('weddingTimeline') || document.getElementById('eventsSection');
        if (timelineEl) {
            timelineEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        showToast('🌸 Auspicious Welcome! Royal wedding itinerary unveiled.');
    }

    if (openInviteBtn) openInviteBtn.addEventListener('click', handleUnveilInvite);
    if (waxSealBtn) waxSealBtn.addEventListener('click', handleUnveilInvite);

    // 4. "Phool Barsao" (Shower Blessings) Button
    const showerBtn = document.getElementById('showerBlessingsBtn');
    if (showerBtn) {
        showerBtn.addEventListener('click', () => {
            if (window.showerBlessings) {
                window.showerBlessings(75);
            }
            showToast('🌸 Shubh Aashirvaad! Fragrant petals showered upon the couple!');
        });
    }

    // 5. Wedding Countdown Timer (Vivah Muhurat: 21 Dec 2026, 11:30 AM)
    const weddingDate = new Date('2026-12-21T11:30:00+05:30').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl) return;

        if (diff <= 0) {
            document.getElementById('countdownSection').innerHTML = `
                <div class="text-center py-4">
                    <h3 class="font-royal text-mauve mb-2">The Auspicious Moment is Here!</h3>
                    <p class="text-muted">Shubh Vivah ceremony is underway. Blessed with eternal togetherness.</p>
                </div>
            `;
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 6. Event Filter Tabs (All Ceremonies, Day 1, Day 2)
    const filterTabs = document.querySelectorAll('.filter-tab-btn');
    const eventCards = document.querySelectorAll('.event-item-col');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filterValue = tab.getAttribute('data-filter');

            eventCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else if (card.classList.contains(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 7. Copy Venue Address to Clipboard
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
            const address = "Hotel HR Greens, MR-10 Road, Near Toll Naka, Scheme 78, Indore, Madhya Pradesh 452010, India";
            navigator.clipboard.writeText(address).then(() => {
                showToast('📍 Address copied to clipboard! Ready to paste in Google Maps / Uber.');
            }).catch(() => {
                showToast('📍 Hotel HR Greens, Indore, Madhya Pradesh');
            });
        });
    }

    // 8. Interactive RSVP Management with LocalStorage
    const rsvpForm = document.getElementById('weddingRsvpForm');
    const rsvpModal = document.getElementById('rsvpSuccessModal');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('guestName').value.trim();
            const phone = document.getElementById('guestPhone').value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Attending with Joy';
            const guestsCount = document.getElementById('guestCount').value;
            const diet = document.getElementById('guestDiet').value;
            const wishes = document.getElementById('guestWishes').value.trim();

            const selectedEvents = [];
            document.querySelectorAll('input[name="attendingEvents"]:checked').forEach(cb => {
                selectedEvents.push(cb.value);
            });

            const rsvpData = {
                id: Date.now(),
                name,
                phone,
                attendance,
                guestsCount,
                diet,
                selectedEvents,
                wishes,
                submittedAt: new Date().toISOString()
            };

            const existingRsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            existingRsvps.push(rsvpData);
            localStorage.setItem('wedding_rsvps', JSON.stringify(existingRsvps));

            if (wishes) {
                addBlessingToWall(name, wishes, 'Just now');
            }

            if (window.showerBlessings) {
                window.showerBlessings(90);
            }

            document.getElementById('rsvpGuestDisplayName').textContent = name;
            const bsModal = new bootstrap.Modal(rsvpModal);
            bsModal.show();

            rsvpForm.reset();
        });
    }

    // 9. Blessings Wall Logic
    const blessingsList = document.getElementById('blessingsContainer');
    const blessingForm = document.getElementById('quickBlessingForm');

    const defaultBlessings = [
        {
            name: "Snehlata & Satyendra Jain (Bride's Parents)",
            message: "Our darling Naincee, you fill our lives with boundless joy and warmth. Aditya, we welcome you with open arms as our beloved son. May Bhagwan Mahavira bless both of you with eternal love, harmony, and prosperity!",
            time: "Family Blessing"
        },
        {
            name: "Manju & Rajendra Jain (Groom's Parents)",
            message: "Welcoming Naincee into our hearts and family as our cherished daughter. Aditya & Naincee, may your sacred union be showered with wisdom, peace, and lifelong happiness.",
            time: "Family Blessing"
        },
        {
            name: "Ankit & Ritu Jain (Cousins)",
            message: "The Sangeet dance face-offs at Hotel HR Greens are going to be legendary! Can't wait to celebrate with both families in Indore!",
            time: "2 hours ago"
        },
        {
            name: "Prashant & Neha Jain (Family Friends)",
            message: "Heartiest congratulations to both the Jain families! Looking forward to an enchanting celebration at Hotel HR Greens, Indore!",
            time: "4 hours ago"
        }
    ];

    function loadBlessings() {
        if (!blessingsList) return;
        const savedBlessings = JSON.parse(localStorage.getItem('wedding_blessings') || '[]');
        const allBlessings = [...savedBlessings, ...defaultBlessings];

        blessingsList.innerHTML = '';
        allBlessings.forEach(b => {
            renderBlessingCard(b.name, b.message, b.time);
        });
    }

    function renderBlessingCard(name, message, time) {
        if (!blessingsList) return;
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="blessing-card-pastel">
                <div class="d-flex align-items-center mb-3">
                    <div class="blessing-avatar-circle me-3">
                        <i class="fas fa-om"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 text-mauve-deep font-serif fw-bold">${escapeHtml(name)}</h6>
                        <small class="text-muted"><i class="far fa-clock me-1"></i>${escapeHtml(time)}</small>
                    </div>
                </div>
                <p class="mb-3 text-secondary fst-italic">"${escapeHtml(message)}"</p>
                <div class="pt-2 text-end border-top border-light">
                    <span class="badge bg-light text-mauve-deep border"><i class="fas fa-heart text-danger me-1"></i> Shubhkaamnaye</span>
                </div>
            </div>
        `;
        blessingsList.appendChild(card);
    }

    function addBlessingToWall(name, message, time = 'Just now') {
        const savedBlessings = JSON.parse(localStorage.getItem('wedding_blessings') || '[]');
        savedBlessings.unshift({ name, message, time });
        localStorage.setItem('wedding_blessings', JSON.stringify(savedBlessings));
        loadBlessings();
    }

    if (blessingForm) {
        blessingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('blessingAuthor').value.trim();
            const message = document.getElementById('blessingContent').value.trim();
            if (name && message) {
                addBlessingToWall(name, message);
                if (window.showerBlessings) window.showerBlessings(60);
                showToast('💖 Your blessing has been lovingly posted to the wall!');
                blessingForm.reset();
            }
        });
    }

    loadBlessings();

    // 10. Calendar Event Handlers (.ics file generator and Google Calendar URL)
    window.addEventToCalendar = function (eventType) {
        const events = {
            'haldi': {
                title: "Naincee & Aditya's Haldi & Phoolon Ki Holi",
                desc: "Join us for an auspicious, sunny morning of Haldi and flower shower celebrations followed by festive brunch!",
                location: "The Greens Lawn, Hotel HR Greens, Indore",
                googleDates: "20261220T050000Z/20261220T083000Z"
            },
            'sangeet': {
                title: "Naincee & Aditya's Sangeet & Cocktail Soirée",
                desc: "An electrifying evening of music, dance face-offs, cocktails, and royal feast!",
                location: "Crystal Grand Ballroom, Hotel HR Greens, Indore",
                googleDates: "20261220T133000Z/20261220T193000Z"
            },
            'phere': {
                title: "Naincee & Aditya's Shubh Vivah & Sacred Phere",
                desc: "Witness the sacred seven vows around the holy fire as Naincee & Aditya unite in matrimony. Baraat: 10 AM, Varmala: 11:15 AM, Phere: 12:00 PM.",
                location: "The Royal Mandap Lawn, Hotel HR Greens, Indore",
                googleDates: "20261221T043000Z/20261221T100000Z"
            },
            'reception': {
                title: "Naincee & Aditya's Grand Royal Reception",
                desc: "An enchanting evening banquet to toast the newlyweds. Live music & gourmet dining.",
                location: "Grand Celebrations Lawn, Hotel HR Greens, Indore",
                googleDates: "20261221T140000Z/20261221T180000Z"
            }
        };

        const ev = events[eventType];
        if (!ev) return;

        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${ev.googleDates}&details=${encodeURIComponent(ev.desc)}&location=${encodeURIComponent(ev.location)}`;

        window.open(googleUrl, '_blank');
        showToast(`📅 Opening Google Calendar for ${ev.title}`);
    };

    window.downloadICS = function (eventType) {
        const events = {
            'haldi': {
                title: "Naincee & Aditya's Haldi & Phoolon Ki Holi",
                desc: "Haldi & flower shower celebration.",
                location: "Hotel HR Greens, Indore",
                start: "20261220T103000",
                end: "20261220T140000"
            },
            'sangeet': {
                title: "Naincee & Aditya's Sangeet & Cocktail Soirée",
                desc: "Dance, music, and cocktail celebration.",
                location: "Hotel HR Greens, Indore",
                start: "20261220T190000",
                end: "20261221T010000"
            },
            'phere': {
                title: "Naincee & Aditya's Shubh Vivah (Phere Ceremony)",
                desc: "Sacred Vivah Sanskar and Phere ceremony.",
                location: "Hotel HR Greens, Indore",
                start: "20261221T100000",
                end: "20261221T153000"
            },
            'reception': {
                title: "Naincee & Aditya's Grand Royal Reception",
                desc: "Royal wedding dinner reception.",
                location: "Hotel HR Greens, Indore",
                start: "20261221T193000",
                end: "20261221T233000"
            }
        };

        const ev = events[eventType];
        if (!ev) return;

        const icsData = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Naincee and Aditya Wedding//IN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            `SUMMARY:${ev.title}`,
            `DESCRIPTION:${ev.desc}`,
            `LOCATION:${ev.location}`,
            `DTSTART:${ev.start}`,
            `DTEND:${ev.end}`,
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `${eventType}_wedding_invite.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('📥 iCalendar (.ics) downloaded for Apple/Outlook!');
    };
});

function showToast(message) {
    const toast = document.getElementById('weddingToast');
    const toastBody = document.getElementById('toastMessage');
    if (toast && toastBody) {
        toastBody.innerHTML = message;
        const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
        bsToast.show();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

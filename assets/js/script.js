/**
 * Main Interactive Logic for Indian Wedding E-Invite (Pastel Theme)
 * Handles: Event Timeline Filtering, Audio, Countdown, Calendar (.ics & Google),
 * Copy to Clipboard, RSVP with LocalStorage, Blessings Wall, and Petal Showers.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Temporary theme switcher: each theme is its own page (same assets, same backend),
    //    so changing the dropdown navigates there. The current page is read from <html data-theme>.
    const themePages = {
        'pastel-mauve': 'index.html',
        'mint-illustrated': 'mint-illustrated.html',
        'blush-garden': 'blush-garden.html',
        'mint-glass': 'mint-glass.html',
        'blush-glass': 'blush-glass.html'
    };
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        const current = document.documentElement.getAttribute('data-theme') || 'pastel-mauve';
        if ([...themeSelect.options].some(o => o.value === current)) themeSelect.value = current;
        themeSelect.addEventListener('change', () => {
            const page = themePages[themeSelect.value];
            if (page) window.location.href = page;
        });
    }

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

        showToast('🌸 Auspicious Welcome! Wedding itinerary unveiled.');
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

    // 5. Wedding Countdown Timer (Vivah Muhurat: 22 Dec 2026, 01:00 PM)
    const weddingDate = new Date('2026-12-22T13:00:00+05:30').getTime();

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

    // 8. Interactive RSVP Management (Google Sheet via Apps Script, LocalStorage as a backup copy)
    const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzSTB2cLzNC63_eH1Xo9ESj_7XwatvSKvX1iydRd3FHFeK9nNOkGb1VxJnwLwQqO88/exec';
    const rsvpForm = document.getElementById('weddingRsvpForm');
    const rsvpModal = document.getElementById('rsvpSuccessModal');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('guestName').value.trim();
            const phone = document.getElementById('guestPhone').value.trim();
            const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Attending with Joy';
            const guestsCount = document.getElementById('guestCount').value;
            const side = document.querySelector('input[name="side"]:checked')?.value || '';
            const arrival = document.getElementById('guestArrival').value.trim();
            const website = document.getElementById('guestWebsite')?.value || ''; // honeypot, stays empty for real guests

            const rsvpData = {
                type: 'rsvp',
                id: Date.now(),
                name,
                phone,
                attendance,
                side,
                guestsCount,
                arrival,
                website,
                submittedAt: new Date().toISOString()
            };

            // Send to the Google Sheet. Apps Script sends no CORS headers, so the request goes out
            // as no-cors: the browser can't read the reply, but the row still lands in the sheet.
            fetch(RSVP_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(rsvpData)
            }).catch(() => {
                showToast('⚠️ Could not reach the RSVP sheet. Please try again in a moment.');
            });

            const existingRsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
            existingRsvps.push(rsvpData);
            localStorage.setItem('wedding_rsvps', JSON.stringify(existingRsvps));

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
            name: "Manju & Rajendra Jain (Groom's Parents)",
            message: "Welcoming Naincee into our hearts and family as our cherished daughter. Aditya & Naincee, may your sacred union be showered with wisdom, peace, and lifelong happiness.",
            time: "Family Blessing"
        },
        {
            name: "Snehlata & Satyendra Jain (Bride's Parents)",
            message: "Our darling Naincee, you fill our lives with boundless joy and warmth. Aditya, we welcome you with open arms as our beloved son. May Bhagwan Mahavira bless both of you with eternal love, harmony, and prosperity!",
            time: "Family Blessing"
        }
    ];

    // Approved blessings come from the Google Sheet (Blessings tab, Approved ticked).
    // A guest's own just-posted blessing is kept in localStorage so they see it at once,
    // marked as awaiting approval, until it shows up in the approved list.
    let sheetBlessings = [];

    function pendingBlessings() {
        return JSON.parse(localStorage.getItem('wedding_blessings_pending') || '[]');
    }

    function renderWall() {
        if (!blessingsList) return;
        const approvedKeys = new Set(sheetBlessings.map(b => b.name + '|' + b.message));
        const pending = pendingBlessings().filter(b => !approvedKeys.has(b.name + '|' + b.message));
        localStorage.setItem('wedding_blessings_pending', JSON.stringify(pending));

        blessingsList.innerHTML = '';
        pending.forEach(b => renderBlessingCard(b.name, b.message, 'Awaiting approval', true));
        sheetBlessings.forEach(b => renderBlessingCard(b.name, b.message, formatBlessingTime(b.time)));
        defaultBlessings.forEach(b => renderBlessingCard(b.name, b.message, b.time));
    }

    function formatBlessingTime(value) {
        const d = new Date(value);
        if (isNaN(d)) return 'Shubhkaamnaye';
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }

    function loadBlessings() {
        renderWall(); // family blessings (and any pending ones) show immediately
        fetch(`${RSVP_ENDPOINT}?action=blessings`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data && data.ok && Array.isArray(data.blessings)) {
                    sheetBlessings = data.blessings;
                    renderWall();
                }
            })
            .catch(() => { /* sheet unreachable: the wall keeps the family blessings */ });
    }

    function renderBlessingCard(name, message, time, pending = false) {
        if (!blessingsList) return;
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        const badge = pending
            ? '<span class="badge bg-light text-secondary border"><i class="far fa-hourglass me-1"></i> Visible to you until approved</span>'
            : '<span class="badge bg-light text-mauve-deep border"><i class="fas fa-heart text-danger me-1"></i> Shubhkaamnaye</span>';
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
                <div class="pt-2 text-end border-top border-light">${badge}</div>
            </div>
        `;
        blessingsList.appendChild(card);
    }

    function addPendingBlessing(name, message) {
        const pending = pendingBlessings();
        pending.unshift({ name, message });
        localStorage.setItem('wedding_blessings_pending', JSON.stringify(pending));
        renderWall();
    }

    if (blessingForm) {
        blessingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('blessingAuthor').value.trim();
            const message = document.getElementById('blessingContent').value.trim();
            if (!name || !message) return;

            fetch(RSVP_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ type: 'blessing', name, message, website: document.getElementById('guestWebsite')?.value || '' })
            }).catch(() => {
                showToast('⚠️ Could not reach the blessings sheet. Please try again in a moment.');
            });

            addPendingBlessing(name, message);
            if (window.showerBlessings) window.showerBlessings(60);
            showToast('💖 Thank you! Your blessing will appear on the wall once the family approves it.');
            blessingForm.reset();
        });
    }

    loadBlessings();

    // 10. Calendar Event Handlers (.ics file generator and Google Calendar URL)
    window.addEventToCalendar = function (eventType) {
        const events = {
            'haldi': {
                title: "Naincee & Aditya's Haldi & Phoolon Ki Holi",
                desc: "Join us for an auspicious afternoon of Haldi and flower shower celebrations followed by festive snacks!",
                location: "Hotel HR Greens, Indore",
                googleDates: "20261221T083000Z/20261221T113000Z"
            },
            'sangeet': {
                title: "Naincee & Aditya's Ring Ceremony & Sangeet",
                desc: "Exchange of rings followed by an electrifying evening of music, dance face-offs, and a festive feast!",
                location: "Hotel HR Greens, Indore",
                googleDates: "20261221T133000Z/20261221T173000Z"
            },
            'baraat': {
                title: "Naincee & Aditya's Baarat / Procession",
                desc: "The groom's procession arrives with music and dancing, received by the bride's family at the gate.",
                location: "Hotel HR Greens, Indore",
                googleDates: "20261222T053000Z/20261222T073000Z"
            },
            'phere': {
                title: "Naincee & Aditya's Shubh Vivah & Sacred Phere",
                desc: "Witness the sacred seven vows around the holy fire as Naincee & Aditya unite in matrimony.",
                location: "Hotel HR Greens, Indore",
                googleDates: "20261222T073000Z/20261222T100000Z"
            },
            'reception': {
                title: "Naincee & Aditya's Grand Reception",
                desc: "An enchanting evening banquet to toast the newlyweds. Live music & gourmet dining.",
                location: "Hotel HR Greens, Indore",
                googleDates: "20261222T133000Z/20261222T173000Z"
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
                start: "20261221T140000",
                end: "20261221T170000"
            },
            'sangeet': {
                title: "Naincee & Aditya's Ring Ceremony & Sangeet",
                desc: "Ring ceremony followed by dance and music celebration.",
                location: "Hotel HR Greens, Indore",
                start: "20261221T190000",
                end: "20261221T230000"
            },
            'baraat': {
                title: "Naincee & Aditya's Baarat / Procession",
                desc: "The groom's procession, received at the gate.",
                location: "Hotel HR Greens, Indore",
                start: "20261222T110000",
                end: "20261222T130000"
            },
            'phere': {
                title: "Naincee & Aditya's Shubh Vivah (Phere Ceremony)",
                desc: "Sacred Vivah Sanskar and Phere ceremony.",
                location: "Hotel HR Greens, Indore",
                start: "20261222T130000",
                end: "20261222T160000"
            },
            'reception': {
                title: "Naincee & Aditya's Grand Reception",
                desc: "Wedding dinner reception.",
                location: "Hotel HR Greens, Indore",
                start: "20261222T190000",
                end: "20261222T230000"
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

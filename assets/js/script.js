/* Hindi pages (html lang="hi") get their interface strings from this map; everything else falls through to English. */
const HI_STRINGS = {
    '🌸 Auspicious Welcome! Wedding itinerary unveiled.': '🌸 हार्दिक स्वागत! विवाह कार्यक्रम प्रस्तुत है।',
    '🌸 Shubh Aashirvaad! Fragrant petals showered upon the couple!': '🌸 शुभ आशीर्वाद! वर-वधू पर पुष्प वर्षा हुई!',
    '📍 Address copied to clipboard! Ready to paste in Google Maps / Uber.': '📍 पता कॉपी हो गया! गूगल मैप्स / उबर में पेस्ट करें।',
    '📍 Hotel HR Greens, Indore, Madhya Pradesh': '📍 होटल एचआर ग्रीन्स, इंदौर, मध्य प्रदेश',
    '⚠️ Could not reach the RSVP sheet. Please try again in a moment.': '⚠️ RSVP शीट से संपर्क नहीं हो सका। कृपया थोड़ी देर बाद पुनः प्रयास करें।',
    '⚠️ Could not reach the blessings sheet. Please try again in a moment.': '⚠️ आशीर्वाद शीट से संपर्क नहीं हो सका। कृपया थोड़ी देर बाद पुनः प्रयास करें।',
    '💖 Thank you! Your blessing will appear on the wall once the family approves it.': '💖 धन्यवाद! परिवार की स्वीकृति के बाद आपका आशीर्वाद दीवार पर दिखाई देगा।',
    '📥 iCalendar (.ics) downloaded for Apple/Outlook!': '📥 iCalendar (.ics) फ़ाइल डाउनलोड हो गई!',
    '📅 Opening Google Calendar for ': '📅 गूगल कैलेंडर खुल रहा है: ',
    'The Auspicious Moment is Here!': 'शुभ घड़ी आ गई!',
    'Shubh Vivah ceremony is underway. Blessed with eternal togetherness.': 'शुभ विवाह संपन्न हो रहा है। सदा साथ का आशीर्वाद।',
    "Manju & Rajendra Jain (Groom's Parents)": 'मंजू व राजेंद्र जैन (वर के माता-पिता)',
    "Snehlata & Satyendra Jain (Bride's Parents)": 'स्नेहलता व सत्येंद्र जैन (वधू के माता-पिता)',
    'Family Blessing': 'पारिवारिक आशीर्वाद',
    'Awaiting approval': 'स्वीकृति की प्रतीक्षा में',
    'Shubhkaamnaye': 'शुभकामनाएँ',
    'Visible to you until approved': 'स्वीकृति तक केवल आपको दिखाई देगा',
    'Today': 'आज',
    'the Phere begin at 1 pm': 'फेरे दोपहर 1 बजे आरंभ होंगे',
};
const IS_HINDI = document.documentElement.lang === 'hi';
function t(text) { return IS_HINDI && HI_STRINGS[text] ? HI_STRINGS[text] : text; }

const current = document.documentElement.getAttribute('data-theme') || 'blush-glass';/**
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

        showToast(t('🌸 Auspicious Welcome! Wedding itinerary unveiled.'));
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
            showToast(t('🌸 Shubh Aashirvaad! Fragrant petals showered upon the couple!'));
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
                    <h3 class="font-royal text-mauve mb-2">${t('The Auspicious Moment is Here!')}</h3>
                    <p class="text-muted">${t('Shubh Vivah ceremony is underway. Blessed with eternal togetherness.')}</p>
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
                showToast(t('📍 Address copied to clipboard! Ready to paste in Google Maps / Uber.'));
            }).catch(() => {
                showToast(t('📍 Hotel HR Greens, Indore, Madhya Pradesh'));
            });
        });
    }

    // 8. Interactive RSVP Management (Google Sheet via Apps Script, LocalStorage as a backup copy)
    const RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzSTB2cLzNC63_eH1Xo9ESj_7XwatvSKvX1iydRd3FHFeK9nNOkGb1VxJnwLwQqO88/exec';

    // A random id kept in this browser, sent with every post so the Apps Script can throttle a
    // single sender without needing an IP address (Apps Script never sees one).
    function clientId() {
        try {
            let id = localStorage.getItem('wedding_client_id');
            if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('wedding_client_id', id); }
            return id;
        } catch (e) { return 'anon'; }
    }
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
                client: clientId(),
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
                showToast(t('⚠️ Could not reach the RSVP sheet. Please try again in a moment.'));
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
            name: t("Manju & Rajendra Jain (Groom's Parents)"),
            message: IS_HINDI ? "नैन्सी का हमारे हृदय और परिवार में प्रिय बेटी के रूप में स्वागत है। आदित्य व नैन्सी, आपका पावन बंधन विवेक, शांति और आजीवन सुख से भरा रहे।" : "Welcoming Naincee into our hearts and family as our cherished daughter. Aditya & Naincee, may your sacred union be showered with wisdom, peace, and lifelong happiness.",
            time: t("Family Blessing")
        },
        {
            name: t("Snehlata & Satyendra Jain (Bride's Parents)"),
            message: IS_HINDI ? "हमारी प्यारी नैन्सी, तुम हमारे जीवन को असीम आनंद और स्नेह से भर देती हो। आदित्य, प्रिय पुत्र के रूप में हम तुम्हारा खुले हृदय से स्वागत करते हैं। भगवान महावीर आप दोनों को अटूट प्रेम, सामंजस्य और समृद्धि का आशीर्वाद दें!" : "Our darling Naincee, you fill our lives with boundless joy and warmth. Aditya, we welcome you with open arms as our beloved son. May Bhagwan Mahavira bless both of you with eternal love, harmony, and prosperity!",
            time: t("Family Blessing")
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
        pending.forEach(b => renderBlessingCard(b.name, b.message, t('Awaiting approval'), true));
        sheetBlessings.forEach(b => renderBlessingCard(b.name, b.message, formatBlessingTime(b.time)));
        defaultBlessings.forEach(b => renderBlessingCard(b.name, b.message, b.time));
    }

    function formatBlessingTime(value) {
        const d = new Date(value);
        if (isNaN(d)) return t('Shubhkaamnaye');
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
            ? '<span class="badge bg-light text-secondary border"><i class="far fa-hourglass me-1"></i> ' + t('Visible to you until approved') + '</span>'
            : '<span class="badge bg-light text-mauve-deep border"><i class="fas fa-heart text-danger me-1"></i> ' + t('Shubhkaamnaye') + '</span>';
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
                body: JSON.stringify({ type: 'blessing', client: clientId(), name, message, website: document.getElementById('guestWebsite')?.value || '' })
            }).catch(() => {
                showToast(t('⚠️ Could not reach the blessings sheet. Please try again in a moment.'));
            });

            addPendingBlessing(name, message);
            if (window.showerBlessings) window.showerBlessings(60);
            showToast(t('💖 Thank you! Your blessing will appear on the wall once the family approves it.'));
            blessingForm.reset();
        });
    }

    loadBlessings();

    // 10. Calendar Event Handlers (.ics file generator and Google Calendar URL)
    window.addEventToCalendar = function (eventType) {
        const events = {
            'haldi': {
                title: "Naincee & Aditya's Haldi/Phoolon ki Haldi",
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
        showToast(t('📅 Opening Google Calendar for ') + ev.title);
    };

    window.downloadICS = function (eventType) {
        const events = {
            'haldi': {
                title: "Naincee & Aditya's Haldi/Phoolon ki Haldi",
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
        showToast(t('📥 iCalendar (.ics) downloaded for Apple/Outlook!'));
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

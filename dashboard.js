/* =============================================
   Recycle Ekhaya — dashboard.js
   Role: Frontend ↔ Backend Contract Layer
   ============================================= */

'use strict';

/* =============================================
   API CONTRACT (FOR BACKEND TEAM)

   All endpoints must return JSON.

   GET /api/auth/me
   -> { first_name, last_name, city, country }

   GET /api/dashboard/stats
   -> {
        wallet_balance,
        wallet_change_week,
        total_recycled_kg,
        recycled_change_pct,
        pickups_completed,
        pickups_change_month,
        co2_saved_tons,
        co2_change_month
      }

   GET /api/pickups?limit=6
   -> [{ id, address, type, color, weight, status }]

   GET /api/analytics/mix
   -> {
        materials: [{ name, pct }],
        this_month_kg,
        avg_per_pickup_kg
      }

   GET /api/analytics/weekly
   -> {
        week: [{ day, kg }],
        max_kg
      }

   GET /api/notifications/unread-count
   -> { unread }

   GET /api/pickups/pending-count
   -> { count }
============================================= */


/* =============================================
   API LAYER (Replace with real backend)
   ============================================= */

async function apiFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${url}`);
  return res.json();
}


/* =============================================
   UI MODULES
   ============================================= */

/* --- Sidebar --- */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggleBtn');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');

    // Persist state
    localStorage.setItem('sidebar', sidebar.classList.contains('collapsed'));
  });

  // Restore state
  if (localStorage.getItem('sidebar') === 'true') {
    sidebar.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
  }
}

/* --- Sign out --- */
function initSignOut() {
  document.getElementById('signOutBtn').addEventListener('click', async () => {
    window.location.href = '/login';
  });
}

/* --- Header --- */
/* Expects: { first_name, last_name, city, country } */
function initHeader(user) {
  const hour = new Date().getHours();
  const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  document.getElementById('greetingTime').textContent = period;
  document.getElementById('userFirstName').textContent = user.first_name;
  document.getElementById('headerLocation').textContent = `${user.city}, ${user.country}`;
  document.getElementById('userAvatar').textContent =
    user.first_name[0] + user.last_name[0];

  document.getElementById('headerDate').textContent =
    new Date().toLocaleDateString('en-ZA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
}

/* --- Notifications --- */
function initNotifications(count) {
  const dot = document.getElementById('notifDot');
  if (count > 0) dot.hidden = false;
}

/* --- Pending badge --- */
function initPendingBadge(count) {
  const badge = document.getElementById('pendingPickupsBadge');
  if (count > 0) {
    badge.textContent = count;
    badge.hidden = false;
  }
}

/* --- Stats --- */
/* Expects stats object (see API contract) */
function populateStats(stats) {
  function countUp(el, target, format) {
    const start = performance.now();
    const duration = 1200;

    (function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    })(start);
  }

  const fmt = n => n.toLocaleString();

  countUp(document.getElementById('statWalletBalance'),
    stats.wallet_balance, n => `R ${fmt(n)}`);

  countUp(document.getElementById('statTotalRecycled'),
    stats.total_recycled_kg, n => `${fmt(n)} kg`);

  countUp(document.getElementById('statPickups'),
    stats.pickups_completed, n => fmt(n));

  countUp(document.getElementById('statCO2'),
    stats.co2_saved_tons * 10, n => `${(n / 10).toFixed(1)} tons`);
}

/* --- Table --- */
/* Expects: [{ id, address, type, color, weight, status }] */
function populateTable(pickups) {
  const tbody = document.getElementById('pickupTableBody');
  tbody.innerHTML = '';

  pickups.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${p.id}</td>
      <td>${p.address}</td>
      <td>${p.type}</td>
      <td>${p.weight} kg</td>
      <td>${p.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* --- Mix --- */
/* Expects mix object (see API contract) */
function populateMix(mix) {
  document.getElementById('chipThisMonth').textContent = mix.this_month_kg;
  document.getElementById('chipAvgPickup').textContent = mix.avg_per_pickup_kg;
}

/* --- Chart --- */
/* Expects weekly object */
function populateChart(weekly) {
  const container = document.getElementById('miniChartContainer');
  container.innerHTML = '';

  weekly.week.forEach(d => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(d.kg / weekly.max_kg) * 100}%`;
    container.appendChild(bar);
  });
}


/* =============================================
   BOOTSTRAP (MAIN INTEGRATION POINT)
   ============================================= */

document.addEventListener('DOMContentLoaded', async () => {
  initSidebar();
  initSignOut();

  try {
    const user = await apiFetch('/api/auth/me');
    initHeader(user);

    const notif = await apiFetch('/api/notifications/unread-count');
    initNotifications(notif.unread);

    const pending = await apiFetch('/api/pickups/pending-count');
    initPendingBadge(pending.count);

    const stats = await apiFetch('/api/dashboard/stats');
    populateStats(stats);

    const pickups = await apiFetch('/api/pickups?limit=6');
    populateTable(pickups);

    const mix = await apiFetch('/api/analytics/mix');
    populateMix(mix);

    const weekly = await apiFetch('/api/analytics/weekly');
    populateChart(weekly);

  } catch (err) {
    console.error('Dashboard load failed:', err);
  }
});
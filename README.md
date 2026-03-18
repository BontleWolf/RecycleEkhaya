
# Recycle Ekhaya — Dashboard Frontend

## Overview

**Recycle Ekhaya** is a web dashboard for monitoring and managing recycling activities. This repository contains the **frontend code** responsible for displaying dynamic data fetched from backend APIs.

* **Technologies**: HTML, CSS, JavaScript
* **Purpose**: Visualize recycling stats, pickup requests, wallet info, and analytics.
* **Note**: Mock data is used for development; replace with real API responses for production.

---

## Project Structure

| File / Folder    | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `dashboard.html` | Main dashboard page layout with placeholders for dynamic data. Accessible at `/dashboard`.    |
| `dashboard.js`   | Handles API calls, DOM manipulation, and animations. Replace `MOCK` data with real API calls. |
| `dashboard.css`  | Styling for the dashboard, including sidebar, cards, and charts.                              |
| `assets/`        | Images, icons, fonts, or other static assets.                                                 |

---

## Dynamic Data Injection Points

Frontend interacts with backend via specific **DOM IDs**:

| Element ID            | Description                    |
| --------------------- | ------------------------------ |
| `userFirstName`       | Logged-in user first name      |
| `headerLocation`      | City and country of user       |
| `userAvatar`          | User initials                  |
| `statWalletBalance`   | Wallet balance                 |
| `statTotalRecycled`   | Total recycled kilograms       |
| `statPickups`         | Number of completed pickups    |
| `statCO2`             | CO₂ saved                      |
| `pickupTableBody`     | Pickup requests table          |
| `analyticsMaterials`  | Recycling material mix         |
| `miniChartContainer`  | Weekly activity chart          |
| `notifDot`            | Unread notifications indicator |
| `pendingPickupsBadge` | Pending pickups badge          |

---

## Required API Endpoints

### Authentication

```http
GET /api/auth/me
```

Response example:

```json
{
  "first_name": "Alex",
  "last_name": "Louw",
  "city": "Johannesburg",
  "country": "ZA"
}
```

### Dashboard Stats

```http
GET /api/dashboard/stats
```

### Pickups

```http
GET /api/pickups?limit=6
```

### Notifications

```http
GET /api/notifications/unread-count
```

### Pending Pickups

```http
GET /api/pickups/pending-count
```

### Recycling Mix

```http
GET /api/analytics/mix
```

### Weekly Analytics

```http
GET /api/analytics/weekly
```

> **Important**: API responses must match the frontend’s expected structure exactly.

---

## Replacing Mock Data

Currently, `dashboard.js` uses mock objects:

```js
initHeader(MOCK.user);
populateStats(MOCK.stats);
populateTable(MOCK.pickups);
```

Replace with real API calls:

```js
const user = await fetch('/api/auth/me').then(r => r.json());
initHeader(user);

const stats = await fetch('/api/dashboard/stats').then(r => r.json());
populateStats(stats);

const pickups = await fetch('/api/pickups?limit=6').then(r => r.json());
populateTable(pickups);
```

Repeat for all modules that reference `MOCK`.

## Responsibilities

**Frontend Team**

* Build UI/UX components.
* Inject API data into HTML placeholders.
* Handle UI interactions and animations.
* Ensure responsive design and accessibility.

## Contributors

**Group Name**: Recycle Ekhaya Frontend Team
**Main Page**: [`dashboard.html`](dashboard.html)

**Contributors**:

* Rikhotsp 223555268 — Frontend Developer
* 232190825 S Zulu - Frontend Developer

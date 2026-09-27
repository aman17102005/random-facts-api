# 🧠 Random Facts API

A free, public, developer-friendly API that serves interesting, accurate,
randomly selected facts across 10 categories. Built for fun, learning,
demos, websites, apps, and coding projects — no API key, no database,
no cost.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Base URL](#base-url)
- [Endpoints](#endpoints)
  - [GET /api/fact](#get-apifact)
  - [GET /api/facts](#get-apifacts)
  - [GET /api/categories](#get-apicategories)
  - [GET /api/fact/today](#get-apifacttoday)
  - [GET /health](#get-health)
- [Available Categories](#available-categories)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)
- [CORS](#cors)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Configuration](#configuration)
- [Roadmap / Future Expansion](#roadmap--future-expansion)

---

## Quick Start

```bash
git clone <your-repo-url>
cd random-facts-api
npm install
npm start
```

The API is now running at `http://localhost:3000`.

```bash
curl http://localhost:3000/api/fact
```

---

## Base URL

During local development:

```
http://localhost:3000
```

Once deployed, replace this with your production URL (e.g.
`https://your-app-name.onrender.com`).

---

## Endpoints

### GET /api/fact

Returns one completely random fact.

**Query parameters**

| Param      | Type   | Required | Description                          |
|------------|--------|----------|---------------------------------------|
| `category` | string | No       | Restrict the fact to one category.    |

**Example request**

```
GET /api/fact
GET /api/fact?category=space
```

**Example response — `200 OK`**

```json
{
  "id": 8,
  "category": "space",
  "fact": "Neutron stars are so dense that a sugar-cube-sized piece of one would weigh roughly a billion tons.",
  "source": "NASA"
}
```

---

### GET /api/facts

Returns multiple random facts at once (no duplicates within one response).

**Query parameters**

| Param      | Type   | Required | Default | Description                                   |
|------------|--------|----------|---------|------------------------------------------------|
| `limit`    | number | No       | `5`     | How many facts to return. Must be 1–50.        |
| `category` | string | No       | all     | Restrict results to one category.              |

**Example request**

```
GET /api/facts?limit=10
GET /api/facts?limit=3&category=animals
```

**Example response — `200 OK`**

```json
{
  "count": 3,
  "requestedLimit": 3,
  "category": "animals",
  "facts": [
    { "id": 13, "category": "animals", "fact": "Octopuses have three hearts and blue blood...", "source": "General marine biology" },
    { "id": 16, "category": "animals", "fact": "Sea otters often hold hands while sleeping...", "source": "Monterey Bay Aquarium" },
    { "id": 18, "category": "animals", "fact": "Some turtles can absorb oxygen through their cloaca...", "source": "General herpetology" }
  ]
}
```

---

### GET /api/categories

Returns all available categories.

**Example response — `200 OK`**

```json
{
  "count": 10,
  "categories": [
    "animals", "general", "geography", "history", "human-body",
    "nature", "psychology", "science", "space", "technology"
  ]
}
```

---

### GET /api/fact/today

Returns a **deterministic** "Fact of the Day" — everyone gets the same
fact on the same calendar day (UTC), and it changes automatically at
UTC midnight. Great for a homepage widget or daily digest.

**Example response — `200 OK`**

```json
{
  "id": 47,
  "category": "nature",
  "fact": "Rainforests cover only about 6% of Earth's land but are home to more than half of its plant and animal species.",
  "source": "WWF",
  "date": "2026-09-27"
}
```

---

### GET /health

Simple uptime/health check, handy for hosting platforms and monitors.

```json
{ "status": "ok", "uptimeSeconds": 134.21 }
```

---

## Available Categories

| Category      | Description                           |
|----------------|----------------------------------------|
| `science`      | General scientific facts               |
| `space`        | Astronomy and space exploration        |
| `animals`      | Wildlife and animal behavior           |
| `technology`   | Computing and tech history             |
| `history`      | Historical events and figures          |
| `geography`    | Places, countries, and physical Earth  |
| `human-body`   | Anatomy and physiology                 |
| `nature`       | Plants, ecosystems, weather            |
| `psychology`   | Mind and behavior                      |
| `general`      | Assorted trivia that doesn't fit above |

Category values are lowercase; the API matches them case-insensitively.

---

## Error Responses

Every error follows the same JSON shape:

```json
{
  "error": {
    "status": 400,
    "message": "Unknown category \"underwater-basket-weaving\". Available categories: animals, general, geography, history, human-body, nature, psychology, science, space, technology.",
    "details": { "availableCategories": ["animals", "general", "..."] }
  }
}
```

| Status | Meaning                                             |
|--------|------------------------------------------------------|
| `400`  | Invalid query parameter (bad `limit` or `category`)  |
| `404`  | Route not found, or no facts match the request       |
| `429`  | Too many requests (rate limit exceeded)               |
| `500`  | Unexpected server error                              |

---

## Rate Limiting

To keep this a good citizen as a free public API, requests are limited
per IP address:

- **Default:** 60 requests per minute per IP
- Configurable via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MINUTES`
  environment variables
- Standard `RateLimit-*` response headers are included so clients can
  see their remaining quota
- Exceeding the limit returns `429 Too Many Requests`

---

## CORS

CORS is enabled by default for **all origins**, so the API can be
called directly from browser-based apps. Restrict it in production by
setting the `CORS_ORIGIN` environment variable to a comma-separated
list of allowed origins (see [Configuration](#configuration)).

---

## Usage Examples

### curl

```bash
# Random fact
curl https://your-api-domain.com/api/fact

# Random fact from a category
curl "https://your-api-domain.com/api/fact?category=space"

# 10 random facts
curl "https://your-api-domain.com/api/facts?limit=10"

# List categories
curl https://your-api-domain.com/api/categories

# Fact of the day
curl https://your-api-domain.com/api/fact/today
```

### JavaScript (fetch)

```javascript
// Random fact
async function getRandomFact() {
  const res = await fetch('https://your-api-domain.com/api/fact');
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error.message);
  }
  return res.json();
}

// Random fact from a specific category
async function getSpaceFact() {
  const res = await fetch('https://your-api-domain.com/api/fact?category=space');
  return res.json();
}

// Fact of the day, rendered into the page
fetch('https://your-api-domain.com/api/fact/today')
  .then((res) => res.json())
  .then((data) => {
    document.getElementById('fact-of-the-day').textContent = data.fact;
  });
```

---

## Project Structure

```
random-facts-api/
├── package.json
├── .env.example
├── README.md
└── src/
    ├── app.js                  # Express app: middleware + route wiring
    ├── server.js                # Entry point — starts the HTTP server
    ├── data/
    │   └── facts.json           # The fact dataset (no DB required)
    ├── routes/
    │   └── factRoutes.js        # Maps URLs to controller functions
    ├── controllers/
    │   └── factController.js    # Request/response handling per endpoint
    ├── services/
    │   └── factService.js       # Core logic: loading, filtering, random pick
    ├── middleware/
    │   ├── rateLimiter.js       # Per-IP rate limiting
    │   └── errorHandler.js      # Central 404 + error JSON responses
    └── utils/
        ├── validators.js        # Query-param validation (limit, category)
        └── ApiError.js          # Custom error class for clean error handling
```

This layered structure (routes → controllers → services → data) keeps
each piece replaceable. For example, swapping the JSON file for
PostgreSQL later only means rewriting `factService.js` — nothing else
needs to change.

---

## Local Setup

**Requirements:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. (Optional) copy the env example and adjust values
cp .env.example .env

# 3. Run in production mode
npm start

# ...or run with auto-restart on file changes during development
npm run dev
```

The server starts on port `3000` by default (override with `PORT`).

---

## Configuration

All configuration is via environment variables (see `.env.example`):

| Variable                     | Default | Description                                  |
|-------------------------------|---------|-----------------------------------------------|
| `PORT`                        | `3000`  | Port the server listens on                    |
| `CORS_ORIGIN`                 | `*`     | Comma-separated allowed origins, or `*`       |
| `RATE_LIMIT_MAX`              | `60`    | Max requests per IP per window                |
| `RATE_LIMIT_WINDOW_MINUTES`   | `1`     | Length of the rate-limit window, in minutes   |

---

## Roadmap / Future Expansion

The codebase is intentionally modular so these can be added without a
rewrite:

- [ ] PostgreSQL / MongoDB-backed storage (swap `factService.js`)
- [ ] API keys and per-key quotas
- [ ] User-submitted facts (with moderation queue)
- [ ] Full-text search across facts
- [ ] Tags, in addition to categories
- [ ] Difficulty levels ("easy" trivia vs. "deep cut")
- [ ] A dedicated "Weird Facts" mode/category
- [ ] Fact voting / rating
- [ ] Usage analytics
- [ ] A public API status/usage dashboard

---

## License

MIT — free to use in personal or commercial projects.

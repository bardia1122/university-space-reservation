# University Spaces — Backend API Specification

This document describes **every endpoint the frontend expects from the backend**. It is
derived directly from the frontend API client (`src/api/*.ts`) and the shared TypeScript
types (`src/types/index.ts`). A backend developer can implement these contracts and the
frontend will work against the real API by simply flipping `USE_MOCK = false` in
`src/api/client.ts`.

- **Base URL:** `/api/v1` (the frontend axios client uses this prefix for every request)
- **Content type:** `application/json` for all endpoints **except** login (see below)
- **Auth:** Bearer JWT in the `Authorization` header — `Authorization: Bearer <access_token>`
- **Language:** All human-readable text fields are Persian (UTF-8). Dates/times are ISO 8601.


---

## Table of contents

1. [Authentication flow](#1-authentication-flow)
2. [Conventions & error format](#2-conventions--error-format)
3. [Auth endpoints](#3-auth-endpoints)
4. [Spaces endpoints](#4-spaces-endpoints)
5. [Reservations endpoints](#5-reservations-endpoints)
6. [Ratings endpoints](#6-ratings-endpoints)
7. [Feedback endpoints](#7-feedback-endpoints)
8. [Complaints endpoints](#8-complaints-endpoints)
9. [Suggestions endpoints](#9-suggestions-endpoints)
10. [Analytics endpoints](#10-analytics-endpoints)
11. [Data models & enums](#11-data-models--enums)

---

## 1. Authentication flow

The frontend uses an **OAuth2 password flow** style login:

1. `POST /auth/login` with `application/x-www-form-urlencoded` body containing `username`
   (the email) and `password`. Returns an access/refresh token pair.
2. The frontend stores `access_token` and sends it as `Authorization: Bearer <token>` on
   every subsequent request.
3. Immediately after login the frontend calls `GET /auth/me` to load the current user.
4. On any `401 Unauthorized` response the frontend clears the token and redirects to
   `/login`. Return `401` for expired/invalid tokens so this works.

> The frontend currently does not implement refresh-token rotation, but `refresh_token`
> **must** be present in the login response (it is part of the `Token` type).

---

## 2. Conventions & error format

### Roles

`role` is one of: `student`, `organization`, `admin`, `super_admin`.
Endpoints marked **(admin)** require `admin` or `super_admin`. Endpoints marked
**(auth)** require any authenticated user. Endpoints marked **(public)** need no token.

### Pagination

The current frontend expects **plain arrays** (not paginated envelopes) for all list
endpoints. If you add pagination later, coordinate a contract change with the frontend.

### Error response

Return a JSON body with a `detail` field (FastAPI default). The frontend surfaces
`error.message`/`detail` to the user, so make messages human-readable Persian where they
are user-facing (e.g. validation, "ایمیل یا رمز عبور اشتباه است").

```json
{ "detail": "ایمیل یا رمز عبور اشتباه است" }
```

### Status codes

| Code | When |
|------|------|
| `200 OK` | Successful GET / POST action / PUT |
| `201 Created` | Resource created (POST create) — `200` is also accepted by the frontend |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Validation / business-rule failure (e.g. time conflict) |
| `401 Unauthorized` | Missing/invalid/expired token |
| `403 Forbidden` | Authenticated but insufficient role |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Reservation slot already taken (recommended) |

---

## 3. Auth endpoints

### POST `/auth/login` — (public)

Login and obtain tokens.

- **Content-Type:** `application/x-www-form-urlencoded`
- **Body fields:**

| field | type | required | notes |
|-------|------|----------|-------|
| `username` | string | yes | the user's **email** |
| `password` | string | yes | |

**Response `200`** — [`Token`](#token):
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer"
}
```
**Errors:** `401` invalid credentials.

---

### POST `/auth/register` — (public)

Register a new account.

- **Content-Type:** `application/json`
- **Body:**

| field | type | required | notes |
|-------|------|----------|-------|
| `full_name` | string | yes | |
| `email` | string | yes | unique |
| `password` | string | yes | min 8 chars (enforced on the client too) |
| `student_id` | string | no | for students |
| `department` | string | no | |
| `phone` | string | no | |
| `role` | string | no | `student` (default) or `organization`. Never allow self-registration as `admin`/`super_admin`. |

**Response `201`** — [`User`](#user) (newly created; `is_verified` typically `false`).
**Errors:** `400` email already registered.

---

### GET `/auth/me` — (auth)

Return the currently authenticated user.

**Response `200`** — [`User`](#user).

---

## 4. Spaces endpoints

### GET `/spaces` — (public)

List spaces. Used by the public homepage and the student/admin space lists.

- **Query params (all optional):**

| param | type | notes |
|-------|------|-------|
| `space_type` | [`SpaceType`](#spacetype) | filter by type |
| `status` | [`SpaceStatus`](#spacestatus) | filter by status |

**Response `200`** — array of [`Space`](#space).

> The public homepage and the student spaces page only display spaces with
> `status === "active"` (filtered client-side), but the admin list shows all statuses.

---

### GET `/spaces/{id}` — (public)

Get a single space by id.

**Response `200`** — [`Space`](#space). **Errors:** `404`.

---

### POST `/spaces` — (admin)

Create a space.

- **Body** (subset of [`Space`](#space)):

| field | type | required |
|-------|------|----------|
| `name` | string | yes |
| `name_en` | string | no |
| `space_type` | [`SpaceType`](#spacetype) | yes |
| `description` | string | no |
| `capacity` | number | no |
| `location` | string | no |
| `floor` | string | no |
| `building` | string | no |
| `status` | [`SpaceStatus`](#spacestatus) | no (default `active`) |
| `amenities` | string[] | no |
| `rules` | string | no |
| `image_url` | string | no |
| `requires_admin_approval` | boolean | no (default `true`) |
| `advance_booking_days` | number | no |
| `min_advance_hours` | number | no |

**Response `201`** — created [`Space`](#space). The server sets `id`, `avg_rating` (0),
`total_ratings` (0), `created_at`.

---

### PUT `/spaces/{id}` — (admin)

Update a space. The frontend sends a partial object; treat all fields as optional. The
edit form currently sends: `name`, `description`, `capacity`, `status`, `rules`,
`amenities`.

**Response `200`** — updated [`Space`](#space). **Errors:** `404`.

---

### DELETE `/spaces/{id}` — (admin)

Delete a space.

**Response `204`**. **Errors:** `404`.

---

## 5. Reservations endpoints

### POST `/reservations` — (auth)

Create a reservation request. The authenticated user becomes the owner (`user_id` is taken
from the token — do **not** trust a client-supplied user id).

- **Body** — [`ReservationCreate`](#reservationcreate):

| field | type | required | notes |
|-------|------|----------|-------|
| `space_id` | number | yes | |
| `reservation_date` | string (`YYYY-MM-DD`) | yes | |
| `start_time` | string (`HH:MM:SS`) | yes | client sends seconds-precision |
| `end_time` | string (`HH:MM:SS`) | yes | |
| `activity_type` | [`ActivityType`](#activitytype) | yes | |
| `activity_title` | string | yes | |
| `activity_description` | string | no | |
| `expected_attendees` | number | no | should not exceed space capacity |
| `organization_name` | string | no | |

**Response `201`** — created [`Reservation`](#reservation) with `status: "pending"`.

**Business rules to enforce server-side:**
- Reject if the slot overlaps an existing `pending`/`approved` reservation for the same
  space (`409` recommended).
- Honor the space's `min_advance_hours` and `advance_booking_days`.
- `end_time` must be after `start_time`.

---

### GET `/reservations/my` — (auth)

List the current user's reservations.

- **Query:** `status` (optional, [`ReservationStatus`](#reservationstatus)).

**Response `200`** — array of [`Reservation`](#reservation). Each item **should embed** the
related `space` object (the dashboard renders `r.space?.name`).

---

### GET `/reservations` — (admin)

List all reservations.

- **Query (optional):** `status` [`ReservationStatus`](#reservationstatus), `space_id` number.

**Response `200`** — array of [`Reservation`](#reservation). Each item **should embed**
`user` and `space` (the admin tables render `r.user?.full_name` and `r.space?.name`).

---

### GET `/reservations/{id}` — (auth)

Get a single reservation (owner or admin).

**Response `200`** — [`Reservation`](#reservation). **Errors:** `404`, `403`.

---

### POST `/reservations/{id}/cancel` — (auth)

Cancel a reservation (owner). Sets `status` to `cancelled`.

**Response `200`** — updated [`Reservation`](#reservation).

---

### POST `/reservations/{id}/review` — (admin)

Approve or reject a pending reservation.

- **Body:**

| field | type | required | notes |
|-------|------|----------|-------|
| `status` | `"approved"` \| `"rejected"` | yes | |
| `admin_note` | string | no | shown to the requester |

**Response `200`** — updated [`Reservation`](#reservation). **Errors:** `404`.

---

## 6. Ratings endpoints

### POST `/ratings` — (auth)

Submit a rating for a space.

- **Body** — [`RatingCreate`](#ratingcreate):

| field | type | required |
|-------|------|----------|
| `space_id` | number | yes |
| `reservation_id` | number | no |
| `overall_score` | number (1–5) | yes |
| `cleanliness_score` | number (1–5) | no |
| `equipment_score` | number (1–5) | no |
| `management_score` | number (1–5) | no |
| `comment` | string | no |

**Response `201`** — created [`Rating`](#rating). The server should recompute the space's
`avg_rating` / `total_ratings`. Optional AI fields (`sentiment`, `ai_summary`) may be added
asynchronously.

---

### GET `/ratings/space/{spaceId}` — (public)

List ratings for a space (shown on the space detail page).

**Response `200`** — array of [`Rating`](#rating); embed `user` (or omit for anonymity).

---

## 7. Feedback endpoints

### POST `/feedbacks` — (auth)

Submit free-text feedback for a space.

- **Body** — [`FeedbackCreate`](#feedbackcreate):

| field | type | required |
|-------|------|----------|
| `space_id` | number | yes |
| `reservation_id` | number | no |
| `content` | string | yes |
| `is_anonymous` | boolean | yes |

**Response `201`** — created [`Feedback`](#feedback) (`is_analyzed: false` initially). If
`is_anonymous` is true, do **not** return/attach the `user`.

---

### GET `/feedbacks/space/{spaceId}` — (public)

List feedback for a space.

**Response `200`** — array of [`Feedback`](#feedback). AI fields (`sentiment`,
`sentiment_score`, `keywords`, `ai_summary`) populated when analysis has run.

---

## 8. Complaints endpoints

### POST `/complaints` — (auth)

File a complaint.

- **Body** — [`ComplaintCreate`](#complaintcreate):

| field | type | required | notes |
|-------|------|----------|-------|
| `space_id` | number | no | complaint may be space-specific or general |
| `reservation_id` | number | no | |
| `category` | string | yes | e.g. `noise`, `equipment`, `management`, `cleanliness`, `safety`, `other` |
| `title` | string | yes | |
| `description` | string | yes | |
| `is_anonymous` | boolean | yes | |

**Response `201`** — created [`Complaint`](#complaint) (`status: "open"`, `priority` default 1).

---

### GET `/complaints/my` — (auth)

List the current user's complaints.

**Response `200`** — array of [`Complaint`](#complaint).

---

### GET `/complaints` — (admin)

List all complaints.

- **Query:** `status` (optional: `open` | `in_progress` | `resolved` | `closed`).

**Response `200`** — array of [`Complaint`](#complaint); embed `user` (unless anonymous).

---

### POST `/complaints/{id}/respond` — (admin)

Respond to / update the status of a complaint.

- **Body:**

| field | type | required |
|-------|------|----------|
| `admin_response` | string | yes |
| `status` | `in_progress` \| `resolved` \| `closed` | yes |

**Response `200`** — updated [`Complaint`](#complaint) with `responded_at` set.

---

## 9. Suggestions endpoints

### POST `/suggestions` — (auth)

Create a suggestion.

- **Body** — [`SuggestionCreate`](#suggestioncreate):

| field | type | required |
|-------|------|----------|
| `title` | string | yes |
| `description` | string | yes |
| `category` | string | no |

**Response `201`** — created [`Suggestion`](#suggestion) (`upvotes: 0`, `status: "pending"`).

---

### GET `/suggestions` — (auth)

List suggestions. The frontend sorts by `ai_priority_score` desc and also surfaces a
"most upvoted" list, so returning `upvotes` and `ai_priority_score` is important.

- **Query:** `status` (optional).

**Response `200`** — array of [`Suggestion`](#suggestion).

---

### POST `/suggestions/{id}/upvote` — (auth)

Upvote a suggestion. Should be idempotent per user (one vote per user).

**Response `200`** — updated [`Suggestion`](#suggestion) with incremented `upvotes`.

---

## 10. Analytics endpoints

### GET `/analytics/dashboard` — (admin)

Aggregate stats for the admin dashboard.

**Response `200`** — [`DashboardStats`](#dashboardstats):
```json
{
  "total_reservations": 6,
  "pending_reservations": 2,
  "approved_reservations": 2,
  "total_users": 4,
  "total_spaces": 10,
  "open_complaints": 1,
  "avg_rating": 4.3
}
```

---

### GET `/analytics/spaces/usage` — (admin)

Per-space usage breakdown (drives the dashboard bar chart).

**Response `200`** — array of [`SpaceUsageStats`](#spaceusagestats):
```json
[
  {
    "space_id": 2,
    "space_name": "زمین فوتسال شماره ۱",
    "total_reservations": 12,
    "approved_count": 9,
    "rejected_count": 1,
    "avg_rating": 4.5
  }
]
```

---

### GET `/analytics/reservations/calendar` — (admin)

Reservations for a given month, used to render an availability calendar.

- **Query:** `year` (number, required), `month` (1–12, required), `space_id` (optional).

**Response `200`** — array of calendar events (only `pending`/`approved` need be returned):
```json
[
  {
    "date": "2026-06-05",
    "start_time": "10:00:00",
    "end_time": "12:00:00",
    "status": "pending",
    "title": "تمرین تیم فوتسال دانشکده",
    "space_name": "زمین فوتسال شماره ۱"
  }
]
```

---

## 11. Data models & enums

All field names below match the frontend TypeScript types exactly. Optional fields may be
omitted or `null`.

### Enums

#### `UserRole`
`student` | `organization` | `admin` | `super_admin`

#### `SpaceType`
`football_field` | `futsal_field` | `cultural_plaza` | `seminar_hall` | `conference_hall` | `exhibition_booth` | `festival_booth`

#### `SpaceStatus`
`active` | `maintenance` | `inactive`

#### `ReservationStatus`
`pending` | `approved` | `rejected` | `cancelled` | `completed` | `expired`

#### `ActivityType`
`sports` | `cultural` | `educational` | `conference` | `exhibition` | `festival` | `other`

---

### `User`
```ts
{
  id: number;
  full_name: string;
  email: string;
  student_id?: string;
  phone?: string;
  department?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;   // ISO 8601
}
```

### `Token`
```ts
{ access_token: string; refresh_token: string; token_type: string; }
```

### `Space`
```ts
{
  id: number;
  name: string;
  name_en?: string;
  space_type: SpaceType;
  description?: string;
  capacity?: number;
  location?: string;
  floor?: string;
  building?: string;
  status: SpaceStatus;
  amenities?: string[];
  rules?: string;
  image_url?: string;          // absolute or relative URL to a photo
  avg_rating: number;          // 0 when no ratings
  total_ratings: number;
  requires_admin_approval: boolean;
  advance_booking_days: number;
  min_advance_hours: number;
  created_at: string;
}
```
> **Note on images:** if `image_url` is empty the frontend falls back to a built-in
> per-type illustration (`/spaces/<space_type>.svg`). Supplying a real `image_url` is
> optional but recommended.

### `Reservation`
```ts
{
  id: number;
  user_id: number;
  space_id: number;
  reservation_date: string;    // YYYY-MM-DD
  start_time: string;          // HH:MM:SS
  end_time: string;            // HH:MM:SS
  activity_type: ActivityType;
  activity_title: string;
  activity_description?: string;
  expected_attendees?: number;
  organization_name?: string;
  status: ReservationStatus;
  admin_note?: string;
  created_at: string;
  user?: User;                 // embed on admin list endpoints
  space?: Space;               // embed on list endpoints
}
```

#### `ReservationCreate`
```ts
{
  space_id: number;
  reservation_date: string;
  start_time: string;
  end_time: string;
  activity_type: ActivityType;
  activity_title: string;
  activity_description?: string;
  expected_attendees?: number;
  organization_name?: string;
}
```

### `Rating`
```ts
{
  id: number;
  space_id: number;
  reservation_id?: number;
  overall_score: number;
  cleanliness_score?: number;
  equipment_score?: number;
  management_score?: number;
  comment?: string;
  sentiment?: string;          // AI, optional
  ai_summary?: string;         // AI, optional
  created_at: string;
  user?: User;
}
```

#### `RatingCreate`
```ts
{
  space_id: number;
  reservation_id?: number;
  overall_score: number;
  cleanliness_score?: number;
  equipment_score?: number;
  management_score?: number;
  comment?: string;
}
```

### `Feedback`
```ts
{
  id: number;
  space_id: number;
  reservation_id?: number;
  content: string;
  is_anonymous: boolean;
  sentiment?: string;          // AI
  sentiment_score?: number;    // AI
  keywords?: string;           // AI (comma/، separated)
  ai_summary?: string;         // AI
  is_analyzed: boolean;
  created_at: string;
  user?: User;                 // omit when is_anonymous
}
```

#### `FeedbackCreate`
```ts
{ space_id: number; reservation_id?: number; content: string; is_anonymous: boolean; }
```

### `Complaint`
```ts
{
  id: number;
  space_id?: number;
  reservation_id?: number;
  category: string;
  title: string;
  description: string;
  is_anonymous: boolean;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: number;            // 1=low .. 4=critical (frontend buckets it)
  admin_response?: string;
  responded_at?: string;
  sentiment?: string;          // AI
  ai_analysis?: string;        // AI
  created_at: string;
  user?: User;
}
```

#### `ComplaintCreate`
```ts
{
  space_id?: number;
  reservation_id?: number;
  category: string;
  title: string;
  description: string;
  is_anonymous: boolean;
}
```

### `Suggestion`
```ts
{
  id: number;
  title: string;
  description: string;
  category?: string;
  upvotes: number;
  status: "pending" | "under_review" | "approved" | "rejected" | "implemented";
  ai_priority_score?: number;  // 0..1, AI
  ai_summary?: string;         // AI
  created_at: string;
  user?: User;
}
```

#### `SuggestionCreate`
```ts
{ title: string; description: string; category?: string; }
```

### `DashboardStats`
```ts
{
  total_reservations: number;
  pending_reservations: number;
  approved_reservations: number;
  total_users: number;
  total_spaces: number;
  open_complaints: number;
  avg_rating: number;
}
```

### `SpaceUsageStats`
```ts
{
  space_id: number;
  space_name: string;
  total_reservations: number;
  approved_count: number;
  rejected_count: number;
  avg_rating: number;
}
```

---

## Endpoint quick reference

| Method | Path | Access | Purpose |
|--------|------|--------|---------|
| POST | `/auth/login` | public | Login (form-urlencoded) |
| POST | `/auth/register` | public | Register |
| GET | `/auth/me` | auth | Current user |
| GET | `/spaces` | public | List spaces (`space_type`, `status`) |
| GET | `/spaces/{id}` | public | Space detail |
| POST | `/spaces` | admin | Create space |
| PUT | `/spaces/{id}` | admin | Update space |
| DELETE | `/spaces/{id}` | admin | Delete space |
| POST | `/reservations` | auth | Create reservation |
| GET | `/reservations/my` | auth | My reservations (`status`) |
| GET | `/reservations` | admin | All reservations (`status`, `space_id`) |
| GET | `/reservations/{id}` | auth | Reservation detail |
| POST | `/reservations/{id}/cancel` | auth | Cancel |
| POST | `/reservations/{id}/review` | admin | Approve/reject |
| POST | `/ratings` | auth | Create rating |
| GET | `/ratings/space/{spaceId}` | public | Ratings for space |
| POST | `/feedbacks` | auth | Create feedback |
| GET | `/feedbacks/space/{spaceId}` | public | Feedback for space |
| POST | `/complaints` | auth | Create complaint |
| GET | `/complaints/my` | auth | My complaints |
| GET | `/complaints` | admin | All complaints (`status`) |
| POST | `/complaints/{id}/respond` | admin | Respond to complaint |
| POST | `/suggestions` | auth | Create suggestion |
| GET | `/suggestions` | auth | List suggestions (`status`) |
| POST | `/suggestions/{id}/upvote` | auth | Upvote |
| GET | `/analytics/dashboard` | admin | Dashboard stats |
| GET | `/analytics/spaces/usage` | admin | Per-space usage |
| GET | `/analytics/reservations/calendar` | admin | Month calendar (`year`, `month`, `space_id`) |

---

### Switching the frontend from mock to live API

In `src/api/client.ts` set:
```ts
export const USE_MOCK = false;
```
Every `*.ts` file under `src/api/` already contains the real axios call paths shown above
behind that flag, so no other frontend change is required once the backend implements
these contracts.

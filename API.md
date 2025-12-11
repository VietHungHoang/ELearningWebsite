# Instructor Approval API

**Response Format:** All endpoints return `ApiResponse<boolean>` - `data: true` on success, `data: false` on failure

**Note:** UI only needs success/failure boolean for state updates and navigation. Detailed audit information can be implemented separately if needed.

## Approve Instructor Request

**Endpoint:** `POST /v1/admin/tutors/{tutorId}/approve`

**Request Body:**

```json
{
  "levels": ["BEG", "JNR", "SNR"]
}
```

**Response:**

```json
{
  "status": 200,
  "success": true,
  "data": true,
  "message": "Instructor approved successfully"
}
```

**Note:** FE uses `getLevelLabelByCodes()` function to convert level codes to display labels on UI.

## Reject Instructor Request

**Endpoint:** `POST /v1/admin/tutors/{tutorId}/reject`

**Request Body:**

```json
{
  "reason": "Missing required certifications"
}
```

**Response:**

```json
{
  "status": 200,
  "success": true,
  "data": true,
  "message": "Instructor request rejected"
}
```

## Request Edit Instructor Request

**Endpoint:** `POST /v1/admin/tutors/{tutorId}/request-edit`

**Request Body:**

```json
{
  "reason": "Please update your profile picture and add more certifications"
}
```

**Response:**

```json
{
  "status": 200,
  "success": true,
  "data": true,
  "message": "Edit request sent successfully"
}
```

**Implementation:** FE calls API and updates local state on success, with fallback to mock data on API failure. Only success/failure boolean is needed for UI updates and navigation.

## Level Codes Reference

- `BEG`: Beginner (Under 1 year)
- `JNR`: Junior (1-3 years)
- `SNR`: Senior (Over 3 years)
- `MST`: Master (Master's Degree)
- `PRO`: Professional (Certified Expert)

---

# Dashboard APIs

**Base URL:** `/api/dashboard`

**Response Format:** All endpoints return `ApiResponse<T>` where T is the data type.

**Fallback Strategy:** All dashboard APIs have mock data fallback when API calls fail.

## Get Dashboard Summary

**Endpoint:** `GET /api/dashboard/summary`

**Response:**

```json
{
  "success": true,
  "data": {
    "pendingApprovals": {
      "total": 25,
      "pending": 8,
      "approved": 15,
      "rejected": 2,
      "percentage": 32
    },
    "topInstructors": [
      {
        "id": 1,
        "name": "Nguyễn Văn A",
        "rating": 4.9,
        "revenue": 150000000,
        "totalBookings": 245,
        "image": "images/users/user13.jpg"
      }
    ],
    "recentBookings": [
      {
        "id": "1",
        "learnerName": "Sarah Johnson",
        "instructorName": "Oliver Khan",
        "subject": "English Conversation",
        "status": "Completed",
        "type": "1-1",
        "learnerAvatar": "images/users/user11.jpg",
        "instructorAvatar": "images/users/user6.jpg",
        "date": "Dec 11, 2025",
        "time": "2:00 PM - 3:00 PM"
      }
    ]
  }
}
```

## Get Top Instructors

**Endpoint:** `GET /api/dashboard/top-instructors-full`

**Query Parameters:**
- `criteria`: `revenue` | `rating` | `bookings` (default: `revenue`)
- `period`: `week` | `month` | `year` | `all` (default: `month`)
- `limit`: number (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nguyễn Văn A",
      "rating": 4.9,
      "revenue": 150000000,
      "totalBookings": 245,
      "image": "images/users/user13.jpg",
      "rank": 1,
      "hours": 120
    }
  ]
}
```

## Get Recent Bookings

**Endpoint:** `GET /api/dashboard/recent-bookings-full`

**Query Parameters:**
- `limit`: number (default: 20)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "learnerName": "Sarah Johnson",
      "instructorName": "Oliver Khan",
      "subject": "English Conversation",
      "status": "Completed",
      "type": "1-1",
      "learnerCount": 1,
      "learnerAvatar": "images/users/user11.jpg",
      "instructorAvatar": "images/users/user6.jpg",
      "date": "Dec 11, 2025",
      "time": "2:00 PM - 3:00 PM"
    }
  ]
}
```

## Get Popular Subjects

**Endpoint:** `GET /api/dashboard/popular-subjects`

**Query Parameters:**
- `period`: `week` | `month` | `year` | `all` (default: `month`)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "subject": "English",
      "instructors": 12,
      "studentCount": 245
    },
    {
      "subject": "Spanish",
      "instructors": 18,
      "studentCount": 189
    }
  ]
}
```

## Get Pending Approvals

**Endpoint:** `GET /api/dashboard/pending-approvals`

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 25,
    "pending": 8,
    "approved": 15,
    "rejected": 2,
    "percentage": 32
  }
}
```

## Error Response Format

```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "error": "Detailed error information"
}
```



# OpsCentral - Streamlined SOP Platform

A centralised hub that transforms how product managers handle internal workflows, Process Flows, and real-time updates.

## Features

### Booking System
- **International Timezone Support**: Users can select from common IANA timezones
- **7-Day Availability**: Shows next 7 calendar days with hourly slots from 09:00-17:00
- **Smart Collision Detection**: Prevents double-booking using UTC normalization
- **Pain Points Questionnaire**: 5 optional questions to help prepare demos
- **GDPR Compliance**: Required consent checkbox for data processing

### Timezone Handling
- **Browser Detection**: Automatically detects user's timezone, defaults to Europe/London
- **UTC Storage**: All bookings stored with `utc_start` for collision checking
- **Local Display**: Times shown in user's selected timezone
- **Calendar Integration**: ICS attachments and Google Calendar links respect timezone

### Email Confirmations
- **Dual Time Display**: Shows both local time and UTC equivalent
- **Process Flows Included**: User responses included in confirmation emails
- **Team Notifications**: Internal team receives copy with all booking details
- **Calendar Attachments**: ICS files with proper timezone information

### Data Structure
Bookings are stored with:
- `utc_start`: ISO string for collision detection
- `timezone_selected`: IANA timezone string
- `duration_minutes`: Always 30 for demos
- `pain_points`: Object containing optional questionnaire responses

### Collision Prevention
Slots are considered taken if another booking has the same `utc_start`, regardless of the user's chosen timezone. This ensures no double-booking across different timezones.

## Environment Variables

```env
# Email Configuration
EMAIL_PROVIDER=resend
EMAIL_API_KEY=your_email_api_key_here
EMAIL_FROM=hello@opscentral.com
BOOKINGS_NOTIFY=team@opscentral.com

# Application Configuration
VITE_APP_URL=http://localhost:5173
```

## Development

```bash
npm install
npm run dev
```

## Tech Stack
- React + TypeScript
- Tailwind CSS
- React Router
- Vite
- Lucide React (icons)

# Megumi Massaje

A modern, responsive single-page application for a massage and wellness center, built with React, Vite, and Supabase.

## Features

-   **Multilingual Support**: English, Spanish, Russian, Ukrainian, Catalan, and Valencian.
-   **Service Showcase**: Interactive sliders and detailed descriptions for various massage therapies.
-   **Booking System**: Integrated booking form with email notifications (via Supabase).
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
-   **Offline/Mock Mode**: The application is designed to function gracefully even without a backend connection.

## Offline / Demo Mode

If Supabase credentials are not configured (e.g., during local development without a `.env` file, or if the backend is unreachable), the application automatically switches to **Offline Mode**:

1.  **Services**: Service data is loaded from a local fallback file (`src/data/services.js`), ensuring the portfolio is always visible.
2.  **Booking**: The booking form remains interactive. Submitting a booking will simulate a success message and log the reservation details to the browser's developer console instead of saving to the database.
    -   *Look for the "Offline fallback active" notice in the booking modal.*

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/megumi_massaje.git
    cd megumi_massaje
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Local Development

Start the development server:

```bash
npm run dev
```

### Building for Production

Build the project for deployment:

```bash
npm run build
```

The output will be in the `dist` directory.

## Backend Setup (Supabase)

To enable the full booking functionality, you need to configure a Supabase project.

👉 See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions on setting up the database and environment variables.

## Admin Guide

To access the administrative panel:
1.  Navigate to `/admin` (e.g., `http://localhost:5173/admin` or `https://megumi-joy.github.io/megumi_massaje/admin`).
2.  Enter the PIN: **1234** (Default for MVP).

### Features
-   **Bookings**: View upcoming appointments in Sitges and Murcia.
-   **Manage Events**: Create, list, and delete events (games, classes, meetings).
-   **Services**: View current service list (editing coming soon).

## Roadmap & Future Improvements

Here are some ideas to further enhance the platform:

-   [ ] **User Accounts**: Allow users to sign up, view their booking history, and manage preferences.
-   [ ] **Online Payments**: Integrate Stripe or PayPal for deposit payments or full booking prepayments.
-   [ ] **Advanced Booking Slots**: Sync with a real calendar (Google Calendar) to show only available time slots.
-   [ ] **Blog / Articles**: A section for health tips, massage benefits, and community stories.
-   [ ] **Gift Cards**: Ability to purchase and redeem digital gift cards.
-   [ ] **Loyalty Program**: Digital punch card (e.g., "Buy 10 massages, get 1 free").


## Customizing Booking Limit

You can adjust how far in the future clients can book appointments by modifying the following constant:

- **File**: `src/components/BookingModal.jsx`
- **Constant**: `BOOKING_LIMIT_MONTHS`
- **Default**: `3` (Allows booking up to 3 months from the current date)

Simply change the numerical value (e.g., to `6` for half a year) and save the file. The calendar will automatically update its navigation limits and display a hint to the user.

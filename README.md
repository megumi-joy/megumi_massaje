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

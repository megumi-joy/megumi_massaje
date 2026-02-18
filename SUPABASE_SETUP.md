# Megumi Massaje - Supabase Configuration

To enable the booking system and dynamic services, you need to configure your Supabase credentials.

### 1. Local Development
Create a file named `.env` in the root of the project and add the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. GitHub Pages (Production)
Since you are using GitHub Actions for deployment, you must add these variables as **Repository Secrets**:

1.  Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2.  Click **New repository secret**.
3.  Add `VITE_SUPABASE_URL`.
4.  Add `VITE_SUPABASE_ANON_KEY`.

### 3. Database Schema
Your Supabase project should have the following tables:

#### `appointments`
- `id`: uuid (primary key)
- `name`: text
- `phone`: text
- `date`: date
- `time`: text
- `location`: text
- `notes`: text
- `service_id`: text
- `service_name`: text
- `created_at`: timestamp with time zone (default: now())

#### `services`
- `id`: uuid (primary key)
- `category`: text
- `category_title`: jsonb (e.g., `{"en": "Massages", "es": "Masajes"}`)
- `name`: jsonb (e.g., `{"en": "Thai Oil", "es": "Aceite Tailandés"}`)
- `description`: jsonb
- `duration`: text
- `price`: integer
- `order`: integer

#### `events`
- `id`: uuid (primary key, default: gen_random_uuid())
- `title`: text
- `description`: text
- `date`: timestamp with time zone
- `location`: text
- `type`: text (e.g., 'game', 'class', 'meeting')
- `price`: integer
- `max_participants`: integer
- `created_at`: timestamp with time zone (default: now())

#### `event_registrations`
- `id`: uuid (primary key, default: gen_random_uuid())
- `event_id`: uuid (foreign key references events.id)
- `user_email`: text
- `user_name`: text
- `user_name`: text
- `status`: text (default: 'registered')
- `created_at`: timestamp with time zone (default: now())

#### `profiles` (New)
- `id`: uuid (primary key, references auth.users.id)
- `full_name`: text
- `phone`: text
- `avatar_url`: text
- `updated_at`: timestamp with time zone

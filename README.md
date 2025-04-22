### Version History

#### v2.0.0 - Prototype 2
- Added course conditions filters
- Enhanced performance metrics
- Improved proximity weights
- Added fantasy golf optimizer
- Implemented modular store architecture

#### v1.0.0 - Prototype 1
- Initial release
- Basic golf analytics features
- Strokes gained analysis
- Matchup and three-ball tools

# SharpSide Golf Analytics

## Version 2.0.0 - Prototype 2

SharpSide Golf Analytics is a comprehensive golf betting and analysis platform that helps users make data-driven decisions for golf betting and fantasy golf.

---

### Features

- Strokes Gained Statistics
- Basic player rankings
- Model Dashboard
- Matchup Tool
- 3-Ball Tool
- Historical performance data
- Expert Insights
- AI Caddie
- Course Fit Tool
- Advanced analytics
- Priority support

---

### Environment Variables

Create a `.env.local` or `.env` file in the project root and define the following variables (prefix all client‑side keys with `VITE_` and server-side with no `VITE_` prefix):

```env
# ──────────────────────────────────────────────────────────────────────────────
# Supabase (public, client‑side)
# ──────────────────────────────────────────────────────────────────────────────
VITE_SUPABASE_URL=https://skpzfhljjsysmzyrtnho.supabase.co
#SUPABASE=https://skpzfhljjsysmzyrtnho.supabase.co
VITE_SUPABASE_ANON_KEY=current_anon_key
#SUPABASE_JWT_SECRET=current_JWT_key

# Supabase admin
#SUPABASE_SERVICE_ROLE_KEY=current_service_role_key

# ──────────────────────────────────────────────────────────────────────────────
# DataGolf API (public, client‑side)
# ──────────────────────────────────────────────────────────────────────────────
DG_API_URL=https://feeds.datagolf.com
DG_API_KEY=current_DGI_key

# ──────────────────────────────────────────────────────────────────────────────
# Stripe (public, client‑side)
# ──────────────────────────────────────────────────────────────────────────────
#STRIPE_SECRET_KEY=your_secret_key # this is from Stripe API go to Developers -> API keys 
#STRIPE_WEBHOOK_SECRET=your_secret_key # this is from Stripe API go to Developers -> API keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51QXv40Rt07jBVKNEGjSOwmj6jb7BLZ3UVFpG23H6V6TFne6QwJbLk6mJdDvxHPrtsBlMHsoAoHwP1gCrCH6Y9lvs00ts7Pxjj4
#VITE_STRIPE_BASIC_PRODUCT_ID=prod_S0NSp89wOV3PFN
#VITE_STRIPE_PRO_PRODUCT_ID=prod_S0NSthgQ06YHQh

# Stripe Price IDs
#STRIPE_PRO_PRICE_WEEKLY_ID=price_1RFS8vRt07jBVKNEDfuNnZGG
#STRIPE_PRO_PRICE_MONTHLY_ID=price_1RFS8vRt07jBVKNEswKGAwnX
#STRIPE_PRO_PRICE_YEARLY_ID=price_1RFS8vRt07jBVKNEfPOVeVVk
#STRIPE_BASIC_PRICE_WEEKLY_ID=price_1RFS69Rt07jBVKNEsHjmoYNV
#STRIPE_BASIC_PRICE_MONTHLY_ID=price_1RFS69Rt07jBVKNEw1qdb7mP
#STRIPE_BASIC_PRICE_YEARLY_ID=price_1RFS69Rt07jBVKNEv99SB8Oo
```

> **Note:** Client code will only see keys prefixed with `VITE_`. Serverless functions rely on the unprefixed secrets.

---

${VERSION.features.map(feature => `- ${feature}`).join('\n')}

### Getting Started if on a macOS

1. Install Homebrew (macOS package manager)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Use Homebrew to install Node.js (which includes npm)

```bash
brew install node
```

3. Install project dependencies

```bash
npm install
```

4. Set up your environment variables
5. Start the development server

```bash
npm run dev
```

   This command now launches both the Vite client (at `http://localhost:5173`) and the Vercel API server (at `http://localhost:3000`) concurrently.

3. **Open your browser** and navigate to `http://localhost:5173` to view the application.

---

### Getting Started if on PC

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development environment**
   ```bash
   npm run dev
   ```

   This command now launches both the Vite client (at `http://localhost:5173`) and the Vercel API server (at `http://localhost:3000`) concurrently.

3. **Open your browser** and navigate to `http://localhost:5173` to view the application.

---

### Building for Production

1. Build the static site:
   ```bash
   npm run build
   ```
   This outputs the optimized files to the `dist/` directory.

2. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

### Deployment

The project is configured for Vercel:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Rewrites:**
  - `/api/*` → serverless functions
  - `/*` → `index.html` for SPA routing

Ensure your Vercel environment variables match the `.env` entries above.

---

### Architecture

- **React + TypeScript** for UI
- **Vite** for fast bundling and HMR
- **Zustand** for state management
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Stripe Checkout** for subscription billing
- **Supabase** for authentication and data storage

---

### Project Structure

```
src/
├── components/      # Reusable UI components
├── features/        # Feature-specific modules
├── lib/             # API and integration utilities
├── pages/           # Route-level components
├── store/           # Zustand stores
└── types/           # TypeScript definitions

scripts/             # Build and verification scripts

public/              # Static assets

vercel.json          # Vercel deployment settings
vite.config.ts       # Vite configuration
```  

---

### Version History

#### v2.0.0 - Prototype 2
- Added course conditions filters
- Enhanced performance metrics
- Improved proximity weights
- Added fantasy golf optimizer
- Implemented modular store architecture

#### v1.0.0 - Prototype 1
- Initial release
- Basic golf analytics features
- Strokes gained analysis
- Matchup and three-ball tools


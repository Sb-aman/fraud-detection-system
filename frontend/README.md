# FraudGuard — Fraud Detection System

A modern, production-quality fraud detection dashboard built with React.js, featuring a premium banking-themed UI inspired by Razorpay, Stripe, and CRED.

## Tech Stack

- **React.js** (Vite)
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client with interceptors
- **Tailwind CSS** — Utility-first styling
- **Recharts** — Data visualization
- **Framer Motion** — Animations
- **React Hot Toast** — Notifications
- **Lucide React** — Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Demo Login

Use any valid email and a password with at least 4 characters.

```
Email: admin@fraudguard.com
Password: admin
```

## Features

- **Authentication** — Login with validation, remember me, animated card
- **Dashboard** — Stats cards, charts, recent transactions, activity feed
- **Transactions** — Filterable table with search, sort, pagination, export
- **Fraud Alerts** — Severity-based alerts with timeline and resolve action
- **Customers** — Customer cards with KYC status and risk levels
- **Analytics** — Fraud trends, risk distribution, country-wise analysis
- **Settings** — Notifications, dark mode, security, API config
- **Profile** — User profile management and password change

## Project Structure

```
src/
├── components/
│   ├── common/       # Button, Input, Modal, Loader, Badge
│   ├── layout/       # Sidebar, Topbar, Footer, DashboardLayout
│   ├── dashboard/    # StatsCard, Charts, TransactionTable, ActivityFeed
│   ├── transactions/ # Filters, Details, TransactionCard
│   ├── alerts/       # AlertCard, AlertTimeline
│   ├── customers/    # CustomerCard
│   └── analytics/    # RiskGauge, LocationMap
├── pages/            # All route pages
├── services/         # Axios API with mock data
├── context/          # AuthContext
├── hooks/            # useDebounce, useTheme, useLocalStorage
├── data/             # Mock data (100 txns, 50 customers, 20 alerts)
└── utils/            # Constants, formatters
```

## Color Palette

| Token     | Color     |
|-----------|-----------|
| Primary   | `#1E3A8A` |
| Secondary | `#2563EB` |
| Success   | `#16A34A` |
| Danger    | `#DC2626` |
| Warning   | `#F59E0B` |
| Background| `#F8FAFC` |

## License

MIT

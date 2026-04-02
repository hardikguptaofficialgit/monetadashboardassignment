# Moneta Finance Dashboard

A frontend finance dashboard built with React and Vite to help users understand income, expenses, transaction activity, and spending patterns through a clean, interactive interface.

This project was designed as a UI-focused assignment, so it uses mock data and a lightweight mock API layer instead of a real backend. The goal is to show frontend thinking, interface structure, state management, and user experience decisions.

## What It Covers

### Core Requirements

- Dashboard overview with summary cards for total balance, income, expenses, and savings rate
- Time-based visualization for monthly financial trend
- Category-based visualization for spending breakdown
- Transactions section with search, sorting, and filtering
- Frontend-only role simulation for `Viewer` and `Admin`
- Insights section with spending observations and monthly comparison
- Centralized state management using Zustand
- Responsive layouts and empty-state handling

### Optional Enhancements Included

- Dark mode
- Local persistence with Zustand `persist`
- Mock API integration using local storage and simulated network delay
- Loading animation and UI transitions
- CSV and JSON export
- Advanced transaction filtering and grouping
- Editable transactions for admin users
- Reset action for mock datasets

## Tech Stack

- React
- Vite
- Zustand
- Recharts
- Framer Motion
- Custom CSS
- Doodle Icons

## How It Works

### Role-Based UI

- `Viewer` can explore data but cannot modify transactions
- `Admin` can add, edit, and delete transactions

The role switch is intentionally frontend-only to demonstrate interface-level permissions without backend RBAC complexity.

### State Management

Zustand handles:

- transaction datasets
- active role
- filters
- sorting
- grouping
- active page
- modal state
- theme
- mock API sync state

### Mock API

The app includes a lightweight mock API service that:

- simulates delayed fetch/save behavior
- stores datasets in `localStorage`
- supports resetting to seeded mock data

This keeps the project frontend-focused while still showing how UI can behave around async data.

## Notable UI Decisions

- Warm editorial visual direction instead of a generic SaaS dashboard style
- Strong typography hierarchy for fast scanning
- Sidebar-based navigation with mobile adaptation
- Insight cards and budget planner for more storytelling beyond plain charts
- Consistent handling for empty chart or search states

## Project Structure

```text
src/
  components/
  data/
  pages/
  services/
  store/
  utils/
```

## Setup

### Install

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Assignment Mapping

### Dashboard Overview

- Summary cards in the dashboard header area
- Monthly trend chart for time-based analysis
- Spending breakdown chart for category analysis

### Transactions

- Search by text
- Filter by type
- Filter by category
- Filter by month
- Sort by date, category, or amount
- Group by month, category, or type

### Insights

- Highest spending category
- Expense trend vs previous month
- Savings rate
- Biggest expense
- Category diversity

### UX Expectations

- Works across desktop and mobile layouts
- Handles empty search results and empty chart states
- Clear visual distinction between income and expense
- Smooth transitions and a branded loading experience

## Notes

This project is intentionally frontend-only and not production-backed. The focus is on interface design, component composition, state management, and thoughtful user experience under realistic dashboard requirements.

# Project Brief: 7A-PROJECTS-SITRUNA

**Date Created:** 2025-05-20
**Version:** 1.0.0
**Primary Contact/Owner:** [Your Name/Email]

---

## 1. Project Overview

**Brief Description:**
*   A new front-end platform to host a variety of content, including standalone static HTML sites and interactive React components. This project replaces the previous "7A-PROJECT-SITRUNA" and will incorporate features like client-side authentication, collapsible table of contents, and persistent storage.

---

## 2. Goals and Objectives

*   **Main Aims:**
    *   Provide a unified platform for diverse web content.
    *   Implement basic client-side user authentication (Tier 1: Login page with hashed password).
    *   Offer a user-friendly collapsible table of contents for navigation, combining static and dynamic content.
    *   Utilize persistent storage for user preferences or application state (e.g., form inputs).
    *   Support both static HTML content (in `EXPRESS/`) and dynamic React applications (in `src/`).
    *   Integrate existing content, such as the "proposal.tsx" from the 7A-CAREER dashboard, as a page within the React app.
*   **Target Audience:**
    *   [Specify target audience - e.g., Internal team, specific client group, general public]
*   **Key Information/Functionality to Provide:**
    *   Static content hosting (e.g., documentation, simple sites in `EXPRESS/`).
    *   Interactive React components (e.g., dashboards, tools in `src/`).
    *   Content from `/Users/mitchens/Local/PAGES/DASHBOARDS/content/7A-CAREER/proposal.tsx` (as a React page).

---

## 3. Content Structure & Key Features

*   **Main Content Sections (`EXPRESS/` subdirectories for static sites):**
    *   `example-static-site` (Placeholder for initial static content)
    *   *(Add more as defined)*
*   **Main Content Sections (React application routes/features in `src/`):**
    *   `/career-proposal` (incorporating `proposal.tsx`)
    *   `/login` (for authentication)
    *   `/` (Homepage)
    *   *(Add more as defined)*
*   **Specific Interactive Elements or Visualizations:**
    *   `proposal.tsx` (React component from 7A-CAREER) - Purpose: Display career proposal information.
    *   Collapsible Table of Contents component (React).
    *   Authentication Form (React).
*   **React Component Integration Strategy:**
    *   [X] **Internal Development:** Components developed as part of this React application.

---

## 4. Data Sources (if applicable)

### Airtable Integration
*   **Environment Variable for API Key:** `SITRUNA_AIRTABLE_API_KEY`
*   **Environment Variable for Base ID:** `SITRUNA_AIRTABLE_BASE_ID`
*   **Environment Variable for Table ID:** `SITRUNA_AIRTABLE_TABLE_ID`
*   **Airtable View ID (if used):** [Specify View ID or N/A]
*   **Expected Output Data File:** `data/workflow_data.json` (or specify custom path/name)
*(Fill above if Airtable integration is planned for this specific project)*

---

## 5. Access Control

### Required Protection Level
- [X] Tier 1: Login page with hashed password (client-side protection with separate login page)

### Access Credentials
- **Password Hash Storage:** `VITE_APP_PASSWORD_HASH` in `.env.local` (Do NOT commit `.env.local`)
- **Session Storage Key for Auth Flag:** `sitruna_auth_status`

### Environment-Specific Configuration
- **Development Password:** [Choose a password, generate its SHA-256 hash, store hash in `.env.local`]
- **Production Password:** [Choose a password, generate its SHA-256 hash, store hash in `.env.production.local` or GitHub Secret for deployment]

---

## 6. Design and Branding

*   **Color Scheme:** [Primary, Secondary, Accent colors or N/A if using template defaults]
*   **Fonts:** [Specify fonts or N/A]
*   **Logo:** [Path to logo asset or N/A]
*   **Style Guide/Branding Assets Link:** [Link or N/A]

---

## 7. Deployment Configuration

### GitHub Pages
*   **Target GitHub Repository URL:** `https://github.com/[your-github-username]/PAGES` (Replace `[your-github-username]`)
*   **`homepage` value for `package.json`:** `https://[your-github-username].github.io/PAGES/7A-PROJECTS-SITRUNA/`
*   **Base URL for Vite (`vite.config.ts`):** `/PAGES/7A-PROJECTS-SITRUNA/`

---

## 8. Custom Configurations & Deviations

*   **Project-Specific Environment Variables (beyond Airtable):**
    *   `VITE_APP_TITLE`: "7A Projects Sitruna"
    *   `VITE_APP_PASSWORD_HASH`: [SHA-256 hash of your chosen password]
*   **Modifications to Standard Scripts or Template Files:**
    *   `package.json`: Added `generate-static-toc` script.
    *   `vite.config.ts`: Set `base` URL for GitHub Pages.
*   **Specific QC Checks to Emphasize:**
    *   Authentication flow (login, logout, protected routes).
    *   ToC generation and navigation for both static and React content.
    *   Persistence of user settings/state via `localStorage`.
    *   Correct linking and display of `proposal.tsx` page.

---

### Optional: User Notification System

*   **Requirement:**
    *   [X] Yes (Recommended for auth actions, data saving)
*   **If Yes, describe the types of notifications needed:**
    *   **Notification Triggers:** Login success/failure.
    *   **Message Content (Examples):**
        *   Success: "Login successful!"
        *   Error: "Invalid credentials."
    *   **Notification Types:** Simple text messages within the login form or a small toast-like component.
*   **Key actions/components requiring notifications:**
    *   Authentication: Login attempts.

---

### Optional: Client-Side Data Persistence Strategy (`localStorage`)

*   **Requirement:**
    *   [X] Yes
*   **If Yes, specify what data needs to be persisted:**
    *   **Item 1 (Authentication Status - Session based):**
        *   **`sessionStorage` Key:** `sitruna_auth_status`
        *   **Data Type / Structure:** JSON string: `{"isAuthenticated": true, "timestamp": 1678886400000}`
    *   **Item 2 (User Input - Example):**
        *   **`localStorage` Key:** `sitruna_form_field_exampleInput` (Prefix `sitruna_` + component/form name + field name)
        *   **Data Type / Structure:** String
    *   **Item 3 (Collapsible ToC State - Example):**
        *   **`localStorage` Key:** `sitruna_toc_expanded_sections`
        *   **Data Type / Structure:** Array of strings: `["section1_id", "section2_id"]`
*   **Preferred Method:**
    *   [X] `localStorage` (for persistent storage across sessions for form data, ToC state)
    *   [X] `sessionStorage` (for auth status, tied to browser session)
*   **Data Sensitivity:**
    *   [X] No (Auth status is a flag; password hash is not stored in browser)
*   **Error Handling for Storage:**
    *   Graceful degradation (feature works without persistence if storage is unavailable), console errors for developers.

## 9. Notes & To-Do

*   [X] Finalize authentication tier and implementation details (Tier 1).
*   [X] Define ToC structure and sources (Hybrid: static script + React routes).
*   [X] Set up initial static content in `EXPRESS/`.
*   [X] Integrate `proposal.tsx` into the React app structure.
*   [X] Configure deployment settings in `vite.config.ts` and `package.json`.
*   [ ] User to provide actual GitHub username for `package.json` and `vite.config.ts`.
*   [ ] User to choose a password, generate its SHA-256 hash, and store it in `.env.local` as `VITE_APP_PASSWORD_HASH`.

---

## 10. Persistence and State Management

*   **User State Persistence Requirements:**
    *   [X] Specific persistent data types: Authentication status (session), user preferences (e.g., form inputs, theme - if added), ToC state.

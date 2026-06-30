# Wobb Frontend Assignment - Influencer Discovery Solution

A modernized, high-fidelity influencer search and curation application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and **Zustand**.

**Live Demo:** [stellar-seahorse-3032b1.netlify.app](https://stellar-seahorse-3032b1.netlify.app/)

---

## Project Genesis & Evolution (Before vs. After)

### The Initial State (Static Template)
When the assignment was received, the project was a basic, static layout:
- **No Curation System:** The **"My List"** / shortlist sidebar was completely non-existent and undeveloped. Users could not select influencers, inspect their details, or build a curated list.
- **Static & Disconnected Search:** Search was simple, synchronous, and siloed. Users had to manually click through platform tabs to find influencers, and search queries couldn't parse across multiple platforms or metadata fields.
- **Rigid UI/UX:** The interface was completely static and flat. It lacked animations, brand typography, platform-specific styling cues, or interactive feedback.
- **No State Persistence:** There was no storage layer, meaning any potential action would reset upon browser reload.
- **No Test Infrastructure:** No automated unit tests or verification tools were present.

---

### The Modernized State (Dynamic Curation Platform)
I transformed the static template into a full-featured, responsive, and aesthetically stunning **Influencer Discovery & Curation Dashboard**:

- **Dynamic Shortlist Dashboard:** Built a curated lists builder via an interactive side-drawer.
- **Aggregated Search & Curation:** Filter creators across all channels or drill down to individual channels.
- **Rich Motion Layouts:** Smooth layout transitions and floating visual assets.

---

## Core Features Implemented

### 1. Newly Developed "My List" Shortlist & Curation System
- **Interactive Shortlisting:** Developed a side-drawer component that lets users curate lists of influencers. Add or remove influencers directly from their cards.
- **Zustand State Persistence:** Handled shortlist state via a Zustand store, integrated with `persist` middleware. Your selected list remains safe and persistent across page reloads.
- **Reactivity Optimization:** Used fine-grained Zustand selectors to prevent unnecessary re-renders when modifying the shortlist.
- **Shortlist Summary Metrics:** Displays real-time counts, platform badges, and visual feedback when an influencer is added to the shortlist.

### 2. Multi-Platform & Unified Search Engine
- **"All Platforms" Aggregated View:** Introduced a unified `"all"` platform view ("✨ All Platforms") combining creators from Instagram, YouTube, and TikTok in one stream.
- **Smart Query Capabilities:** Enhanced filtering to match not just names and usernames, but also biography descriptions, categories, and platform names (e.g. searching "youtube" instantly filters to YouTube creators).
- **Debounced Search Hook:** Integrated a custom `useDebounce` hook that delays query processing by `300ms`, preventing performance degradation from rapid keystroke-based filtering.

### 3. High-Fidelity UI/UX & Glassmorphism System
- **Floating Dynamic Background:** Added interactive, glowing abstract shapes floating smoothly behind the layout.
- **Glassmorphic Theme:** Leveraged Tailwind CSS 4 to design translucent cards with backdrop filters (`backdrop-blur-xl`), thin border treatments, and smooth box-shadows.
- **Platform-Specific Branding:** Tailored cards with custom brand colors, platform badges, and glowing outer outlines depending on the creator's platform (YouTube red, TikTok dark neon/cyan, Instagram pink/orange gradient).
- **Fluid Layout Animations:** Used **Framer Motion** to animate the entry list, card expansions, hover effects, and slide-in sidebar transitions.
- **Typography:** Configured Google Fonts (`Outfit` for headers and `Inter` for content) to match premium, design-forward applications.

### 4. Interactive Profile Drawer
- **Detail Slides:** Clicking any card slides out an immersive profile details page with detailed influencer stats (Engagement Rate, Average Views, Category Tags, Social Handles, and Bio).
- **In-drawer Curation:** Users can toggle the shortlist status of the influencer directly from inside the details view.

---

## Detailed Project Observations & Technical Findings

### 1. State Management & Reactivity (Zustand)
#### Observation: Destructuring Reactivity Bug
- **The Flaw:** Several components originally subscribed to the Zustand store by destructuring the hook call:
  ```tsx
  const { selectedProfiles, toggleSidebar } = useProfileStore();
  ```
- **Impact:** This pattern causes the component to re-render whenever *any* property in the store changes, even if it is completely unrelated to the component (e.g. toggling the sidebar would cause all cards to re-render).
- **The Fix:** I transitioned to fine-grained selector callbacks:
  ```tsx
  const selectedProfiles = useProfileStore(s => s.selectedProfiles);
  const toggleSidebar = useProfileStore(s => s.toggleSidebar);
  ```
  This ensures components only re-render when the specific state they listen to updates.

### 2. Code Quality & Testability
#### Observation: Lack of Automated Verification
- **The Flaw:** The project initially contained no automated testing infrastructure. This made refactoring dangerous, as changes to the profile list or filtering logic could unknowingly introduce regressions.
- **The Fix:** 
  - Integrated **Vitest** for native, fast test execution.
  - Implemented unit tests validating the Zustand store (preventing duplicate additions, removing profiles, toggling sidebar) and pure filtering logic.

---

## Technical Details

### 1. Libraries Added
To elevate the user experience, styling, reactivity, and reliability, the following packages were installed:
- **`zustand`**: Light, robust state management with middleware support to store the shortlist.
- **`framer-motion`**: Handled spring-based layout animations, hover reactions, and drawer transitions.
- **`lucide-react`**: Provided crisp, modern SVG icons for platform identification and controls.
- **`vitest` & `jsdom`**: Configured for local, lightning-fast component and unit testing.
- **`clsx` & `tailwind-merge`**: Used to safely handle dynamic styling classes without Tailwind conflicts.

### 2. Assumptions Made
- **Local Data Caching**: I assumed the influencer database is managed locally for this version of the application, meaning all search, sorting, and platform operations can be safely performed client-side.
- **Persistent Curation**: I assumed that users would expect their selected list to persist between sessions, which led to the integration of Zustand's `persist` local-storage engine.
- **Responsive Layout**: I assumed the curation dashboard must be equally usable on mobile screens and large displays, designing the sidebar as a slide-over panel on smaller viewports.

### 3. Technical Trade-offs
- **Bundle Size vs. Visual Delight**: Adding `framer-motion` slightly increases the Javascript bundle footprint. However, the visual responsiveness, micro-interactions, and premium feel it provides align perfectly with the dashboard's design goals.
- **Client-Side vs. API Filtering**: Client-side filtering allows for zero-latency, immediate results. If the database scales to thousands of entries, this would eventually require migration to paginated server-side APIs.

### 4. Remaining Improvements (Future Roadmap)
If given more time, the following features would be implemented:
- **Shortlist Exporting**: Allow users to download their curated shortlist as a CSV or PDF file for sharing.
- **Influencer Comparison Tool**: Implement a side-by-side comparison screen to compare metrics (engagement rate, follower growth, average views) between shortlisted creators.
- **Multiple Curation Folders**: Allow users to create custom shortlist groups (e.g., "Tech Campaign", "Summer Launch") instead of a single global shortlist.
- **Virtualized Grid Scrolling**: Use a virtualized list to efficiently render thousands of cards without DOM performance bottlenecks.
- **Advanced Filters**: Add sliders for follower count ranges, engagement rate thresholds, and category selector dropdowns.

---

## Commands

| Command        | Description                             |
| -------------- | --------------------------------------- |
| `npm run dev`  | Starts the Vite development server      |
| `npm run build`| Runs the production build (`tsc -b && vite build`) |
| `npm run lint` | Runs ESLint analysis                   |
| `npm run test` | Runs the Vitest test suite              |

---


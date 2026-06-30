# Wobb Frontend Assignment - Solution

A modernized influencer search application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and **Zustand**.

## Getting Started

```bash
npm install
npm run dev
```

To run the test suite:
```bash
npm run test
```

## Project Observations & Technical Findings

Based on my comprehensive review of the Wobb frontend application before and after modernization, here is a detailed log of the key technical observations and architectural findings.

### 1. State Management & Reactivity (Zustand)

#### Observation: Destructuring Reactivity Bug
In the previous implementation of the `useProfileStore` hook, several components were incorrectly subscribing to the Zustand store.
- **The Flaw:** Components like `Layout.tsx` and `SelectedProfilesSidebar.tsx` were calling the hook and destructuring the entire state object:
  ```tsx
  const { selectedProfiles, toggleSidebar } = useProfileStore();
  ```
- **Impact:** This approach caused the components to re-render whenever *any* state in the store changed (even unrelated state), rather than only when the specific properties they cared about changed. This is a common anti-pattern in Zustand usage.
- **The Fix:** Transitioning to fine-grained selector callbacks (e.g., `const selectedProfiles = useProfileStore(s => s.selectedProfiles);`) correctly limits re-renders to only occur when the explicitly selected state updates, massively improving rendering efficiency.

### 2. Performance: Search Optimization

#### Observation: Expensive Computations on Keystroke
- **The Flaw:** The search functionality was triggering the `filterProfiles` utility function synchronously on every single keystroke. For a potentially large list of influencer profiles, doing string matching and filtering on every key press can cause significant input lag and jank.
- **The Fix:** The introduction of the custom `useDebounce` hook resolves this by delaying the execution of the filtering logic until the user pauses typing for 300ms. This prevents main-thread blocking during rapid typing.

### 3. UI/UX Architecture

#### Observation: Static Interface
- **The Flaw:** The application initially featured a rigid, static interface that lacked visual hierarchy and micro-interactions, leading to an unengaging user experience.
- **The Fix:** 
  - **Framer Motion:** Integrating Framer Motion provided an immediate UX uplift through fluid layout animations, bouncy spring transitions for the sidebar, and subtle hover scale effects on the profile cards.
  - **Glassmorphism System:** Moving away from standard solid backgrounds to a translucent, blurred backdrop (`backdrop-blur-xl`) layered over dynamic gradients modernized the visual aesthetic considerably.
  - **Typography:** The shift from generic system fonts to premium Google Fonts (`Outfit` for crisp headers, `Inter` for readable body text) established a much stronger brand feel.

### 4. Code Quality & Testability

#### Observation: Lack of Automated Verification
- **The Flaw:** The project initially contained no automated testing infrastructure. This made refactoring dangerous, as changes to the profile list or filtering logic could unknowingly introduce regressions.
- **The Fix:** 
  - Adding **Vitest** provided a fast, native testing environment that works seamlessly with Vite.
  - The test suite effectively covers the Zustand store's core logic (preventing duplicate additions, removing profiles, toggling the sidebar) and the pure filtering functions, ensuring long-term stability.

### 5. Architectural Assumptions & Trade-offs

- **Zustand over Context:** The project originally seemed to hint at React Context, but moving to Zustand was the correct architectural choice for this specific use case. Zustand is lighter, doesn't require wrapping the app in provider components, and completely avoids the React Context re-render cascading issues when used with fine-grained selectors.
- **Bundle Size:** The inclusion of Framer Motion does increase the JavaScript bundle size slightly. However, given the assignment's strong emphasis on "visual delight" and premium UX, this is an acceptable trade-off for the substantial improvement in user perception.

## Commands

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run lint` | Run ESLint               |
| `npm run test` | Run Unit Tests (Vitest)  |

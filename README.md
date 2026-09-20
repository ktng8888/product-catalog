# Product catalog features
- Two-column product list showing thumbnails, titles, and prices.
- Infinite scrolling with 20 products per request.
- Product details with title, description, price, rating, and a swipeable image gallery.
- Server-side search with a 400 ms debounce.
- Loading, error with retry, empty, and success states.
- Pull-to-refresh for the catalog and search results.
- Pagination and refresh failures preserve existing products.
- Safe-area spacing for system navigation bars.

# Installation:
```bash
git clone https://github.com/ktng8888/product-catalog.git
cd product-catalog
npm ci
```

# Requirements
- Node.js 22.13 or later
- npm
- a compatible version of Expo Go
- development used Node.js 24.14.0

# How to run the app:
1. Open the project folder, and run 'npx expo start --go'
2. Open Expo Go, and scan the QR code to run the app. 
Notes:
- Make sure you are using same network/WiFi/hotspot for both of your laptop and phone to ensure the app can run on Expo go
- Also, the app can run in Android emulator if it is installed in your laptop; Expo Go is just the easiest way to access to the app

# Stack used:
- React Native
- Expo SDK 57
- TypeScript
- React Navigation native stack
- React hooks and the Fetch API

# Architecture decisions:
The project separates into 2 main layers which is data and presentation layers and navigation for screen-to-screen flow management. This separation keeps HTTP requests independent (data) of UI rendering (presentation). Hooks manage request behaviour and state, allowing screens to focus on layout and user interactions.

data layer: 
- models/ : describes the product and paginated API response of products
- api/ : contains API functions that perform HTTP requests, check response status, and return data or throw errors.

presentation layer:
- hooks/ : contains custom hooks that manages loading, search, pagination, refresh, retry, and request cancellation.
- screens/: contains screens like product list screen and product detail screen, that render the current state and handle user interactions. A screen contains component(s).
- components/ : contains reusable UI components, including product cards and the swipeable image gallery.

navigation:
- navigation/ : manages the list-to-detail flow, passing the selected product ID. Called by App.tsx.

# Search box filtering products (via search endpoint)
Search uses DummyJSON’s search endpoint with a 400 ms debounce to reduce requests while typing. I chose server-side search because client-side filtering would only search the products already loaded, unless the entire catalog was downloaded first. Server-side search covers the full catalog. When the debounced query changes, pagination restarts from the first page and previous requests are cancelled.

# Anything didn't finish (Remaining Improvements):
- Add image loading placeholders and image failure fallbacks.
- Add a unit test for your data or business logic
- Verify the UI and navigation on iOS and additional screen sizes.


# AI Assistance
AI assistance was used for setup guidance, debugging, and code review. 

It also provided implementation snippets or some syntax for API requests, custom hooks, search, pagination, refresh, error handling, and UI components.

Codex also directly installed navigation dependencies, connected the list and detail screens and made some styling changes.
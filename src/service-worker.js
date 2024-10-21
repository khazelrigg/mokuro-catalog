/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for each deployment
const CACHE = `cache-${version}`;

// Assets to cache: includes built assets and static files
const ASSETS = [
  ...build, // Application's built JS/CSS files
  ...files  // All static files from the `static` directory
];

// Install event: Runs when the service worker is first installed
self.addEventListener('install', (event) => {
  // Add all necessary files to the cache
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  // Ensure the cache operation completes before marking installation as complete
  event.waitUntil(addFilesToCache());
});

// Activate event: Runs when the service worker is activated (e.g., after an update)
self.addEventListener('activate', (event) => {
  // Remove old caches from previous deployments
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
});

// Fetch event: Intercept all fetch requests
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests (like POST)
  if (event.request.method !== 'GET') return;

  // Handle the request, preferring the cache but falling back to the network
  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // Serve assets from cache if they are part of the build or static files
    if (ASSETS.includes(url.pathname)) {
      return cache.match(url.pathname);
    }

    // For other requests, try the network first, fallback to cache if offline
    try {
      const response = await fetch(event.request);
      if (response.status === 200) {
        cache.put(event.request, response.clone()); // Store response in cache
      }
      return response;
    } catch {
      return cache.match(event.request); // If network fails, serve from cache
    }
  }

  event.respondWith(respond());
});

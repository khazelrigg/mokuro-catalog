import { page } from '$app/stores';  // Access the current page's state
import { db, type Catalog } from '$lib/catalog/db';  // Import database logic
import type { Volume } from '$lib/types';
import { liveQuery } from 'dexie';  // Reactively query the database
import { derived, type Readable } from 'svelte/store';  // Svelte store utilities

// Create a reactive store that updates when the catalog changes
export const catalog = liveQuery(() => db.catalog.toArray());

// Helper function to sort manga volumes by name
function sortManga(a: Volume, b: Volume) {
  if (a.volumeName < b.volumeName) return -1;
  if (a.volumeName > b.volumeName) return 1;
  return 0;
}

// Create a derived store to get the current series' manga based on the route params
export const manga = derived(
  [page, catalog as unknown as Readable<Catalog[]>],
  ([$page, $catalog]) => {
    if ($page && $catalog) {
      // Find the series by its ID and sort the volumes
      return $catalog.find((item) => item.id === $page.params.manga)?.manga.sort(sortManga);
    }
  }
);

// Create a derived store to get the specific volume based on the route params
export const volume = derived(
  [page, manga], 
  ([$page, $manga]) => {
    if ($page && $manga) {
      // Find the volume by its UUID
      return $manga.find((item) => item.mokuroData.volume_uuid === $page.params.volume);
    }
  }
);

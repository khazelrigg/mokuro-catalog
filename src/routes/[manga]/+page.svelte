<script lang="ts">
  /*
  This component displays the details of a specific manga series and its volumes, with options to delete or extract the manga.
  */
  import { catalog } from '$lib/catalog'; // Access the catalog store
  import { goto } from '$app/navigation'; // Navigate between routes
  import VolumeItem from '$lib/components/VolumeItem.svelte'; // Component for individual volumes
  import { Button, Listgroup } from 'flowbite-svelte'; // UI components from Flowbite
  import { db } from '$lib/catalog/db'; // IndexedDB access via Dexie.js
  import { promptConfirmation, zipManga } from '$lib/util'; // Utility functions
  import { page } from '$app/stores'; // Access the current route parameters
  import type { Volume } from '$lib/types'; // Type definition for volumes
  import { deleteVolume, mangaStats, volumes } from '$lib/settings'; // Settings and volume management

  // Sort the volumes alphabetically and numerically
  function sortManga(a: Volume, b: Volume) {
    return a.mokuroData.volume.localeCompare(b.mokuroData.volume, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  }

  // Reactive declaration: Get the manga series based on route parameters
  $: manga = $catalog?.find((item) => item.id === $page.params.manga)?.manga.sort(sortManga);

  $: loading = false; // Track loading state for extracting manga

  // Confirm deletion of the entire manga series
  async function confirmDelete() {
    const title = manga?.[0].mokuroData.title_uuid;

    // Delete all volumes from the manga
    manga?.forEach((vol) => {
      const volId = vol.mokuroData.volume_uuid;
      deleteVolume(volId);
    });

    // Remove the manga series from the catalog
    await db.catalog.delete(title);
    goto('/'); // Navigate back to the homepage
  }

  // Show a confirmation popup before deleting the manga
  function onDelete() {
    promptConfirmation('Are you sure you want to delete this manga?', confirmDelete);
  }

  // Extract the manga into a zip file
  async function onExtract() {
    if (manga) {
      loading = true; // Start loading
      loading = await zipManga(manga); // Extract the manga
    }
  }
</script>

<!-- Set the page's title to the manga's title -->
<svelte:head>
  <title>{manga?.[0].mokuroData.title || 'Manga'}</title>
</svelte:head>

<!-- If manga data is available, display it -->
{#if manga && $mangaStats}
  <div class="p-2 flex flex-col gap-5">
    <!-- Manga title and statistics -->
    <div class="flex flex-row justify-between">
      <div class="flex flex-col gap-2">
        <h3 class="font-bold">{manga[0].mokuroData.title}</h3>
        <div class="flex flex-col gap-0 sm:flex-row sm:gap-5">
          <p>Volumes: {$mangaStats.completed} / {manga.length}</p>
          <!-- Completed volumes -->
          <p>Characters read: {$mangaStats.chars}</p>
          <!-- Total characters read -->
          <p>Minutes read: {$mangaStats.timeReadInMinutes}</p>
          <!-- Total reading time -->
        </div>
      </div>

      <!-- Action buttons: Delete or extract manga -->
      <div class="sm:block flex-col flex gap-2">
        <Button color="alternative" on:click={onDelete}>Remove manga</Button>
        <Button color="light" on:click={onExtract} disabled={loading}>
          {loading ? 'Extracting...' : 'Extract manga'}
        </Button>
      </div>
    </div>

    <!-- List of volumes in the series -->
    <Listgroup active class="flex-1 h-full w-full">
      {#each manga as volume (volume.mokuroData.volume_uuid)}
        <VolumeItem {volume} /> <!-- Render each volume using the VolumeItem component -->
      {/each}
    </Listgroup>
  </div>
{:else}
  <!-- Show a message if the manga was not found -->
  <div class="flex justify-center p-16">Manga not found</div>
{/if}

<script lang="ts">
  // Import the catalog store (from IndexedDB via Dexie)
  import { catalog } from '$lib/catalog';

  // Import UI components from the Flowbite-Svelte library
  import { Button, Search, Listgroup } from 'flowbite-svelte';

  // Import other components used within the catalog
  import CatalogItem from './CatalogItem.svelte';
  import Loader from './Loader.svelte';
  import { GridOutline, SortOutline, ListOutline } from 'flowbite-svelte-icons';

  // Import settings and a function to update them (controls layout and sorting)
  import { miscSettings, updateMiscSetting } from '$lib/settings';

  import CatalogListItem from './CatalogListItem.svelte'; // List view of catalog items

  // Reactive variable: Automatically updates when the catalog or settings change
  $: sortedCatalog = $catalog
    ?.sort((a, b) => {
      // Sort the catalog based on the gallery sorting setting
      if ($miscSettings.gallerySorting === 'ASC') {
        return a.manga[0].mokuroData.title.localeCompare(b.manga[0].mokuroData.title);
      } else {
        return b.manga[0].mokuroData.title.localeCompare(a.manga[0].mokuroData.title);
      }
    })
    .filter((item) => {
      // Filter catalog items based on the search query
      return item.manga[0].mokuroData.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });

  let search = ''; // Search input value

  // Toggle between grid and list layout
  function onLayout() {
    if ($miscSettings.galleryLayout === 'list') {
      updateMiscSetting('galleryLayout', 'grid'); // Switch to grid view
    } else {
      updateMiscSetting('galleryLayout', 'list'); // Switch to list view
    }
  }

  // Toggle the sorting order (ascending or descending)
  function onOrder() {
    if ($miscSettings.gallerySorting === 'ASC') {
      updateMiscSetting('gallerySorting', 'DESC');
    } else {
      updateMiscSetting('gallerySorting', 'ASC');
    }
  }
</script>

<!-- If the catalog store has data, render the content -->
{#if $catalog}
  {#if $catalog.length > 0}
    <div class="flex flex-col gap-5">
      <!-- Top control bar with search input and layout/sorting buttons -->
      <div class="flex gap-1 py-2">
        <Search bind:value={search} /> <!-- Search input field -->
        
        <Button size="sm" color="alternative" on:click={onLayout}>
          <!-- Switch between list and grid icons based on current layout -->
          {#if $miscSettings.galleryLayout === 'list'}
            <GridOutline />
          {:else}
            <ListOutline />
          {/if}
        </Button>

        <Button size="sm" color="alternative" on:click={onOrder}>
          <SortOutline /> <!-- Sort icon -->
        </Button>
      </div>

      <!-- If no search results are found, display a message -->
      {#if search && sortedCatalog.length === 0}
        <div class="text-center p-20">
          <p>No results found.</p>
        </div>
      {:else}
        <!-- Render the catalog based on the selected layout (grid or list) -->
        <div class="flex sm:flex-row flex-col gap-5 flex-wrap justify-center sm:justify-start">
          {#if $miscSettings.galleryLayout === 'grid'}
            <!-- Grid layout: Display each catalog item as a grid card -->
            {#each sortedCatalog as { id } (id)}
              <CatalogItem {id} />
            {/each}
          {:else}
            <!-- List layout: Display each catalog item within a Listgroup -->
            <Listgroup active class="w-full">
              {#each sortedCatalog as { id } (id)}
                <CatalogListItem {id} />
              {/each}
            </Listgroup>
          {/if}
        </div>
      {/if}
    </div>
  {:else}
    <!-- If the catalog is empty, show an empty state message -->
    <div class="text-center p-20">
      <p>Your catalog is currently empty.</p>
    </div>
  {/if}
{:else}
  <!-- Show a loader while the catalog data is being fetched -->
  <Loader>Fetching catalog...</Loader>
{/if}

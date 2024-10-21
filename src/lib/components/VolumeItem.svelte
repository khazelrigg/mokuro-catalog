<script lang="ts">
  import { page } from '$app/stores'; // Access the current route parameters
  import { deleteVolume, progress } from '$lib/settings'; // Manage settings and progress
  import type { Volume } from '$lib/types'; // Type definition for Volume
  import { promptConfirmation } from '$lib/util'; // Utility for confirmation prompts
  import { ListgroupItem, Frame } from 'flowbite-svelte'; // UI components
  import { CheckCircleSolid, TrashBinSolid } from 'flowbite-svelte-icons'; // Icons for actions
  import { goto } from '$app/navigation'; // SvelteKit's navigation helper
  import { db } from '$lib/catalog/db'; // Access the Dexie database

  // Receive the volume object as a prop
  export let volume: Volume;

  // Destructure necessary fields from the volume
  const { volumeName, mokuroData } = volume as Volume;
  const { title_uuid, volume_uuid } = mokuroData;

  // Decode the volume name (in case it's URL-encoded)
  const volName = decodeURI(volumeName);

  // Reactive statement to track the current page's progress
  $: currentPage = $progress?.[volume_uuid || 0] || 1;

  // Display the progress in the format `currentPage / totalPages`
  $: progressDisplay = `${
    currentPage === volume.mokuroData.pages.length - 1 ? currentPage + 1 : currentPage
  } / ${volume.mokuroData.pages.length}`;

  // Check if the volume is marked as complete
  $: isComplete =
    currentPage === volume.mokuroData.pages.length ||
    currentPage === volume.mokuroData.pages.length - 1;

  // Function to handle volume deletion with confirmation
  async function onDeleteClicked(e: Event) {
    e.stopPropagation(); // Prevent event bubbling

    // Show a confirmation dialog before deleting the volume
    promptConfirmation(`Delete ${volName}?`, async () => {
      const existingCatalog = await db.catalog.get(title_uuid); // Fetch series from DB
      const updated = existingCatalog?.manga.filter(({ mokuroData }) => {
        return mokuroData.volume_uuid !== volume_uuid; // Remove the selected volume
      });

      deleteVolume(volume_uuid); // Remove volume from progress tracking

      // If there are still volumes left, update the catalog
      if (updated && updated.length > 0) {
        await db.catalog.update(title_uuid, { manga: updated });
        goto(`/${$page.params.manga}`); // Navigate to the series page
      } else {
        // If no volumes remain, delete the series and return to the homepage
        db.catalog.delete(title_uuid);
        goto('/');
      }
    });
  }
</script>

<!-- Render the volume within a frame and list group item -->
{#if $page.params.manga}
  <Frame rounded border class="divide-y divide-gray-200 dark:divide-gray-600">
    <ListgroupItem
      on:click={() => goto(`/${$page.params.manga}/${volume_uuid}`)}
      normalClass="py-4"
    >
      <div
        class:text-green-400={isComplete} // Mark as green if complete
        class="flex flex-row gap-5 items-center justify-between w-full"
      >
        <div>
          <!-- Display the volume name and progress -->
          <p class="font-semibold" class:text-white={!isComplete}>{volName}</p>
          <p>{progressDisplay}</p>
        </div>
        <div class="flex gap-2">
          <!-- Trash icon to delete the volume -->
          <TrashBinSolid
            class="text-red-400 hover:text-red-500 z-10"
            on:click={onDeleteClicked}
          />
          <!-- Checkmark icon if the volume is complete -->
          {#if isComplete}
            <CheckCircleSolid />
          {/if}
        </div>
      </div>
    </ListgroupItem>
  </Frame>
{/if}

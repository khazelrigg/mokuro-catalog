<script lang="ts">
  /*
   * This component manages the state and behavior of reading a specific volume.
    It uses the Reader component to display the manga volume and a Timer to track reading time.
   */

  import { page } from '$app/stores';  // Access route parameters and page state
  import Reader from '$lib/components/Reader/Reader.svelte';  // Reader component
  import Timer from '$lib/components/Reader/Timer.svelte';  // Timer component to track reading time
  import { initializeVolume, settings, startCount, volumeSettings, volumes } from '$lib/settings';  // Settings and state management
  import { onMount } from 'svelte';  // Lifecycle hook

  const volumeId = $page.params.volume;  // Get the volume ID from the route parameters
  let count: undefined | number = undefined;  // Store the interval ID for the timer

  // Lifecycle: Run this when the component is mounted
  onMount(() => {
    // Initialize volume settings if they are not already loaded
    if (!$volumes?.[volumeId]) {
      initializeVolume(volumeId);
    }

    // Start the timer to track reading time for the volume
    count = startCount(volumeId);

    // Cleanup: Stop the timer when the component is destroyed
    return () => {
      clearInterval(count);  // Clear the interval
      count = undefined;  // Reset the counter
    };
  });
</script>

<!-- Render the reader and timer if the volume settings are available -->
{#if $volumeSettings[volumeId]}
  {#if $settings.showTimer}
    <Timer bind:count {volumeId} />  <!-- Timer to display reading time -->
  {/if}
  <Reader volumeSettings={$volumeSettings[volumeId]} />  <!-- Reader for the volume -->
{/if}

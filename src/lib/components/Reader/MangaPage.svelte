<script lang="ts">
  // Import the Page type definition for TypeScript support
  import type { Page } from '$lib/types';

  // Import lifecycle hooks from Svelte
  import { afterUpdate, onMount, onDestroy } from 'svelte';

  // Import the TextBoxes component (likely displays OCR text areas over the image)
  import TextBoxes from './TextBoxes.svelte';

  // Import the zoom handler function (default zoom behavior for the page)
  import { zoomDefault } from '$lib/panzoom';

  // Props: Page metadata and the corresponding image file
  export let page: Page;  // Page metadata (e.g., width, height, OCR info)
  export let src: File;   // Image source file for the page

  // Reactive declaration: Convert the file into a URL for display
  $: url = src ? `url(${URL.createObjectURL(src)})` : '';

  let legacy: HTMLElement | null;  // Reference to the `popupAbout` element

  // Lifecycle: When the component mounts
  onMount(() => {
    legacy = document.getElementById('popupAbout');  // Find the element by ID
    zoomDefault();  // Initialize zoom behavior

    // Cleanup logic: Reapply zoom settings after a small delay
    return () => {
      setTimeout(() => {
        zoomDefault();
      }, 10);
    };
  });

  // Reactive block: If the `legacy` element exists, update its background image
  $: {
    if (legacy) {
      legacy.style.backgroundImage = url;  // Set the background to the current page
    }
  }

  // Lifecycle: Reapply zoom settings after every update to the component
  afterUpdate(() => {
    zoomDefault();
  });
</script>

<!-- Render the manga page with specified dimensions and background image -->
<div
  draggable="false"  <!-- Disable drag events on the page -->
  style:width={`${page.img_width}px`}  <!-- Set the width from the page metadata -->
  style:height={`${page.img_height}px`}  <!-- Set the height from the page metadata -->
  style:background-image={url}  <!-- Set the background image to the manga page -->
  class="relative"  <!-- Use relative positioning for contained elements -->
>
  <!-- Render the TextBoxes component, passing the page metadata and image source -->
  <TextBoxes {page} {src} />
</div>

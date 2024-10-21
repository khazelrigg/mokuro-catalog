<script lang="ts">
  // This file defines the homepage that displays the catalog of manga.
  import Catalog from '$lib/components/Catalog.svelte'; // Import the catalog component
</script>

<svelte:head>
  <title>Mokuro</title>
  <!-- Set the title of the homepage -->
</svelte:head>

<!-- Page content: Render the catalog inside a padded container -->
<div class="p-2 h-[90svh]">
  <Catalog />
  <!-- Render the catalog component on the homepage -->
</div>

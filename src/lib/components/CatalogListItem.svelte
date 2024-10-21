<script lang="ts">
  import { catalog } from '$lib/catalog';  // Import the catalog store
  import { ListgroupItem } from 'flowbite-svelte';  // UI component from flowbite-svelte

  export let id: string;  // ID of the manga passed as a prop

  // Reactive statement to find the manga with the given ID
  $: manga = $catalog?.find((item) => item.id === id)?.manga[0];
</script>


{#if manga}
  <div>
    <ListgroupItem>  <!-- List item component -->
      <a href={id} class="h-full w-full">  <!-- Link to manga detail page -->
        <div class="flex justify-between items-center">
          <p class="font-semibold text-white">{manga.mokuroData.title}</p>  <!-- Manga title -->
          <img
            src={URL.createObjectURL(Object.values(manga.files)[0])}
            alt="img"
            class="object-contain w-[50px] h-[70px] bg-black border-gray-900 border"
          />
        </div>
      </a>
    </ListgroupItem>
  </div>
{/if}

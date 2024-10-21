<script lang="ts">
  import { page } from '$app/stores'; // Access the current route's state and error info
</script>

<!-- Render the error status and message -->
<h1>{$page.status}: {$page.error?.message}</h1>

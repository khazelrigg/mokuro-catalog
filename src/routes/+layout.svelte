<script lang="ts">
  /*
  This file defines the global layout for the application. 
  It acts as a wrapper that provides shared UI elements, such as a navigation bar, snackbar notifications, and confirmation popups.
  */

  // Import the main PostCSS stylesheet
  import '../app.postcss';

  // Import environment-specific variables (check if in development mode)
  import { dev } from '$app/environment';

  // Import the Vercel analytics script to monitor app performance
  // import { inject } from '@vercel/analytics';

  // Import shared UI components
  import NavBar from '$lib/components/NavBar.svelte'; // Header navigation bar
  import Snackbar from '$lib/components/Snackbar.svelte'; // Notification component
  import ConfirmationPopup from '$lib/components/ConfirmationPopup.svelte'; // Popup for user confirmations

  // Inject Vercel analytics based on the environment (development or production)
  //inject({ mode: dev ? 'development' : 'production' });
</script>

<!-- Define the layout structure -->
<div class="h-full min-h-[100svh] text-white">
  <NavBar />
  <!-- Render the navigation bar at the top -->
  <slot />
  <!-- Render the page content inside this slot -->
  <Snackbar />
  <!-- Render the notification snackbar -->
  <ConfirmationPopup />
  <!-- Render the confirmation popup -->
</div>

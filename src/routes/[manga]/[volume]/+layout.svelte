<slot />

<style>
  /* This layout wraps the volume reading experience.
   It modifies the behavior of the body element for better scroll handling while reading a manga volume.  */

  :global(body.reader) {
    overflow: hidden !important;  /* Prevents page scrolling */
    overscroll-behavior: contain; /* Prevents overscrolling on touch devices */
  }
</style>

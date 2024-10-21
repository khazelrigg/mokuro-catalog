import { browser } from '$app/environment';  // Checks if running in a browser
import { writable } from 'svelte/store';     // Reactive store for state management


export type MiscSettings = {
  galleryLayout: 'grid' | 'list';  // Layout style for the gallery (grid or list)
  gallerySorting: 'ASC' | 'DESC';  // Sort order for the gallery (ascending or descending)
};

export type MiscSettingsKey = keyof MiscSettings;  // Type to restrict valid keys for settings


const defaultSettings: MiscSettings = {
  galleryLayout: 'grid',  // Default to grid layout
  gallerySorting: 'ASC',   // Default to ascending sorting
};

const stored = browser ? window.localStorage.getItem('miscSettings') : undefined;

export const miscSettings = writable<MiscSettings>(
  stored ? JSON.parse(stored) : defaultSettings
);

miscSettings.subscribe((miscSettings) => {
  // Every time the store updates, the new values are saved to local storage, ensuring the settings persist across sessions.
  if (browser) {
    window.localStorage.setItem('miscSettings', JSON.stringify(miscSettings));
  }
});

export function updateMiscSetting(key: MiscSettingsKey, value: any) {
  miscSettings.update((miscSettings) => {
    return {
      ...miscSettings,
      [key]: value
    };
  });
}
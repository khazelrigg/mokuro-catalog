// Each block on a page containing OCR data and layout information
export type Block = {
  box: number[];        // Bounding box for the block (x, y, width, height)
  vertical: boolean;    // Whether the text is vertically aligned
  font_size: number;    // Font size of the text
  lines: string[];      // Array of strings representing text lines within the block
};

// Represents an individual manga page with its dimensions and OCR blocks
export type Page = {
  version: string;      // Page version
  img_width: number;    // Width of the image
  img_height: number;   // Height of the image
  blocks: Block[];      // Array of text blocks on the page
  img_path: string;     // Path to the page image
};

// Metadata for each manga volume
export type MokuroData = {
  version: string;       // Version of the Mokuro data
  title: string;         // Title of the manga series
  title_uuid: string;    // Unique ID for the title
  volume: string;        // Name of the volume
  volume_uuid: string;   // Unique ID for the volume
  pages: Page[];         // Array of pages in the volume
};

// Represents a manga volume with associated files
export type Volume = {
  mokuroData: MokuroData;  // Metadata for the volume
  volumeName: string;      // Name of the volume
  files: Record<string, File>;  // Files associated with the volume (e.g., page images)
};

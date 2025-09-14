import * as fs from 'fs-extra';
import * as path from 'path';

const MAPPING_FILE = path.join(process.cwd(), 'backend-port-mapping.json');

export async function loadBackendPortMapping(): Promise<{ [subdomain: string]: { requestPort: number } }> {
  try {
    if (await fs.pathExists(MAPPING_FILE)) {
      const content = await fs.readFile(MAPPING_FILE, 'utf8');
      return JSON.parse(content);
    } else {
      return {};
    }
  } catch (error) {
    console.error('Failed to load backend port mapping:', error);
    return {};
  }
}

export async function saveBackendPortMapping(newMapping: { [subdomain: string]: { requestPort: number } }): Promise<void> {
  try {
    // Load the existing mapping (or start with an empty object)
    let existingMapping: { [subdomain: string]: { requestPort: number } } = {};
    if (await fs.pathExists(MAPPING_FILE)) {
      const content = await fs.readFile(MAPPING_FILE, 'utf8');
      existingMapping = JSON.parse(content);
    }
    
    // Merge the new mapping with the existing one.
    // New values will override existing keys.
    const mergedMapping = { ...existingMapping, ...newMapping };

    // Save the merged mapping back to the file.
    await fs.writeFile(MAPPING_FILE, JSON.stringify(mergedMapping, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save backend port mapping:', error);
  }
}

// Utility to fetch and map technology icons from tools backend

interface Tool {
  _id: string;
  name: string;
  logo: string;
  category: string;
}

let toolsCache: Tool[] | null = null;
let toolsMap: Map<string, string> | null = null;

/**
 * Fetch all tools from the backend and cache them
 */
export const fetchToolsForIcons = async (): Promise<Tool[]> => {
  if (toolsCache) {
    return toolsCache;
  }

  try {
    const response = await fetch('/api/public-data?type=tools');
    const data = await response.json();
    toolsCache = data;
    
    // Create a map for quick lookups (case-insensitive)
    toolsMap = new Map();
    data.forEach((tool: Tool) => {
      toolsMap!.set(tool.name.toLowerCase(), tool.logo);
      // Add common variations
      if (tool.name === 'Node.js') toolsMap!.set('nodejs', tool.logo);
      if (tool.name === 'Next.js') toolsMap!.set('nextjs', tool.logo);
      if (tool.name === 'Tailwind CSS') {
        toolsMap!.set('tailwind', tool.logo);
        toolsMap!.set('tailwindcss', tool.logo);
      }
      if (tool.name === 'PostgreSQL') {
        toolsMap!.set('postgres', tool.logo);
        toolsMap!.set('postgresql', tool.logo);
      }
      if (tool.name === 'MongoDB') toolsMap!.set('mongo', tool.logo);
    });
    
    return data;
  } catch (error) {
    // Error occurred while fetching tools
    return [];
  }
};

/**
 * Get logo URL for a technology name
 * Returns the logo URL if found, otherwise returns a fallback
 */
export const getTechLogo = (techName: string): string => {
  if (!toolsMap) {
    // If tools haven't been fetched yet, return empty string
    // The component should call fetchToolsForIcons first
    return '';
  }

  const logo = toolsMap.get(techName.toLowerCase());
  if (logo) {
    return logo;
  }

  // Fallback: return a default tech icon from ui-avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(techName)}&background=6366f1&color=fff&size=32`;
};

/**
 * Clear the tools cache (useful for testing or after updates)
 */
export const clearToolsCache = () => {
  toolsCache = null;
  toolsMap = null;
};

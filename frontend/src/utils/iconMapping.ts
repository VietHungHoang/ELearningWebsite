// Icon mapping utility - maps backend icon keys to actual icons/emojis

export interface IconMapping {
  [key: string]: string;
}

// Map icon keys to emojis/icons
export const categoryIconMap: IconMapping = {
  // Technology & Programming
  'programming': '💻',
  'code': '🖥️', 
  'web-development': '🌐',
  'mobile-development': '📱',
  'data-science': '📊',
  'artificial-intelligence': '🤖',
  'cybersecurity': '🔒',
  'cloud-computing': '☁️',
  
  // Design & Creative
  'design': '🎨',
  'graphic-design': '🖌️',
  'ui-ux': '📐',
  'photography': '📸',
  'video-editing': '🎬',
  'animation': '🎭',
  'illustration': '✏️',
  
  // Business & Finance
  'business': '💼',
  'marketing': '📈',
  'finance': '💰',
  'entrepreneurship': '🚀',
  'management': '👔',
  'sales': '🎯',
  'accounting': '📊',
  
  // Language & Communication
  'language': '🗣️',
  'english': '🇺🇸',
  'communication': '💬',
  'writing': '✍️',
  'public-speaking': '🎤',
  
  // Arts & Music
  'music': '🎵',
  'piano': '🎹',
  'guitar': '🎸',
  'singing': '🎤',
  'drawing': '🖊️',
  'painting': '🎨',
  
  // Health & Fitness
  'fitness': '💪',
  'yoga': '🧘',
  'nutrition': '🥗',
  'mental-health': '🧠',
  'meditation': '🕯️',
  
  // Academic Subjects
  'mathematics': '🔢',
  'science': '🔬',
  'physics': '⚛️',
  'chemistry': '🧪',
  'biology': '🧬',
  'history': '📚',
  'literature': '📖',
  
  // Personal Development
  'personal-development': '🌱',
  'leadership': '👑',
  'productivity': '⏰',
  'time-management': '📅',
  'career-development': '📈',
  
  // Others
  'cooking': '👩‍🍳',
  'travel': '✈️',
  'sports': '⚽',
  'gaming': '🎮',
  'hobby': '🎭',
  'default': '📚' // fallback icon
};

// Function to get icon by key
export const getCategoryIcon = (iconKey: string | undefined): string => {
  if (!iconKey) return categoryIconMap.default;
  return categoryIconMap[iconKey.toLowerCase()] || categoryIconMap.default;
};

// Function to get all available icon keys
export const getAvailableIconKeys = (): string[] => {
  return Object.keys(categoryIconMap).filter(key => key !== 'default');
};
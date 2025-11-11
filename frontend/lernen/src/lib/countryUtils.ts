// Utility functions for country/nationality handling
export const getCountryFlag = (nationalityCode: string): string => {
  const flagMap: Record<string, string> = {
    'US': '🇺🇸', // United States
    'GB': '🇬🇧', // United Kingdom
    'UK': '🇬🇧', // United Kingdom (alternative)
    'CA': '🇨🇦', // Canada
    'CN': '🇨🇳', // China
    'VN': '🇻🇳', // Vietnam
    'JP': '🇯🇵', // Japan
    'KR': '🇰🇷', // South Korea
    'AU': '🇦🇺', // Australia
    'DE': '🇩🇪', // Germany
    'FR': '🇫🇷', // France
    'IT': '🇮🇹', // Italy
    'ES': '🇪🇸', // Spain
    'BR': '🇧🇷', // Brazil
    'MX': '🇲🇽', // Mexico
    'IN': '🇮🇳', // India
    'RU': '🇷🇺', // Russia
    'NL': '🇳🇱', // Netherlands
    'BE': '🇧🇪', // Belgium
    'CH': '🇨🇭', // Switzerland
    'AT': '🇦🇹', // Austria
    'SE': '🇸🇪', // Sweden
    'NO': '🇳🇴', // Norway
    'DK': '🇩🇰', // Denmark
    'FI': '🇫🇮', // Finland
    'PL': '🇵🇱', // Poland
    'CZ': '🇨🇿', // Czech Republic
    'HU': '🇭🇺', // Hungary
    'RO': '🇷🇴', // Romania
    'BG': '🇧🇬', // Bulgaria
    'GR': '🇬🇷', // Greece
    'PT': '🇵🇹', // Portugal
    'TR': '🇹🇷', // Turkey
    'TH': '🇹🇭', // Thailand
    'MY': '🇲🇾', // Malaysia
    'SG': '🇸🇬', // Singapore
    'PH': '🇵🇭', // Philippines
    'ID': '🇮🇩', // Indonesia
    'HK': '🇭🇰', // Hong Kong
    'TW': '🇹🇼', // Taiwan
    'ZA': '🇿🇦', // South Africa
    'EG': '🇪🇬', // Egypt
    'NG': '🇳🇬', // Nigeria
    'KE': '🇰🇪', // Kenya
    'MA': '🇲🇦', // Morocco
    'TN': '🇹🇳', // Tunisia
    'AE': '🇦🇪', // United Arab Emirates
    'SA': '🇸🇦', // Saudi Arabia
    'IL': '🇮🇱', // Israel
    'IR': '🇮🇷', // Iran
    'IQ': '🇮🇶', // Iraq
    'JO': '🇯🇴', // Jordan
    'LB': '🇱🇧', // Lebanon
    'SY': '🇸🇾', // Syria
    'YE': '🇾🇪', // Yemen
    'OM': '🇴🇲', // Oman
    'KW': '🇰🇼', // Kuwait
    'QA': '🇶🇦', // Qatar
    'BH': '🇧🇭', // Bahrain
    'PK': '🇵🇰', // Pakistan
    'BD': '🇧🇩', // Bangladesh
    'LK': '🇱🇰', // Sri Lanka
    'NP': '🇳🇵', // Nepal
    'MM': '🇲🇲', // Myanmar
    'KH': '🇰🇭', // Cambodia
    'LA': '🇱🇦', // Laos
  };

  return flagMap[nationalityCode] || '🏳️'; // Default to white flag if not found
};

export const getCountryName = (nationalityCode: string): string => {
  const countryMap: Record<string, string> = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'UK': 'United Kingdom',
    'CA': 'Canada',
    'CN': 'China',
    'VN': 'Vietnam',
    'JP': 'Japan',
    'KR': 'South Korea',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'IT': 'Italy',
    'ES': 'Spain',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'IN': 'India',
    'RU': 'Russia',
    'NL': 'Netherlands',
    'BE': 'Belgium',
    'CH': 'Switzerland',
    'AT': 'Austria',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'PL': 'Poland',
    'CZ': 'Czech Republic',
    'HU': 'Hungary',
    'RO': 'Romania',
    'BG': 'Bulgaria',
    'GR': 'Greece',
    'PT': 'Portugal',
    'TR': 'Turkey',
    'TH': 'Thailand',
    'MY': 'Malaysia',
    'SG': 'Singapore',
    'PH': 'Philippines',
    'ID': 'Indonesia',
    'HK': 'Hong Kong',
    'TW': 'Taiwan',
    'ZA': 'South Africa',
    'EG': 'Egypt',
    'NG': 'Nigeria',
    'KE': 'Kenya',
    'MA': 'Morocco',
    'TN': 'Tunisia',
    'AE': 'United Arab Emirates',
    'SA': 'Saudi Arabia',
    'IL': 'Israel',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'JO': 'Jordan',
    'LB': 'Lebanon',
    'SY': 'Syria',
    'YE': 'Yemen',
    'OM': 'Oman',
    'KW': 'Kuwait',
    'QA': 'Qatar',
    'BH': 'Bahrain',
    'PK': 'Pakistan',
    'BD': 'Bangladesh',
    'LK': 'Sri Lanka',
    'NP': 'Nepal',
    'MM': 'Myanmar',
    'KH': 'Cambodia',
    'LA': 'Laos',
  };

  return countryMap[nationalityCode] || nationalityCode; // Return code if name not found
};
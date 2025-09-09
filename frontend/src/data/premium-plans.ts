// Mock premium plans list. Replace with API data.
export const plans = [
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Unlock additional capabilities with enhanced tools and resources.',
    price: '$799.99',
    period: '6 Months',
    features: ['Sessions quota: 8', 'Courses quota: 30', 'Auto Renew: Yes'],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Access essential features and tools to get started.',
    price: '$499.99',
    period: 'Monthly',
    features: ['Sessions quota: 5', 'Courses quota: 10', 'Auto Renew: Yes'],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Full power with exclusive features and priority support.',
    price: '$999.99',
    period: 'Yearly',
    features: ['Sessions quota: 10', 'Courses quota: 50', 'Auto Renew: Yes'],
  },
];



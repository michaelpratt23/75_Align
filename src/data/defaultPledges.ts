export const defaultPledges = {
  ACTIVITY: [
    {
      id: 'activity-1',
      text: 'Stretch deeply in the morning',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'activity-2',
      text: 'Complete one 45+ minute workout indoors (recovery counts)',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'activity-3',
      text: 'Complete one 30+ minute workout outdoors (walk, run, yoga, etc.)',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'activity-4',
      text: 'Stretch deeply in the evening',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    }
  ],
  NUTRITION: [
    {
      id: 'nutrition-1',
      text: 'Drink a longevity mix each morning',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'nutrition-2',
      text: 'Eat a healthy lunch with super greens and protein (fish or chicken)',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'nutrition-3',
      text: 'Take daily vitamins',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'nutrition-4',
      text: 'Add collagen to my morning coffee',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'nutrition-5',
      text: 'Delay coffee intake until 1 hour after being up',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'nutrition-6',
      text: 'Drink at least one gallon of water',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'nutrition-7',
      text: 'Avoid all alcohol',
      type: 'COMMITMENT' as const,
      isDaily: false
    },
    {
      id: 'nutrition-8',
      text: 'Avoid processed sugar and desserts',
      type: 'COMMITMENT' as const,
      isDaily: false
    }
  ],
  MIND: [
    {
      id: 'mind-1',
      text: 'Stay off Instagram completely',
      type: 'COMMITMENT' as const,
      isDaily: false
    },
    {
      id: 'mind-2',
      text: 'Delete YouTube on my phone',
      type: 'COMMITMENT' as const,
      isDaily: false
    },
    {
      id: 'mind-3',
      text: 'Limit YouTube to 1 hour per day on my laptop (educational only)',
      type: 'COMMITMENT' as const,
      isDaily: false
    },
    {
      id: 'mind-4',
      text: 'Use Twitter only after 5pm, max 15 minutes, on laptop',
      type: 'COMMITMENT' as const,
      isDaily: false
    },
    {
      id: 'mind-5',
      text: 'Listen only to educational/enriching podcasts',
      type: 'COMMITMENT' as const,
      isDaily: false
    },
    {
      id: 'mind-6',
      text: 'Avoid all non-physical sexual content',
      type: 'COMMITMENT' as const,
      isDaily: false
    }
  ],
  GROWTH: [
    {
      id: 'growth-1',
      text: 'Journal in the morning for at least 5 minutes',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'growth-2',
      text: 'Read 5+ pages from a developmental book',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'growth-3',
      text: 'Journal at night reflecting on the day',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true
    },
    {
      id: 'growth-4',
      text: 'Be in bed for 8 to 9 hours',
      type: 'COMMITMENT' as const,
      isDaily: false
    }
  ]
} 
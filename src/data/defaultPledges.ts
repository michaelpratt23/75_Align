export const defaultPledges = {
  ACTIVITY: [
    {
      id: 'activity-1',
      text: 'Stretch deeply (10+ Min)',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'morning' as const
    },
    {
      id: 'activity-2',
      text: 'Complete one 45+ minute workout indoors (recovery counts)',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'afternoon' as const
    },
    {
      id: 'activity-3',
      text: 'Complete one 30+ minute workout outdoors (walk, run, yoga, etc.)',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'afternoon' as const
    },
    {
      id: 'activity-4',
      text: 'Stretch deeply (10+ Min)',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'evening' as const
    }
  ],
  NUTRITION: [
    {
      id: 'nutrition-4',
      text: 'Delay coffee intake until 1 hour after being up and add collagen peptides',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'morning' as const
    },
    {
      id: 'nutrition-3',
      text: 'Take daily vitamins',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'morning' as const
    },
    {
      id: 'nutrition-1',
      text: 'Drink a longevity mix',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'morning' as const
    },
    {
      id: 'nutrition-2',
      text: 'Eat healthy meals with whole grains, super greens, fruit, and lean protein',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    },
    {
      id: 'nutrition-6',
      text: 'Drink at least one gallon of water',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    },
    {
      id: 'nutrition-7',
      text: 'Avoid all alcohol',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    },
    {
      id: 'nutrition-8',
      text: 'Avoid processed sugar and desserts',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    }
  ],
  MIND: [
    {
      id: 'mind-1',
      text: 'Stay off Instagram completely',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    },
    {
      id: 'mind-2',
      text: 'Delete YouTube on my phone',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    },
    {
      id: 'mind-3',
      text: 'Limit YouTube to 1 hour per day on my laptop (educational only)',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    },
    {
      id: 'mind-4',
      text: 'Use Twitter only after 5pm, max 15 minutes, on laptop',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    },
    {
      id: 'mind-5',
      text: 'Listen only to educational/enriching podcasts',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    },
    {
      id: 'mind-6',
      text: 'Avoid all non-physical sexual content',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    }
  ],
  GROWTH: [
    {
      id: 'growth-1',
      text: 'Journal for at least 5 minutes',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'morning' as const
    },
    {
      id: 'growth-2',
      text: 'Read 5+ pages from a developmental book',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'evening' as const
    },
    {
      id: 'growth-3',
      text: 'Journal to reflect on the day',
      type: 'DAILY_PLEDGE' as const,
      isDaily: true,
      order: 'evening' as const
    },
    {
      id: 'growth-4',
      text: 'Be in bed for 8 to 9 hours',
      type: 'COMMITMENT' as const,
      isDaily: false,
      order: null
    }
  ]
} 
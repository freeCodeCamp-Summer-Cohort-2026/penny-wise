import { fallbackBriefLessons } from './briefLessons';

export const modules = [
  {
    id: 1,
    name: 'Money Basics',
    description:
      'Learn what money does, where it goes, and how to stay in charge.',
    briefLesson: fallbackBriefLessons.money,
    lessons: [
      {
        id: 1,
        title: 'What Is Money?',
        description: 'See the shared idea behind coins, notes, and payments.',
        duration: 5,
      },
      {
        id: 2,
        title: 'Coins & Notes',
        description: 'Spot value even when the shape of money changes.',
        duration: 6,
      },
      {
        id: 3,
        title: 'Counting Total Value',
        description: 'Group, add, and check a money total without guessing.',
        duration: 8,
      },
    ],
  },
  {
    id: 2,
    name: 'Smart Spending',
    description: 'Spot trade-offs, compare choices, and spend without regret.',
    briefLesson: fallbackBriefLessons.spending,
    lessons: [
      {
        id: 1,
        title: 'Needs vs Wants',
        description: 'Sort choices by the job they do in your life.',
        duration: 5,
      },
      {
        id: 2,
        title: 'Making Change',
        description: 'Calculate and check the change after a purchase.',
        duration: 6,
      },
      {
        id: 3,
        title: 'Save or Spend?',
        description: 'Make a small budget that leaves room for joy.',
        duration: 8,
      },
    ],
  },
  {
    id: 3,
    name: 'Saving Goals',
    description:
      'Turn big dreams into small steps you can actually stick with.',
    briefLesson: fallbackBriefLessons.saving,
    lessons: [
      {
        id: 1,
        title: 'Set a Savings Target',
        description: 'Give a wish an amount, a date, and a finish line.',
        duration: 5,
      },
      {
        id: 2,
        title: 'Build a Tiny Habit',
        description: 'Choose a small deposit that is easy to repeat.',
        duration: 6,
      },
      {
        id: 3,
        title: 'The Three Buckets',
        description: 'Give every money intention its own place.',
        duration: 8,
      },
    ],
  },
  {
    id: 4,
    name: 'Earning & Work',
    description: 'Explore ways to earn and understand what your time is worth.',
    briefLesson: fallbackBriefLessons.work,
    lessons: [
      {
        id: 1,
        title: 'Your Time Has Value',
        description: 'Find the time and effort behind a price.',
        duration: 5,
      },
      {
        id: 2,
        title: 'More Than a Paycheck',
        description: 'Compare the whole reward of a job.',
        duration: 6,
      },
      {
        id: 3,
        title: 'Grow Your Skills',
        description: 'Build a useful skill with small, visible practice.',
        duration: 8,
      },
    ],
  },
];

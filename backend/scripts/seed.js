require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const Country = require('../src/models/country');
const Money = require('../src/models/money');
const { Author, Learner } = require('../src/models/User');
const Course = require('../src/models/Course');
const Lesson = require('../src/models/Lesson');
const LessonProgress = require('../src/models/LessonProgress');
const { Page } = require('../src/models/Page');
const Wallet = require('../src/models/wallet');

const DEMO_PASSWORD = 'PennyWise-123';
const USD_COUNTRY = 'United States';

const SEED_AUTHORS = [
  {
    email: 'author@pennywise.app',
    displayName: 'Ama Author',
    role: 'author',
  },
  {
    email: 'anotherauthor@pennywise.app',
    displayName: 'Another Author',
    role: 'author',
  },
];

const SEED_USERS = [
  {
    email: 'learn.sara@pennywise.app',
    displayName: 'Sara Ekon',
    role: 'learner',
  },
  {
    email: 'learn.kofi@pennywise.app',
    displayName: 'Kofi Mensah',
    role: 'learner',
  },
];

const USD_COINS = [
  { value: 1, image: '/images/money/usd/coin-1c.png' },
  { value: 5, image: '/images/money/usd/coin-5c.png' },
  { value: 10, image: '/images/money/usd/coin-10c.png' },
  { value: 25, image: '/images/money/usd/coin-25c.png' },
];

const USD_NOTES = [
  { value: 1, image: '/images/money/usd/note-1.png' },
  { value: 5, image: '/images/money/usd/note-5.png' },
  { value: 10, image: '/images/money/usd/note-10.png' },
  { value: 20, image: '/images/money/usd/note-20.png' },
  { value: 50, image: '/images/money/usd/note-50.png' },
  { value: 100, image: '/images/money/usd/note-100.png' },
];

const unsplashImage = (photoId, alt, caption) => ({
  url: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=85`,
  alt,
  caption,
});

const BRIEF_LESSONS = {
  'Money Basics/What Is Money?': {
    title: 'Money is a shared agreement',
    kicker: 'A tiny idea with a big job',
    readTimeMinutes: 2,
    introduction:
      'Money is a promise that lets people trade things they value without needing to carry everything they want to swap.',
    heroImage: unsplashImage(
      'photo-1579621970563-ebec7560ff3e',
      'A person planning a budget beside a laptop',
      'Money helps turn a plan into a choice.',
    ),
    sections: [
      {
        heading: 'Three jobs money does',
        body: 'Money can measure value, make a trade fair, and store a little purchasing power for later. That is why the same coin can mean different amounts in different places and times.',
        image: unsplashImage(
          'photo-1526304640581-d334cdbbf45e',
          'Coins and banknotes arranged on a table',
          'Different forms can carry one shared idea.',
        ),
        note: 'Spot it: value is about what something is useful to people, not only what it costs.',
      },
      {
        heading: 'Trust makes it work',
        body: 'A money system works when people believe the person receiving it will accept the same kind of value in return. The promise is invisible, but it makes everyday trade possible.',
        image: unsplashImage(
          'photo-1556742049-0cfed4f6a45d',
          'A person making a contactless payment',
          'Even digital payments rely on a shared promise.',
        ),
        note: 'Quick check: what would a market look like if nobody trusted the value of the exchange?',
      },
    ],
    takeaway:
      'Money is a shared agreement about value, not just a thing you carry.',
  },
  'Money Basics/Coins & Notes': {
    title: 'Coins, notes, and taps are different forms of the same idea',
    kicker: 'Look closer at the money around you',
    readTimeMinutes: 2,
    introduction:
      'Coins, paper notes, and digital balances look different, but each one is a way to represent value and make a trade easier.',
    heroImage: unsplashImage(
      'photo-1526304640581-d334cdbbf45e',
      'A close view of coins representing different values',
      'Shape is only the outside of the story.',
    ),
    sections: [
      {
        heading: 'Read the value, not the shape',
        body: 'A note can be thin while a coin can be thick. What matters is the value assigned to it and whether a seller will accept it. The design helps people recognise the value quickly.',
        image: unsplashImage(
          'photo-1554224155-6726b3ff858f',
          'A calculator and financial notes on a desk',
          'Value is the idea behind the object.',
        ),
      },
      {
        heading: 'Cash and digital money travel differently',
        body: 'Physical money moves from hand to hand. Digital money travels as a record that changes hands through a system. Both need checking, protection, and a clear record of the exchange.',
        image: unsplashImage(
          'photo-1556742049-0cfed4f6a45d',
          'A contactless payment being made at a shop',
          'The form changes; the exchange is still real.',
        ),
        note: 'Try it: find one physical coin and one digital balance, then name what each does for you.',
      },
    ],
    takeaway:
      'Money can take many forms, but each form carries a value people agree to recognise.',
  },
  'Money Basics/Counting Total Value': {
    title: 'A number only matters when you know what it counts',
    kicker: 'Build your money-sensing superpower',
    readTimeMinutes: 2,
    introduction:
      'Counting money is less about speed than careful grouping. Start with the biggest values, then check the smaller pieces.',
    heroImage: unsplashImage(
      'photo-1554224155-6726b3ff858f',
      'A calculator beside notes for a quick total',
      'A clear method beats a fast guess.',
    ),
    sections: [
      {
        heading: 'Group before you add',
        body: 'Put coins with coins and notes with notes. Add the larger values first, then the smaller ones. This makes it easier to spot a missing or duplicated piece.',
        image: unsplashImage(
          'photo-1526304640581-d334cdbbf45e',
          'Coins grouped by size on a table',
          'Grouping turns a pile into a checklist.',
        ),
      },
      {
        heading: 'Check the total twice',
        body: 'Say the total, then add the groups in a different order. If both ways lead to the same number, you have a useful cross-check instead of a guess.',
        image: unsplashImage(
          'photo-1556742049-0cfed4f6a45d',
          'A payment being verified at a counter',
          'A second check protects the first decision.',
        ),
        note: 'Mini challenge: make two totals agree before you spend the money.',
      },
    ],
    takeaway: 'Good counting is a method: group, add, and check.',
  },
  'Smart Spending/Needs vs Wants': {
    title: 'Needs, wants, and the sneaky in-between',
    kicker: 'A kinder way to make a spending choice',
    readTimeMinutes: 2,
    introduction:
      'A need supports your health, safety, or ability to learn. A want is something you would enjoy. Plenty of choices sit in the thoughtful middle.',
    heroImage: unsplashImage(
      'photo-1542838132-92c53300491e',
      'A colourful market with fresh choices on display',
      'Every choice has a story behind its price.',
    ),
    sections: [
      {
        heading: 'Start with the job the item does',
        body: 'Ask what happens if the item is not there. Food, safe transport, and school supplies may protect daily life. Entertainment and upgrades are often wants, but context matters too.',
        image: unsplashImage(
          'photo-1441986300917-64674bd600d8',
          'A shop display with clothing and accessories',
          'A want can be fun without being essential.',
        ),
      },
      {
        heading: 'The in-between needs a plan',
        body: 'A game, a snack, or a new notebook may be educational, social, or motivating. That does not make the choice wrong. It makes the trade-off worth naming before buying.',
        image: unsplashImage(
          'photo-1495474472287-4d71bcdd2085',
          'A warm drink and notebook on a study table',
          'A thoughtful “maybe” can be the best answer.',
        ),
        note: 'Try this: write one need, one want, and one in-between item for your next purchase.',
      },
    ],
    takeaway:
      'You do not have to choose between “good choice” and “fun choice” to make a smart decision.',
  },
  'Smart Spending/Making Change': {
    title: 'Change is the gap between what you paid and what you bought',
    kicker: 'A quick arithmetic superpower',
    readTimeMinutes: 2,
    introduction:
      'Making change is subtraction, but the real skill is choosing a method you can check. Subtract the price from the amount you handed over.',
    heroImage: unsplashImage(
      'photo-1556742049-0cfed4f6a45d',
      'A contactless payment and a small purchase at a shop',
      'The smallest numbers can deserve the most attention.',
    ),
    sections: [
      {
        heading: 'Round the numbers first',
        body: 'For a $2.00 snack paid with $5, start with $5 minus $2. If the price has cents, line up the decimal places before subtracting.',
        image: unsplashImage(
          'photo-1554224155-6726b3ff858f',
          'A calculator and notes ready for a total',
          'Keep the decimal places lined up.',
        ),
      },
      {
        heading: 'Count the answer back',
        body: 'Add the change to the price. If you get the amount you paid, your subtraction is right. This check catches most small mistakes before they become bigger ones.',
        image: unsplashImage(
          'photo-1526304640581-d334cdbbf45e',
          'Coins laid out for counting',
          'Checking the answer is part of the skill.',
        ),
        note: 'Think: price + change should equal the note you handed over.',
      },
    ],
    takeaway:
      'Subtract the price, then add the change back to check your answer.',
  },
  'Smart Spending/Save or Spend?': {
    title: 'A spending plan makes room for both joy and tomorrow',
    kicker: 'Give every choice a place',
    readTimeMinutes: 2,
    introduction:
      'The best spending plan is not the strictest one. It is a plan that leaves room for something enjoyable today and something important tomorrow.',
    heroImage: unsplashImage(
      'photo-1542838132-92c53300491e',
      'A market stall with bright produce and a shopper choosing',
      'A plan turns a big choice into smaller ones.',
    ),
    sections: [
      {
        heading: 'Set aside the future first',
        body: 'When you know a portion is for savings, move it out of the spendable balance before the shop gets loud. The goal becomes a boundary instead of a hope.',
        image: unsplashImage(
          'photo-1517842645767-c639042777db',
          'A notebook and pen ready for a money plan',
          'Write the goal where you can see it.',
        ),
      },
      {
        heading: 'Spend the rest on purpose',
        body: 'Choose what matters most today, then pause before adding anything else. A limit is not a punishment; it helps you buy with your values instead of your mood.',
        image: unsplashImage(
          'photo-1441986300917-64674bd600d8',
          'A colourful shop with a few highlighted items',
          'A little clarity keeps a fun choice fun.',
        ),
        note: 'Try this: split your next allowance into save, spend, and give before choosing anything.',
      },
    ],
    takeaway:
      'Save first, then spend the rest with a clear plan and room to enjoy it.',
  },
  'Saving Goals/Set a Savings Target': {
    title: 'A big dream gets easier when it has a number',
    kicker: 'Give your goal a finish line',
    readTimeMinutes: 2,
    introduction:
      'A savings goal is easier to chase when you can picture the amount, the date, and the small steps that will get you there.',
    heroImage: unsplashImage(
      'photo-1579621970563-ebec7560ff3e',
      'A person reviewing a savings plan',
      'A goal becomes real when it has a number and a date.',
    ),
    sections: [
      {
        heading: 'Name the exact finish line',
        body: 'Instead of “save more,” try “save 30 dollars for headphones by the end of the month.” The number and date make trade-offs easier to see.',
        image: unsplashImage(
          'photo-1517842645767-c639042777db',
          'A notebook with a goal written on the page',
          'Specific goals are easier to revisit.',
        ),
      },
      {
        heading: 'Check the plan, not just the wish',
        body: 'Compare the amount you can realistically set aside with the price of the goal. If they do not match yet, you have two choices: adjust the target or give yourself more time.',
        image: unsplashImage(
          'photo-1554224155-6726b3ff858f',
          'A calculator, notebook, and financial notes',
          'A realistic plan protects your motivation.',
        ),
        note: 'A good goal stretches you without making you feel defeated.',
      },
    ],
    takeaway:
      'Name the amount, the date, and the reason; then make the plan realistic.',
  },
  'Saving Goals/Build a Tiny Habit': {
    title: 'Small deposits beat big promises',
    kicker: 'Make progress automatic and visible',
    readTimeMinutes: 2,
    introduction:
      'You do not need a perfect week to build a savings habit. You need one small action that is easy enough to repeat.',
    heroImage: unsplashImage(
      'photo-1517842645767-c639042777db',
      'A notebook and pen on a calm desk',
      'Tiny steps become a pattern when they are visible.',
    ),
    sections: [
      {
        heading: 'Choose a deposit you will not miss',
        body: 'Five cents, one dollar, or a fixed part of every payment can work. The amount matters less at the beginning than proving to yourself that you can return.',
        image: unsplashImage(
          'photo-1526304640581-d334cdbbf45e',
          'A small group of coins ready to be counted',
          'Even a small coin can move a plan forward.',
        ),
      },
      {
        heading: 'Make the next step obvious',
        body: 'Keep your savings visible, schedule the transfer, and tick off each deposit. When the action is easy to see, you are less likely to forget it.',
        image: unsplashImage(
          'photo-1579621970563-ebec7560ff3e',
          'A person checking a savings plan',
          'Visibility turns an intention into a habit.',
        ),
        note: 'Tiny challenge: save the same small amount three times this week.',
      },
    ],
    takeaway: 'Choose a deposit you can repeat, then make it easy to see.',
  },
  'Saving Goals/The Three Buckets': {
    title: 'Different goals need different kinds of space',
    kicker: 'Keep your money intentions separate',
    readTimeMinutes: 2,
    introduction:
      'Money for a future goal, a near-term treat, and everyday flexibility should not all compete for the same mental space.',
    heroImage: unsplashImage(
      'photo-1517842645767-c639042777db',
      'A planner open beside a pen',
      'Separate spaces make decisions clearer.',
    ),
    sections: [
      {
        heading: 'Name each bucket',
        body: 'Try three simple buckets: future goals, fun now, and flexible spending. A bucket can be a separate account, a jar, or even a note in your planner.',
        image: unsplashImage(
          'photo-1441986300917-64674bd600d8',
          'A shop display with several clearly different choices',
          'Labels help you compare the job of each choice.',
        ),
      },
      {
        heading: 'Give every bucket a rule',
        body: 'Decide when money moves into each one and what can change it. Clear rules stop a small purchase from quietly eating a big goal.',
        image: unsplashImage(
          'photo-1554224155-6726b3ff858f',
          'A calculator and notes arranged for a simple budget',
          'A rule turns a bucket into a plan.',
        ),
        note: 'Try this: write one rule for your future-goal bucket today.',
      },
    ],
    takeaway:
      'Separate intentions, give each one a rule, and your money gets less confusing.',
  },
  'Earning & Work/Your Time Has Value': {
    title: 'Your time is valuable because it is limited',
    kicker: 'Notice the trade behind every purchase',
    readTimeMinutes: 2,
    introduction:
      'Money is often a receipt for time, effort, skill, or a resource someone else provided. Seeing the trade makes prices feel less mysterious.',
    heroImage: unsplashImage(
      'photo-1521737711867-e3b97375f902',
      'A group of people working together around a table',
      'A price can tell a story about time and effort.',
    ),
    sections: [
      {
        heading: 'Look for the work behind the price',
        body: 'A product may include design, materials, transport, care, and the worker’s time. No single price tells the whole story, but asking who contributed helps you see the value behind it.',
        image: unsplashImage(
          'photo-1524178232363-1fb2b075b655',
          'A learner taking notes in a classroom',
          'Skills grow through time and practice.',
        ),
      },
      {
        heading: 'Your time has a value too',
        body: 'Before agreeing to work, ask what you are learning, what you can offer, and how the time will be used. A fair exchange respects both sides.',
        image: unsplashImage(
          'photo-1517245386807-bb43f82c33c4',
          'People collaborating around a shared workspace',
          'A fair exchange makes the effort visible.',
        ),
        note: 'Try this: estimate the hours behind something you bought today.',
      },
    ],
    takeaway:
      'Prices carry stories about time and effort, and your time is valuable too.',
  },
  'Earning & Work/More Than a Paycheck': {
    title: 'A good job can pay in more than money',
    kicker: 'Read the whole reward',
    readTimeMinutes: 2,
    introduction:
      'Income is important, but a role can also offer experience, relationships, flexibility, practice, and a path toward something you want next.',
    heroImage: unsplashImage(
      'photo-1497366754035-f200968a6e72',
      'A bright shared office with people working at different tables',
      'The whole work experience is part of the reward.',
    ),
    sections: [
      {
        heading: 'Look for the learning bonus',
        body: 'A first job can teach you how to show up, communicate, handle feedback, and work with other people. Those skills keep with you after the schedule ends.',
        image: unsplashImage(
          'photo-1551836022-d5d88e9218df',
          'People in a friendly work conversation',
          'Experience is part of the package.',
        ),
      },
      {
        heading: 'Compare the whole picture',
        body: 'Before accepting, look at hours, safety, learning, support, and what the job does to the rest of your life. Money is one important part, not the only part.',
        image: unsplashImage(
          'photo-1524178232363-1fb2b075b655',
          'A person learning in a bright classroom',
          'A good choice supports the life around the work.',
        ),
        note: 'Compare the reward, the demands, and what you want to learn next.',
      },
    ],
    takeaway:
      'Evaluate the whole reward: pay, skills, relationships, and life around the work.',
  },
  'Earning & Work/Grow Your Skills': {
    title: 'Your earning power grows when your choices grow you',
    kicker: 'Build skills on purpose',
    readTimeMinutes: 2,
    introduction:
      'Skills are like tools: the more useful ones you practise, the more choices you can make. Progress can start with one small project.',
    heroImage: unsplashImage(
      'photo-1498050108023-c5249f4df085',
      'A person working at a laptop with a bright screen',
      'Practice turns an idea into a useful skill.',
    ),
    sections: [
      {
        heading: 'Choose a skill with a real use',
        body: 'Pick something you can practise and show: fixing a bike, editing a video, writing clearly, coding, caring for a pet, or organising an event.',
        image: unsplashImage(
          'photo-1503676260728-1c00da094a0b',
          'A student writing notes at a desk',
          'Every skill begins with a first attempt.',
        ),
      },
      {
        heading: 'Make practice visible',
        body: 'Set a small weekly target, keep examples of what you can do, and ask someone skilled for feedback. Evidence turns “I am learning” into “I can do this.”',
        image: unsplashImage(
          'photo-1521737711867-e3b97375f902',
          'People sharing ideas around a table',
          'Feedback helps a skill become shareable.',
        ),
        note: 'One project can teach you more than a month of passive scrolling.',
      },
    ],
    takeaway:
      'Choose a useful skill, practise it on purpose, and keep visible evidence of progress.',
  },
};

const SEED_COURSES = [
  {
    name: 'Money Basics',
    creatorEmail: 'author@pennywise.app',
    published: true,
    lessons: [
      {
        name: 'What Is Money?',
        description:
          'Learn what money is, where the idea came from, and why we use it every day.',
        estimatedDurationOfCompletionInMinutes: 10,
        experience: 10,
        pages: [
          {
            type: 'multiple_choice',
            text: 'Money is best described as...',
            options: [
              {
                answerText: 'A way to trade value with others',
                isCorrect: true,
              },
              { answerText: 'Something only adults can use', isCorrect: false },
              { answerText: 'A card you wave at the shop', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each term with its meaning.',
            pairs: [
              { word: 'currency', definition: 'money used by a country' },
              { word: 'coins', definition: 'round metal money' },
              { word: 'notes', definition: 'paper money' },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'Which of these is money?',
            options: [
              { answerText: 'A 10-cent dime', isCorrect: true },
              { answerText: 'A picture of a dollar', isCorrect: false },
              { answerText: 'A toy banknote', isCorrect: false },
            ],
          },
        ],
      },
      {
        name: 'Coins & Notes',
        description: 'Identify each coin and note by its value and name.',
        estimatedDurationOfCompletionInMinutes: 12,
        experience: 10,
        pages: [
          {
            type: 'multiple_choice',
            text: 'How much is a coin marked "25" worth?',
            options: [
              { answerText: '25 cents', isCorrect: true },
              { answerText: '5 cents', isCorrect: false },
              { answerText: '$25', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each coin to its value.',
            pairs: [
              { word: 'quarter', definition: '25 cents' },
              { word: 'dime', definition: '10 cents' },
              { word: 'nickel', definition: '5 cents' },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'Which note is worth more, a $20 note or a $5 note?',
            options: [
              { answerText: 'A $20 note', isCorrect: true },
              { answerText: 'A $5 note', isCorrect: false },
              { answerText: 'They are worth the same', isCorrect: false },
            ],
          },
        ],
      },
      {
        name: 'Counting Total Value',
        description:
          'Add up a group of coins and notes to find the total amount.',
        estimatedDurationOfCompletionInMinutes: 15,
        experience: 15,
        pages: [
          {
            type: 'multiple_choice',
            text: 'Two quarters and three dimes add up to...',
            options: [
              { answerText: '80 cents', isCorrect: true },
              { answerText: '60 cents', isCorrect: false },
              { answerText: '$1.00', isCorrect: false },
            ],
          },
          {
            type: 'budgeting',
            text: 'You started with a dollar. Reach your savings goal while buying treats.',
            startingAmount: 100,
            targetSavings: 30,
            availableItems: [
              { name: 'Sticker', cost: 15 },
              { name: 'Pencil', cost: 10 },
              { name: 'Juice box', cost: 25 },
              { name: 'Toy eraser', cost: 20 },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'A $20 note, a $10 note, and a $5 note total...',
            options: [
              { answerText: '$35', isCorrect: true },
              { answerText: '$25', isCorrect: false },
              { answerText: '$40', isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Smart Spending',
    creatorEmail: 'anotherauthor@pennywise.app',
    published: true,
    lessons: [
      {
        name: 'Needs vs Wants',
        description:
          'Sort the things you must have from the things you would like to have.',
        estimatedDurationOfCompletionInMinutes: 10,
        experience: 10,
        pages: [
          {
            type: 'wants_needs',
            text: 'Sort each item into want or need.',
            itemsToSort: [
              { name: 'Bread', correctCategory: 'need' },
              { name: 'Video game', correctCategory: 'want' },
              { name: 'School shoes', correctCategory: 'need' },
              { name: 'Novelty cap', correctCategory: 'want' },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'Which of these is a need?',
            options: [
              { answerText: 'Clean drinking water', isCorrect: true },
              { answerText: 'A tablet', isCorrect: false },
              { answerText: 'A theme-park ticket', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each item to its group.',
            pairs: [
              { word: 'rent', definition: 'need' },
              { word: 'holiday toy', definition: 'want' },
              { word: 'doctor visit', definition: 'need' },
            ],
          },
        ],
      },
      {
        name: 'Making Change',
        description:
          'Figure out the correct change when you pay more than a price.',
        estimatedDurationOfCompletionInMinutes: 12,
        experience: 15,
        pages: [
          {
            type: 'multiple_choice',
            text: 'You pay $5 for a $3 toy. How much change do you get?',
            options: [
              { answerText: '$2', isCorrect: true },
              { answerText: '$1', isCorrect: false },
              { answerText: '$3', isCorrect: false },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'A snack costs 75¢ and you pay $2. Your change is...',
            options: [
              { answerText: '$1.25', isCorrect: true },
              { answerText: '75¢', isCorrect: false },
              { answerText: '$1.75', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each bill to the change returned from a $5 note.',
            pairs: [
              { word: '$3.50 item', definition: '$1.50 change' },
              { word: '$1.00 item', definition: '$4.00 change' },
              { word: '$4.25 item', definition: '75¢ change' },
            ],
          },
        ],
      },
      {
        name: 'Save or Spend?',
        description:
          'Plan a small budget and decide what to buy today versus save for later.',
        estimatedDurationOfCompletionInMinutes: 15,
        experience: 15,
        pages: [
          {
            type: 'budgeting',
            text: 'You have a $5 allowance. Keep some savings and still enjoy a treat.',
            startingAmount: 500,
            targetSavings: 200,
            availableItems: [
              { name: 'Comic book', cost: 150 },
              { name: 'Candy bundle', cost: 100 },
              { name: 'Savings coin', cost: 200 },
              { name: 'Keychain', cost: 75 },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'What is the best move when your target savings is reached early?',
            options: [
              {
                answerText: 'Save the extra for a bigger goal',
                isCorrect: true,
              },
              { answerText: 'Spend everything right away', isCorrect: false },
              { answerText: 'Give it all away immediately', isCorrect: false },
            ],
          },
          {
            type: 'wants_needs',
            text: 'Sort the budget lines into want or need.',
            itemsToSort: [
              { name: 'Lunch', correctCategory: 'need' },
              { name: 'Arcade tokens', correctCategory: 'want' },
              { name: 'Bus fare', correctCategory: 'need' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Saving Goals',
    creatorEmail: 'author@pennywise.app',
    published: true,
    lessons: [
      {
        name: 'Set a Savings Target',
        description:
          'Turn a vague wish into a goal with an amount, a date, and a realistic plan.',
        estimatedDurationOfCompletionInMinutes: 10,
        experience: 10,
        pages: [
          {
            type: 'multiple_choice',
            text: 'Which savings goal is the most specific?',
            options: [
              {
                answerText: 'Save $30 for headphones by Friday',
                isCorrect: true,
              },
              { answerText: 'Save more for a nice thing', isCorrect: false },
              { answerText: 'Be better with money', isCorrect: false },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'What should you do first when a goal feels too expensive?',
            options: [
              {
                answerText: 'Check the amount, date, and realistic plan',
                isCorrect: true,
              },
              {
                answerText: 'Spend the whole balance right away',
                isCorrect: false,
              },
              { answerText: 'Give up before trying', isCorrect: false },
            ],
          },
        ],
      },
      {
        name: 'Build a Tiny Habit',
        description:
          'Make progress easier by choosing a small deposit you can repeat.',
        estimatedDurationOfCompletionInMinutes: 12,
        experience: 10,
        pages: [
          {
            type: 'budgeting',
            text: 'You have $5 to work with. Save a small amount first, then choose a fun item.',
            startingAmount: 500,
            targetSavings: 100,
            availableItems: [
              { name: 'Sticker', cost: 50 },
              { name: 'Savings top-up', cost: 100 },
              { name: 'Comic', cost: 200 },
              { name: 'Snack', cost: 75 },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'Which habit is most likely to last?',
            options: [
              {
                answerText: 'A small deposit I can repeat every week',
                isCorrect: true,
              },
              {
                answerText: 'A perfect month with no mistakes',
                isCorrect: false,
              },
              {
                answerText: 'Waiting until I feel motivated',
                isCorrect: false,
              },
            ],
          },
        ],
      },
      {
        name: 'The Three Buckets',
        description:
          'Separate future goals, fun money, and flexible spending so each choice has a place.',
        estimatedDurationOfCompletionInMinutes: 15,
        experience: 15,
        pages: [
          {
            type: 'matching',
            text: 'Match each bucket to the job it does.',
            pairs: [
              {
                word: 'Future goals',
                definition: 'money set aside for a later plan',
              },
              { word: 'Fun now', definition: 'money for a chosen enjoyment' },
              { word: 'Flexible', definition: 'money left for changing needs' },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'What makes a bucket rule useful?',
            options: [
              {
                answerText:
                  'It tells you when money moves and what can change it',
                isCorrect: true,
              },
              {
                answerText: 'It changes every time you feel bored',
                isCorrect: false,
              },
              { answerText: 'It hides the goal completely', isCorrect: false },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Earning & Work',
    creatorEmail: 'anotherauthor@pennywise.app',
    published: true,
    lessons: [
      {
        name: 'Your Time Has Value',
        description:
          'Notice the time, effort, and skills hidden behind the price of a product.',
        estimatedDurationOfCompletionInMinutes: 10,
        experience: 10,
        pages: [
          {
            type: 'multiple_choice',
            text: 'Why can a price tell only part of a product’s story?',
            options: [
              {
                answerText:
                  'Materials, transport, and people’s time all contribute',
                isCorrect: true,
              },
              {
                answerText: 'The price is always the person’s whole story',
                isCorrect: false,
              },
              { answerText: 'Only the colour matters', isCorrect: false },
            ],
          },
          {
            type: 'matching',
            text: 'Match each clue to the value it represents.',
            pairs: [
              { word: 'Time', definition: 'hours spent learning or working' },
              {
                word: 'Skill',
                definition: 'ability used to make something valuable',
              },
              {
                word: 'Materials',
                definition: 'resources used to create a product',
              },
            ],
          },
        ],
      },
      {
        name: 'More Than a Paycheck',
        description:
          'Compare the whole reward of a job: pay, experience, relationships, and life around the work.',
        estimatedDurationOfCompletionInMinutes: 12,
        experience: 10,
        pages: [
          {
            type: 'multiple_choice',
            text: 'Which is a non-money reward of a good first job?',
            options: [
              {
                answerText: 'Learning how to communicate and work with others',
                isCorrect: true,
              },
              { answerText: 'No chance to learn anything', isCorrect: false },
              { answerText: 'Having no schedule', isCorrect: false },
            ],
          },
          {
            type: 'multiple_choice',
            text: 'What should you compare before accepting a role?',
            options: [
              {
                answerText: 'Pay, hours, safety, support, and learning',
                isCorrect: true,
              },
              { answerText: 'Only the logo', isCorrect: false },
              { answerText: 'Only what your friends think', isCorrect: false },
            ],
          },
        ],
      },
      {
        name: 'Grow Your Skills',
        description:
          'Choose a useful skill, practise it on purpose, and keep visible evidence of your progress.',
        estimatedDurationOfCompletionInMinutes: 15,
        experience: 15,
        pages: [
          {
            type: 'multiple_choice',
            text: 'What makes a skill easier to build?',
            options: [
              {
                answerText: 'A real use and a small weekly practice target',
                isCorrect: true,
              },
              {
                answerText: 'Waiting for natural talent to appear',
                isCorrect: false,
              },
              {
                answerText: 'Never showing anyone your work',
                isCorrect: false,
              },
            ],
          },
          {
            type: 'matching',
            text: 'Match each action to the skill-building habit it supports.',
            pairs: [
              { word: 'Practise', definition: 'use the skill again and again' },
              {
                word: 'Collect',
                definition: 'keep examples of what you can do',
              },
              { word: 'Ask', definition: 'use feedback to improve' },
            ],
          },
        ],
      },
    ],
  },
];

const WALLETS = [
  {
    email: 'learn.sara@pennywise.app',
    type: 'immediate',
    total: 12.5,
  },
  {
    email: 'learn.sara@pennywise.app',
    type: 'long-term',
    total: 40,
  },
  {
    email: 'learn.kofi@pennywise.app',
    type: 'immediate',
    total: 8,
  },
  {
    email: 'learn.kofi@pennywise.app',
    type: 'long-term',
    total: 25,
  },
];

async function dropLegacyCollections() {
  const legacy = ['learners', 'modules', 'progress'];
  for (const name of legacy) {
    try {
      await mongoose.connection.dropCollection(name);
      console.log(`Dropped legacy collection "${name}"`);
    } catch {
      // collection does not exist - ignore
    }
  }
}

async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

async function seed({ mongoUri } = {}) {
  await connectDB(mongoUri);

  await Promise.all([
    Wallet.deleteMany({}),
    LessonProgress.deleteMany({}),
    Page.deleteMany({}),
    Lesson.deleteMany({}),
    Course.deleteMany({}),
    Money.deleteMany({}),
  ]);
  await dropLegacyCollections();

  const country = await Country.findOneAndUpdate(
    { name: USD_COUNTRY },
    { name: USD_COUNTRY },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );

  const money = await Money.create({
    name: 'United States Dollar',
    coins: USD_COINS,
    notes: USD_NOTES,
    country: country._id,
  });

  const usersByEmail = {};
  for (const seedUser of SEED_USERS) {
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const user = await Learner.findOneAndUpdate(
      { email: seedUser.email },
      {
        email: seedUser.email,
        displayName: seedUser.displayName,
        role: seedUser.role,
        passwordHash: passwordHash,
        country: country._id,
        coursesEnrolled: [],
        completedLessons: [],
        experience: 0,
        currentStreak: 0,
        longestStreak: 0,
        currentLives: 5,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    usersByEmail[seedUser.email] = user;
  }

  const authorsByEmail = {};
  for (const seedAuthor of SEED_AUTHORS) {
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const author = await Author.findOneAndUpdate(
      { email: seedAuthor.email },
      {
        email: seedAuthor.email,
        displayName: seedAuthor.displayName,
        role: seedAuthor.role,
        passwordHash: passwordHash,
        country: country._id,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    authorsByEmail[seedAuthor.email] = author;
  }

  const courses = [];
  let lessonCount = 0;
  let pageCount = 0;
  for (const courseData of SEED_COURSES) {
    const creator = authorsByEmail[courseData.creatorEmail];
    const course = await Course.create({
      creatorId: creator._id,
      name: courseData.name,
      published: courseData.published,
      lessons: [],
    });

    const lessonIds = [];
    for (const lessonData of courseData.lessons) {
      const lesson = await Lesson.create({
        courseId: course._id,
        name: lessonData.name,
        description: lessonData.description,
        experience: lessonData.experience,
        estimatedDurationOfCompletionInMinutes:
          lessonData.estimatedDurationOfCompletionInMinutes,
        briefLesson: BRIEF_LESSONS[`${courseData.name}/${lessonData.name}`],
        pages: [],
      });

      const pageIds = [];
      for (const pageData of lessonData.pages) {
        const page = await Page.create({
          lessonId: lesson._id,
          text: pageData.text,
          type: pageData.type,
          options: pageData.options,
          pairs: pageData.pairs,
          startingAmount: pageData.startingAmount,
          targetSavings: pageData.targetSavings,
          availableItems: pageData.availableItems,
          itemsToSort: pageData.itemsToSort,
        });
        pageIds.push(page._id);
        pageCount += 1;
      }

      lesson.pages = pageIds;
      await lesson.save();
      lessonIds.push(lesson._id);
      lessonCount += 1;
    }

    course.lessons = lessonIds;
    await course.save();
    courses.push(course);

    // creator.coursesCreated.push(course._id);
    // await creator.save();
  }

  for (const walletData of WALLETS) {
    await Wallet.create({
      user: usersByEmail[walletData.email]._id,
      total: walletData.total,
      country: country._id,
      denominations: money._id,
      type: walletData.type,
    });
  }

  console.log('Seed complete.');
  console.log(`  Country : ${country.name}`);
  console.log(
    `  Money   : ${money.name} (${money.coins.length} coins, ${money.notes.length} notes)`,
  );
  console.log(`  Users   : ${SEED_USERS.map((u) => u.email).join(', ')}`);
  console.log(`  Author  : ${SEED_AUTHORS.map((u) => u.email).join(', ')}`);
  console.log(`             password: ${DEMO_PASSWORD}`);
  console.log(
    `  Courses : ${courses.map((c) => c.name).join(', ')} (${lessonCount} lessons, ${pageCount} pages)`,
  );
  console.log(`  Wallets : ${WALLETS.length}`);

  await mongoose.connection.close();
  return {
    country,
    money,
    usersByEmail,
    authorsByEmail,
    courses,
    lessonCount,
    pageCount,
    walletCount: WALLETS.length,
  };
}

module.exports = {
  seed,
  SEED_USERS,
  DEMO_PASSWORD,
  BRIEF_LESSONS,
};

if (require.main === module) {
  const { MONGODB_URI } = process.env;
  seed({ mongoUri: MONGODB_URI }).catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

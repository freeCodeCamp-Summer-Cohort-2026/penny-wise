require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');
const Country = require('./models/country');
const Money = require('./models/money');
const Learner = require('./models/learner');
const Wallet = require('./models/wallet');
const Module = require('./models/module');
const Progress = require('./models/progress');

const DEMO_PASSWORD = 'PennyWise-123';
const DEMO_EMAIL = 'learner@pennywise.app';

const USD_COUNTRY = 'United States';

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

const MODULES = [
  {
    icon: '💵',
    name: 'Money Master',
    description:
      'Identify and count different denominations and calculate totals.',
    lessons: [
      {
        title: 'Know Your Coins & Notes',
        content:
          'Money comes in coins and notes, and each one carries a value you can read from the number printed on it. Pennies, nickels, dimes, and quarters are coins; notes come in $1, $5, $10, $20, $50, and $100.',
        state: 'published',
        interactive_section: [
          {
            question: 'How much is a coin marked "25" worth?',
            image: '/images/lesson/quarter.png',
            answer: '25 cents',
          },
          {
            question: 'Which note is worth the most: $5, $20, or $100?',
            image: '/images/lesson/notes.png',
            answer: '$100',
          },
        ],
      },
      {
        title: 'Counting Total Value',
        content:
          'To find a total, group matching coins and notes, then add them. Start with the largest values first — it keeps the adding simple and fast.',
        state: 'published',
        interactive_section: [
          {
            question: 'Two quarters and three dimes equal how many cents?',
            image: '/images/lesson/quarters-dimes.png',
            answer: '80 cents',
          },
          {
            question: 'A $20 note, a $10 note, and a $5 note total how much?',
            image: '/images/lesson/notes-bundle.png',
            answer: '$35',
          },
        ],
      },
      {
        title: 'The Quick Total',
        content:
          'Practice adding a mixed handful: count the notes first, then the coins, then combine the two.',
        state: 'published',
        interactive_section: [
          {
            question:
              'A $1 note, three quarters, and a nickel add up to how much?',
            image: '/images/lesson/mixed.png',
            answer: '$1.80',
          },
        ],
      },
    ],
    labs: [
      {
        name: 'Count & Conquer',
        description:
          'Sort a messy money tray and total every denomination quickly.',
        intro:
          'You are running the money table at the school fair. Coins and notes are all mixed up — sort them, count them, and make change for happy customers.',
        state: 'published',
        steps: [
          {
            type: 'earn',
            task: 'Sort the tray by putting each coin with its matching value group. Which order works best?',
            image: '/images/lab/money-tray.png',
            choices: [
              'Largest to smallest value',
              'Smallest to largest only',
              'Any order is fine',
            ],
          },
          {
            type: 'save',
            task: 'The fair booth earned two $5 notes, three $1 notes, and a quarter. What is the total?',
            image: '/images/lab/fair-booth.png',
            choices: ['$13.25', '$11.25', '$12.25'],
          },
          {
            type: 'spend',
            task: 'You buy a lemonade for 95¢ and pay with a $1 note and a nickel. How much change do you get?',
            image: '/images/lab/lemonade.png',
            choices: ['10¢', '5¢', '15¢'],
          },
        ],
      },
    ],
  },
  {
    icon: '🧮',
    name: 'Make the Change',
    description: 'Run a simulated shop and give customers the correct change.',
    lessons: [
      {
        title: 'Change Is a Difference',
        content:
          'Change is what you get back when you pay more than a price. Work it out as: amount paid − price.',
        state: 'published',
        interactive_section: [
          {
            question: 'You pay $5 for a $3 toy. How much change do you get?',
            image: '/images/lesson/toyshop.png',
            answer: '$2',
          },
          {
            question: 'The price is $1.25 and you pay $2. How much change?',
            image: '/images/lesson/register.png',
            answer: '75 cents',
          },
        ],
      },
      {
        title: 'Counting Back, Up and Up',
        content:
          'Count the change UP from the price to the amount paid. Starting low and climbing to the paid amount is the fastest way to stay correct.',
        state: 'published',
        interactive_section: [
          {
            question: 'From 35¢ up to $1, which coins do you count back first?',
            image: '/images/lesson/counting-up.png',
            answer: 'A quarter, then two dimes, then a nickel',
          },
          {
            question: 'From $4.50 up to $5, what do you hand back?',
            image: '/images/lesson/handing-back.png',
            answer: 'Two quarters (50¢)',
          },
        ],
      },
      {
        title: 'Hand-Over & Smile',
        content:
          'Give change using the fewest coins and notes when you can. Your customers will thank you — and your till will stay neater too.',
        state: 'published',
        interactive_section: [
          {
            question: 'What is 30¢ of change using the fewest coins?',
            image: '/images/lesson/change-30c.png',
            answer: 'A quarter and a nickel',
          },
          {
            question: 'What is $3 of change using the fewest notes?',
            image: '/images/lesson/change-3.png',
            answer: 'Three $1 notes',
          },
        ],
      },
    ],
    labs: [
      {
        name: 'Penny Pals Shop',
        description:
          'Run the corner shop register and give every customer the correct change.',
        intro:
          'Welcome to your own shop counter! Customers will hand you cash — count the change carefully so everyone walks away happy.',
        state: 'published',
        steps: [
          {
            type: 'spend',
            task: 'A pencil costs 30¢. The customer hands you $1. How much change do you give?',
            image: '/images/lab/shop-pencil.png',
            choices: ['70¢', '30¢', '60¢'],
          },
          {
            type: 'spend',
            task: 'A toy car costs $2.50. The customer pays with a $5 note. Count back the change.',
            image: '/images/lab/shop-toy.png',
            choices: ['$2.50', '$1.50', '$3.50'],
          },
          {
            type: 'earn',
            task: 'Ring up three items: $1.20, 85¢, and $1.95. What is the total?',
            image: '/images/lab/shop-register.png',
            choices: ['$4.00', '$3.75', '$4.25'],
          },
          {
            type: 'save',
            task: 'A $10 note covers a $6.85 order. How much change goes back to the customer?',
            image: '/images/lab/shop-cash.png',
            choices: ['$3.15', '$4.15', '$3.85'],
          },
        ],
      },
    ],
  },
];

async function seed({ mongoUri } = {}) {
  await connectDB(mongoUri);

  await Promise.all([
    Module.deleteMany({}),
    Wallet.deleteMany({}),
    Progress.deleteMany({}),
    Money.deleteMany({}),
  ]);

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

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const learner = await Learner.findOneAndUpdate(
    { email: DEMO_EMAIL },
    {
      email: DEMO_EMAIL,
      displayName: 'Penny Wise Learner',
      passwordHash,
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );

  await Wallet.create([
    {
      learner: learner._id,
      total: 12.5,
      country: country._id,
      denominations: money._id,
      type: 'immediate',
    },
    {
      learner: learner._id,
      total: 40,
      country: country._id,
      denominations: money._id,
      type: 'long-term',
    },
  ]);

  const modules = await Module.create(MODULES);

  const progressDocs = [];
  for (const module of modules) {
    for (const lesson of module.lessons) {
      progressDocs.push({
        learner: learner._id,
        module: module._id,
        itemId: lesson._id,
        itemType: 'lesson',
        state: 'not-started',
      });
    }
    for (const lab of module.labs) {
      progressDocs.push({
        learner: learner._id,
        module: module._id,
        itemId: lab._id,
        itemType: 'lab',
        state: 'not-started',
      });
    }
  }
  await Progress.create(progressDocs);

  console.log('Seed complete.');
  console.log(`  Country : ${country.name}`);
  console.log(
    `  Money   : ${money.name} (${money.coins.length} coins, ${money.notes.length} notes)`,
  );
  console.log(`  Learner : ${learner.email}  (password: ${DEMO_PASSWORD})`);
  console.log(
    `  Modules : ${modules.map((m) => `${m.icon} ${m.name}`).join(', ')}`,
  );
  console.log(`  Wallets : immediate + long-term`);
  console.log(`  Progress: ${progressDocs.length} records`);

  await mongoose.connection.close();
  return {
    country,
    money,
    learner,
    modules,
    walletCount: 2,
    progressCount: progressDocs.length,
  };
}

module.exports = { seed, DEMO_EMAIL, DEMO_PASSWORD };

if (require.main === module) {
  const { MONGODB_URI } = process.env;
  seed({ mongoUri: MONGODB_URI }).catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

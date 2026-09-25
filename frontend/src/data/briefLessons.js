const image = (photoId, alt, caption) => ({
  url: `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&q=85`,
  alt,
  caption,
});

export const fallbackBriefLessons = {
  money: {
    title: 'Money is a shared agreement',
    kicker: 'A tiny idea with a big job',
    readTimeMinutes: 2,
    introduction:
      'Money is a promise that lets people trade things they value without needing to carry everything they want to swap.',
    heroImage: image(
      'photo-1579621970563-ebec7560ff3e',
      'A person planning a budget beside a laptop',
      'Money helps turn a plan into a choice.',
    ),
    sections: [
      {
        heading: 'Three jobs money does',
        body: 'Money can measure value, make a trade fair, and store a little purchasing power for later.',
        image: image(
          'photo-1526304640581-d334cdbbf45e',
          'Coins and banknotes arranged on a table',
          'Different forms can carry one shared idea.',
        ),
      },
      {
        heading: 'Trust makes it work',
        body: 'A money system works when people believe the value they give will be accepted in return.',
        image: image(
          'photo-1556742049-0cfed4f6a45d',
          'A person making a contactless payment',
          'Even digital payments rely on a shared promise.',
        ),
      },
    ],
    takeaway:
      'Money is a shared agreement about value, not just a thing you carry.',
  },
  spending: {
    title: 'Needs, wants, and the sneaky in-between',
    kicker: 'A kinder way to make a spending choice',
    readTimeMinutes: 2,
    introduction:
      'A need supports your health, safety, or ability to learn. A want is something you would enjoy. Plenty of choices sit in the thoughtful middle.',
    heroImage: image(
      'photo-1542838132-92c53300491e',
      'A colourful market with fresh choices on display',
      'Every choice has a story behind its price.',
    ),
    sections: [
      {
        heading: 'Start with the job the item does',
        body: 'Ask what happens if the item is not there. Food, safe transport, and school supplies may protect daily life.',
        image: image(
          'photo-1441986300917-64674bd600d8',
          'A shop display with clothing and accessories',
          'A want can be fun without being essential.',
        ),
      },
      {
        heading: 'The in-between needs a plan',
        body: 'A game, a snack, or a new notebook may be educational, social, or motivating. Context helps you make the trade-off fairly.',
        image: image(
          'photo-1495474472287-4d71bcdd2085',
          'A warm drink and notebook on a study table',
          'A thoughtful maybe can be the best answer.',
        ),
      },
    ],
    takeaway:
      'You do not have to choose between a good choice and a fun choice to make a smart decision.',
  },
  saving: {
    title: 'A big dream gets easier when it has a number',
    kicker: 'Give your goal a finish line',
    readTimeMinutes: 2,
    introduction:
      'A savings goal is easier to chase when you can picture the amount, the date, and the small steps that will get you there.',
    heroImage: image(
      'photo-1579621970563-ebec7560ff3e',
      'A person reviewing a savings plan',
      'A goal becomes real when it has a number and a date.',
    ),
    sections: [
      {
        heading: 'Name the exact finish line',
        body: 'Instead of “save more,” try “save 30 dollars for headphones by the end of the month.”',
        image: image(
          'photo-1517842645767-c639042777db',
          'A notebook with a goal written on the page',
          'Specific goals are easier to revisit.',
        ),
      },
      {
        heading: 'Check the plan, not just the wish',
        body: 'Compare the amount you can realistically set aside with the price of the goal, then adjust the target or timeline.',
        image: image(
          'photo-1554224155-6726b3ff858f',
          'A calculator, notebook, and financial notes',
          'A realistic plan protects your motivation.',
        ),
      },
    ],
    takeaway:
      'Name the amount, the date, and the reason; then make the plan realistic.',
  },
  work: {
    title: 'Your time is valuable because it is limited',
    kicker: 'Notice the trade behind every purchase',
    readTimeMinutes: 2,
    introduction:
      'Money is often a receipt for time, effort, skill, or a resource someone else provided. Seeing the trade makes prices feel less mysterious.',
    heroImage: image(
      'photo-1521737711867-e3b97375f902',
      'A group of people working together around a table',
      'A price can tell a story about time and effort.',
    ),
    sections: [
      {
        heading: 'Look for the work behind the price',
        body: 'A product may include design, materials, transport, care, and the worker’s time.',
        image: image(
          'photo-1524178232363-1fb2b075b655',
          'A learner taking notes in a classroom',
          'Skills grow through time and practice.',
        ),
      },
      {
        heading: 'Your time has a value too',
        body: 'Before agreeing to work, ask what you are learning, what you can offer, and how the time will be used.',
        image: image(
          'photo-1517245386807-bb43f82c33c4',
          'People collaborating around a shared workspace',
          'A fair exchange makes the effort visible.',
        ),
      },
    ],
    takeaway:
      'Prices carry stories about time and effort, and your time is valuable too.',
  },
};

const briefLessonByCourse = {
  'money basics': fallbackBriefLessons.money,
  'smart spending': fallbackBriefLessons.spending,
  'saving goals': fallbackBriefLessons.saving,
  'earning & work': fallbackBriefLessons.work,
};

export function getFallbackBriefLesson(courseName) {
  return (
    briefLessonByCourse[
      String(courseName ?? '')
        .toLowerCase()
        .trim()
    ] || fallbackBriefLessons.money
  );
}

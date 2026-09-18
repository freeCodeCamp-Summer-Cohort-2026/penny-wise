import { Link, useParams } from 'react-router-dom';

const modules = [
  {
    id: 1,
    name: 'Money Basics',
    description:
      'Learn what money does, where it goes, and how to stay in charge.',
    lessons: [
      {
        id: 1,
        title: 'What is Money?',
        description:
          'Learn what classifies a currency and where the idea of currency came from.',
        duration: 5,
      },
      {
        id: 2,
        title: 'Why do we use Money?',
        description:
          'Understand the purposes and benefits of using money in daily life.',
        duration: 6,
      },
      {
        id: 3,
        title: 'Where does it come from?',
        description:
          "Learn where money comes from, including how it's created and circulated in the economy.",
        duration: 4,
      },
      {
        id: 4,
        title: 'Where does it go?',
        description:
          'Understand where money goes, including common expenses and how to manage your spending.',
        duration: 4,
      },
      {
        id: 5,
        title: 'How do we stay in Charge?',
        description:
          'Learn how to take control of your finances, set goals, and make informed decisions.',
        duration: 10,
      },
    ],
  },

  {
    id: 2,
    name: 'Smart Spending',
    description:
      'Spot trade-offs, compare choices, and spend without the regret.',
    lessons: [
      {
        id: 1,
        title: 'Smart Spending1',
        description:
          'Learn what classifies a currency and where the idea of currency came from.',
        duration: 5,
      },
      {
        id: 2,
        title: 'Smart Spending2',
        description:
          'Understand the purposes and benefits of using money in daily life.',
        duration: 6,
      },
      {
        id: 3,
        title: 'Smart Spending3',
        description:
          "Learn where money comes from, including how it's created and circulated in the economy.",
        duration: 4,
      },
      {
        id: 4,
        title: 'Smart Spending4',
        description:
          'Understand where money goes, including common expenses and how to manage your spending.',
        duration: 4,
      },
      {
        id: 5,
        title: 'Smart Spending5',
        description:
          'Learn how to take control of your finances, set goals, and make informed decisions.',
        duration: 10,
      },
    ],
  },

  {
    id: 3,
    name: 'Saving Goals',
    description:
      'Turn big dreams into small steps you can actually stick with.',
    lessons: [
      {
        id: 1,
        title: 'Saving Goals1',
        description:
          'Learn what classifies a currency and where the idea of currency came from.',
        duration: 5,
      },
      {
        id: 2,
        title: 'Saving Goals2',
        description:
          'Understand the purposes and benefits of using money in daily life.',
        duration: 6,
      },
      {
        id: 3,
        title: 'Saving Goals3',
        description:
          "Learn where money comes from, including how it's created and circulated in the economy.",
        duration: 4,
      },
      {
        id: 4,
        title: 'Saving Goals4',
        description:
          'Understand where money goes, including common expenses and how to manage your spending.',
        duration: 4,
      },
      {
        id: 5,
        title: 'Saving Goals5',
        description:
          'Learn how to take control of your finances, set goals, and make informed decisions.',
        duration: 10,
      },
    ],
  },

  {
    id: 4,
    name: 'Earning & Work',
    description: 'Explore ways to earn and understand what your time is worth.',
    lessons: [
      {
        id: 1,
        title: 'Earning & Work1',
        description:
          'Learn what classifies a currency and where the idea of currency came from.',
        duration: 5,
      },
      {
        id: 2,
        title: 'Earning & Work2',
        description:
          'Understand the purposes and benefits of using money in daily life.',
        duration: 6,
      },
      {
        id: 3,
        title: 'Earning & Work3',
        description:
          "Learn where money comes from, including how it's created and circulated in the economy.",
        duration: 4,
      },
      {
        id: 4,
        title: 'Earning & Work4',
        description:
          'Understand where money goes, including common expenses and how to manage your spending.',
        duration: 4,
      },
      {
        id: 5,
        title: 'Earning & Work5',
        description:
          'Learn how to take control of your finances, set goals, and make informed decisions.',
        duration: 10,
      },
    ],
  },
];

const CoursePage = () => {
  const { moduleId, courseId } = useParams();

  const selectedModule = modules.find(
    (module) => module.id === Number(moduleId),
  );

  const selectedCourse = selectedModule?.lessons.find(
    (lesson) => lesson.id === Number(courseId),
  );

  if (!selectedModule || !selectedCourse) {
    return (
      <main className='p-4 max-w-7xl mx-auto text-left bg-[var(--bg)]'>
        <h1>Course not found</h1>

        <Link to='/modules' className='underline'>
          Back to modules
        </Link>
      </main>
    );
  }

  return (
    <main className='p-4 max-w-7xl mx-auto text-left bg-[var(--bg)] flex flex-col gap-8'>
      <section className='courseTitle'>
        <Link
          to={`/modules/${selectedModule.id}`}
          className='text-sm text-gray-600 hover:underline'
        >
          ← Back to {selectedModule.name}
        </Link>

        <h3 className='text-sm text-gray-600 mt-4'>
          Course #{selectedCourse.id.toString().padStart(4, '0')}
        </h3>

        <h1>{selectedCourse.title}</h1>

        <p className='text-gray-600'>{selectedCourse.description}</p>

        <p className='font-bold mt-2'>{selectedCourse.duration} minutes</p>
      </section>

      <section className='courseContent'>
        <h2>Lesson</h2>

        <div className='p-6 rounded shadow-md bg-[var(--accent-bg)]'>
          <h2 className='text-xl font-bold'>{selectedCourse.title}</h2>

          <p className='mt-4'>{selectedCourse.description}</p>

          <p className='mt-4 font-bold'>
            Duration: {selectedCourse.duration} minutes
          </p>
        </div>
      </section>
    </main>
  );
};

export default CoursePage;

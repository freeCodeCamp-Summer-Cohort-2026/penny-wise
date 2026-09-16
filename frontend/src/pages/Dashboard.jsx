import LessonArtwork from '../assets/Lesson-artwork.svg';
import wallet from '../assets/wallet_icon.svg';
import spending from '../assets/shopping_bag_icon.svg';
import saving from '../assets/target_icon.svg';
import earning from '../assets/stars_icon.svg';
import { Link } from 'react-router-dom';

const TOPIC_AMOUNT = 12;
const lesson = {
  title: 'Needs, wants, and the sneaky in-between',
  timeLeft: 8,
};

const topics = [
  {
    id: 1,
    icon: wallet,
    name: 'Money Basics',
    description:
      'Learn what money does, where it goes, and how to stay in charge.',
    lesson_count: 5,
  },
  {
    id: 2,
    icon: spending,
    name: 'Smart Spending',
    description:
      'Spot trade-offs, compare choices, and spend without the regret.',
    lesson_count: 4,
  },
  {
    id: 3,
    icon: saving,
    name: 'Saving Goals',
    description:
      'Turn big dreams into small steps you can actually stick with.',
    lesson_count: 6,
  },
  {
    id: 4,
    icon: earning,
    name: 'Earning & Work',
    description: 'Explore ways to earn and understand what your time is worth.',
    lesson_count: 4,
  },
];

const Dashboard = () => {
  return (
    <>
      <main className='p-4 max-w-7xl mx-auto text-left bg-[var(--bg)] grid gap-4 md:gap-8 auto-cols-fr rows-3'>
        <section className='dashboardHero'>
          <div>
            <h3 className='text-sm text-gray-600'>Learning Hub</h3>
            <h1>Make money make sense.</h1>
            <p>
              Quick lessons, real-life challenges, and zero boring lectures.
              Pick up where you left off or explore something new.
            </p>
          </div>
          <div>{/* <p>STREAK INFO GOES HERE</p> */}</div>
        </section>
        <section className='continueLearning bg-[var(--accent-bg)] rounded p-6 m-2 grid grid-cols-6 gap-4 align-items-center items-center'>
          <div>
            {/* Lesson Image */}
            <img
              src={LessonArtwork}
              alt='Lesson artwork'
              className='w-full h-auto'
            />
          </div>
          <div className='col-span-4'>
            <p>CONTINUE LEARNING - {lesson.timeLeft} MIN</p>
            <h2>{lesson.title}</h2>
            {/* We may add a progress bar or other interactive elements here */}
          </div>
          <div>
            <button className='resumeButton rounded-lg bg-[var(--accent-bg)] px-4 py-2 hover:scale-103 hover:transition-colors hover:shadow-lg duration-300 cursor-pointer active:scale-95'>
              Resume →
            </button>
          </div>
        </section>

        <section className='exploreTopics'>
          <div className='flex justify-between items-center'>
            <h2>Explore topics</h2>
            <Link
              to='/modules'
              className='text-sm text-gray-600 cursor-pointer hover:underline'
            >
              view all {TOPIC_AMOUNT} →
            </Link>
          </div>
          <div className='topicCards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '>
            {topics &&
              topics.map((topic) => {
                return (
                  <Link key={topic.id} to={`/modules/${topic.id}`}>
                    <div className='topicCard p-6 m-2 rounded shadow-md text-left bg-[var(--accent-bg)] hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:scale-105'>
                      <img
                        src={topic.icon}
                        alt={topic.name}
                        className='w-12 h-12 mb-2'
                      />
                      <h2 className='text-lg font-bold'>{topic.name}</h2>
                      <p className='text-sm text-gray-600'>
                        {topic.description}
                      </p>
                      <p className='font-bold'>
                        {topic.lesson_count} lessons →
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      </main>

      {/*This is where the Footer is going to be*/}
    </>
  );
};

export default Dashboard;

import { Link, useParams } from 'react-router-dom';
import { modules } from '../data/modules';

const ModulesPage = () => {
  const { moduleId } = useParams();

  const selectedModule = moduleId
    ? modules.find((module) => module.id === Number(moduleId))
    : null;

  if (moduleId && !selectedModule) {
    return (
      <main className='p-4 max-w-7xl mx-auto text-left bg-[var(--bg)]'>
        <h1>Module not found</h1>
        <Link to='/modules' className='underline'>
          Back to modules
        </Link>
      </main>
    );
  }

  if (selectedModule) {
    return (
      <main className='p-4 max-w-7xl mx-auto text-left bg-[var(--bg)] flex flex-col gap-8'>
        <section>
          <Link
            to='/modules'
            className='text-sm text-gray-600 hover:underline'
          >
            ← Back to modules
          </Link>

          <h1>{selectedModule.name}</h1>

          <p className='text-gray-600'>{selectedModule.description}</p>
        </section>

        <section>
          <h2>Lessons</h2>

          <div className='lessonCards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
            {selectedModule.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/modules/${selectedModule.id}/course/${lesson.id}`}
                className='lessonCard p-6 m-2 rounded shadow-md text-left bg-[var(--accent-bg)] hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:scale-105'
              >
                <h3 className='text-lg font-bold'>{lesson.title}</h3>

                <p className='text-sm text-gray-600'>
                  {lesson.description}
                </p>

                <p className='font-bold'>{lesson.duration} minutes →</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='p-4 max-w-7xl mx-auto text-left bg-[var(--bg)] flex flex-col gap-8'>
      <section>
        <h1>Modules</h1>

        <p className='text-gray-600'>
          Browse modules and choose a topic to learn next.
        </p>
      </section>

      {modules.map((module) => (
        <section key={module.id} className='flex flex-col gap-4'>
          <div className='flex justify-between items-center'>
            <div>
              <h2>{module.name}</h2>

              <p className='text-gray-600'>{module.description}</p>
            </div>

            <Link
              to={`/modules/${module.id}`}
              className='text-sm text-gray-600 hover:underline'
            >
              view all {module.lessons.length} →
            </Link>
          </div>

          <div className='lessonCards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
            {module.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/modules/${module.id}/course/${lesson.id}`}
                className='lessonCard p-6 m-2 rounded shadow-md text-left bg-[var(--accent-bg)] hover:shadow-lg transition-shadow duration-300 cursor-pointer hover:scale-105'
              >
                <h3 className='text-lg font-bold'>{lesson.title}</h3>

                <p className='text-sm text-gray-600'>
                  {lesson.description}
                </p>

                <p className='font-bold'>{lesson.duration} minutes →</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default ModulesPage;

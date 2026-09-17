import { Link, useParams } from 'react-router-dom';
import { modules } from '../data/modules';

const CoursePage = () => {
  const { moduleId, courseId } = useParams();

  const selectedModule = modules.find(
    (module) => module.id === Number(moduleId)
  );

  const selectedCourse = selectedModule?.lessons.find(
    (lesson) => lesson.id === Number(courseId)
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

        <p className='font-bold mt-2'>
          {selectedCourse.duration} minutes
        </p>
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

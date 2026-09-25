import { Link } from 'react-router-dom';
import LessonArtwork from '../assets/Lesson-artwork.svg';

const ErrorPage = () => {
  return (
    <div className='flex flex-col h-screen justify-center'>
      <h2 className='!text-6xl '>404</h2>

      <h1 className='!text-red-500  text-4xl  '>
        Ooopss!! Something went wrong!!
      </h1>
      {/* OUR CHARACTER INSTEAD OF IMAGE */}
      <img className='h-10 ' src={LessonArtwork} alt='something' />

      <p className='text-sky-400 '>
        Maybe a fresh start --{'>'}{' '}
        <Link to='/' className='underline'>
          {' '}
          Landing Page
        </Link>
      </p>
    </div>
  );
};

export default ErrorPage;

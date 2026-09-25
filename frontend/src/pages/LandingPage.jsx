import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <main>
        <section>
          <h1>Title</h1>
          <p>A description of how this works</p>
        </section>

        <section>
          <h2>Benefits of the app</h2>
        </section>

        <section>
          <h2>Get Started Today</h2>
          <Link
            to='/signup'
            className='mt-4 inline-flex bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
          >
            Sign up
          </Link>
        </section>
      </main>
    </>
  );
};

export default LandingPage;

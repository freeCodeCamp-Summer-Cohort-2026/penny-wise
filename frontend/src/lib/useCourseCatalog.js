import { useEffect, useState } from 'react';
import { getCourses } from './api/penny-wise';

export function useCourseCatalog() {
  const [state, setState] = useState({
    courses: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    getCourses()
      .then((payload) => {
        if (!isMounted) return;
        const courses = Array.isArray(payload) ? payload : payload?.courses;
        setState({
          courses: Array.isArray(courses) ? courses : [],
          isLoading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!isMounted) return;
        setState({
          courses: [],
          isLoading: false,
          error,
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

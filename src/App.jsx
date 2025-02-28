import heroImg from "./assets/hero-img.png"
import Search from "./components/search"
import { useState, useEffect } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3/";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState(undefined);
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useDebounce(() => {
    setDebouncedSearch(search);
  }, 500, [search]);

  const fetchMovies = async (query = "") => {
    setLoading(true);

    try {
      const API_URL = query 
      ? `${BASE_URL}search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`
      : `${BASE_URL}movie/popular?api_key=${API_KEY}`;
      const response = await fetch(API_URL, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Error fetching movies");
      }
      const data = await response.json();
      // console.log(data);
      if (data.results.length === 0) {
        // setErrorMsg("No movies found");
        setMovies([]);
        return;
      }
      setMovies(data.results || []);
      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
      }
    }
    catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMsg("Error fetching movies. Please try again later.");
    }
    finally {
      setLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearch);
    
  }, [debouncedSearch]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src={heroImg} alt="Hero Image" />
          <h1>Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy Without the Hassle</h1>
          <Search search={search} setSearch={setSearch} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section>
          <h2 className="mt-[40px] mb-[20px] text-3 text-white">All Movies</h2>
          {
            loading? (
              <Spinner />
            ) : errorMsg ? (
              <p className="text-3 text-red-500 text-center mt-4">{errorMsg}</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                  movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))
                }
              </ul>
            )
          }
        </section>
        
      </div>
    </main>
  )
}

export default App

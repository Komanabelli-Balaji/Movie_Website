import PropTypes from "prop-types";

const MovieCard = ({ movie: 
    { title, poster_path, release_date, vote_average, original_language } 
}) => {
  return (
    <div className="movie-card">
      <img 
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/src/assets/No-Poster.png' } 
        alt={title} 
        className="w-full h-auto"
      />
      <h3>{title}</h3>
      <div className="content">
        <div className="rating">
            <img src="/src/assets/Rating.svg" alt="rating" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
        </div>
        <span>•</span>
        <p className="lang">{original_language}</p>
        <span>•</span>
        <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
      </div>
    </div>
  )
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    vote_average: PropTypes.number,
    original_language: PropTypes.string
  }).isRequired
}

export default MovieCard

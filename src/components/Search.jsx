import searchIcon from "../assets/search.svg"
import PropTypes from 'prop-types'

const Search = ({ search, setSearch }) => {
  return (
    <div className="search">
      <div>
        <img src={searchIcon} alt="Search Icon" />
        <input
        type="text"
        placeholder="Search for movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  )
}

Search.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired
}

export default Search

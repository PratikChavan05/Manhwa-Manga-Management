const SearchFilter = ({ query, setQuery, status, setStatus }) => {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search by title/author"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-card text-textPrimary px-4 py-2 rounded-md w-full"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-card text-textPrimary px-4 py-2 rounded-md"
      >
        <option value="All">All Status</option>
        <option value="Reading">Reading</option>
        <option value="Completed">Completed</option>
        <option value="Paused">Paused</option>
      </select>
    </div>
  );
};

export default SearchFilter;

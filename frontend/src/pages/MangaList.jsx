"use client"

import { useEffect, useState } from "react"
import { Search, Filter, BookOpen, Grid3X3, List, RefreshCw } from "lucide-react"
import MangaCard from "../components/MangaCard"
import { getMangas, searchMangas } from "../api/mangaApi"

const MangaList = () => {
  const [mangas, setMangas] = useState([])
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")

  useEffect(() => {
    fetchMangas()
  }, [])

  const fetchMangas = async () => {
    setLoading(true)
    try {
      const data = await getMangas()
      setMangas(data)
    } catch (error) {
      console.error("Failed to fetch mangas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const data = await searchMangas({ query, status })
      setMangas(data)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setQuery("")
    setStatus("All")
    fetchMangas()
  }

  const statusOptions = ["All", "Reading", "Completed", "On Hold", "Dropped", "Plan to Read"]

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#121212", color: "#FFFFFF" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8" style={{ color: "#E94560" }} />
          <h1 className="text-4xl font-bold">My Manga Collection</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: "#1E1E1E", color: "#B3B3B3" }}
          >
            {viewMode === "grid" ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
          </button> */}
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: "#E94560", color: "#FFFFFF" }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 p-6 rounded-2xl shadow-lg" style={{ backgroundColor: "#1E1E1E" }}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" style={{ color: "#E94560" }} />
          <h2 className="text-xl font-semibold">Search & Filter</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "#B3B3B3" }}
            />
            <input
              type="text"
              placeholder="Search manga titles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-transparent focus:border-opacity-50 transition-all duration-200"
              style={{
                backgroundColor: "#121212",
                color: "#FFFFFF",
                borderColor: "transparent",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#E94560")}
              onBlur={(e) => (e.target.style.borderColor = "transparent")}
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => setStatus(statusOption)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  status === statusOption ? "font-semibold" : ""
                }`}
                style={{
                  backgroundColor: status === statusOption ? "#E94560" : "#121212",
                  color: status === statusOption ? "#FFFFFF" : "#B3B3B3",
                  border: `2px solid ${status === statusOption ? "#E94560" : "#333333"}`,
                }}
              >
                {statusOption}
              </button>
            ))}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#FFB400", color: "#121212" }}
          >
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-4 flex items-center justify-between">
        <p style={{ color: "#B3B3B3" }}>
          {loading ? "Loading..." : `Found ${mangas.length} manga${mangas.length !== 1 ? "s" : ""}`}
        </p>
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setStatus("All")
              fetchMangas()
            }}
            className="text-sm px-3 py-1 rounded-md transition-colors duration-200"
            style={{ backgroundColor: "#333333", color: "#B3B3B3" }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "#E94560" }}></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && mangas.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: "#B3B3B3" }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#B3B3B3" }}>
            {query ? "No manga found" : "No manga in your collection"}
          </h3>
          <p style={{ color: "#B3B3B3" }}>
            {query ? "Try adjusting your search terms" : "Add some manga to get started"}
          </p>
        </div>
      )}

      {/* Manga Grid */}
      {!loading && mangas.length > 0 && (
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {mangas.map((manga) => (
            <MangaCard key={manga._id} manga={manga} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MangaList

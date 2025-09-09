"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMangaById, updateManga, deleteManga, updateMangaChapter } from "../api/mangaApi"
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Save,
  BookOpen,
  FileText,
  Star,
  Eye,
  Plus,
  Minus,
  Loader2,
  Globe,
} from "lucide-react"

const MangaDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [manga, setManga] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdatingChapter, setIsUpdatingChapter] = useState(false)

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const data = await getMangaById(id)
        setManga(data)
      } catch (error) {
        console.error("Failed to fetch manga:", error)
        navigate("/")
      }
    }
    fetchManga()
  }, [id, navigate])

  const handleUpdate = async () => {
    try {
      await updateManga(id, manga)
      setIsEditing(false)
      // alert("Updated successfully!")
    } catch (error) {
      console.error("Failed to update manga:", error)
      alert("Failed to update manga. Please try again.")
    }
  }

  const handleUpdateChapter = async (increment) => {
    setIsUpdatingChapter(true)
    try {
      const newChapter = Number(manga.currentChapter) + (increment ? 1 : -1)
      if (newChapter < 0) {
        setIsUpdatingChapter(false)
        return
      }

      // Call the API endpoint specifically for updating the chapter
      const response = await updateMangaChapter(id, { currentChapter: newChapter })
      setManga(response.manga)
      // alert(`Chapter ${increment ? "incremented" : "decremented"} successfully!`)
    } catch (error) {
      console.error("Failed to update chapter:", error)
      alert("Failed to update chapter. Please try again.")
    } finally {
      setIsUpdatingChapter(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this manga?")) {
      try {
        await deleteManga(id)
        navigate("/")
      } catch (error) {
        console.error("Failed to delete manga:", error)
        alert("Failed to delete manga. Please try again.")
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "reading":
        return "bg-[#E94560]"
      case "completed":
        return "bg-[#FFB400]"
      case "on-hold":
        return "bg-[#B3B3B3]"
      case "dropped":
        return "bg-red-500"
      default:
        return "bg-[#B3B3B3]"
    }
  }

  if (!manga) {
    return (
      <div className="p-6 bg-[#121212] min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#FFFFFF]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E94560]"></div>
          <span className="text-lg">Loading manga details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-[#FFFFFF]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/mangas")}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-[#FFFFFF] transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] px-4 py-2 rounded-xl transition-all duration-200 border border-[#333]"
          >
            <Edit3 size={16} />
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-all duration-200"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <div className="bg-[#1E1E1E] rounded-2xl p-6 shadow-lg">
            <img
              src={manga.coverImage || "/placeholder.svg"}
              alt={manga.title}
              className="w-full h-96 object-cover rounded-xl mb-4 shadow-md"
            />

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#B3B3B3] flex items-center gap-2">
                  <Eye size={16} />
                  Status
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(manga.status)}`}
                >
                  {manga.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#B3B3B3] flex items-center gap-2">
                  <BookOpen size={16} />
                  Chapter
                </span>
                <span className="text-[#FFFFFF] font-medium">{manga.currentChapter}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#B3B3B3] flex items-center gap-2">
                  <Star size={16} />
                  Rating
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < (manga.rating || 0) ? "fill-[#FFB400] text-[#FFB400]" : "text-[#B3B3B3]"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Website */}
          <div className="bg-[#1E1E1E] rounded-2xl p-6 shadow-lg">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[#B3B3B3] text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-colors duration-200"
                    value={manga.title}
                    onChange={(e) => setManga({ ...manga, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[#B3B3B3] text-sm font-medium mb-2 flex items-center gap-2">
                    <Globe size={16} /> Website URL
                  </label>
                  <input
                    type="url"
                    className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-colors duration-200"
                    value={manga.website || ""}
                    onChange={(e) => setManga({ ...manga, website: e.target.value })}
                    placeholder="e.g., https://example.com"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold mb-2 text-[#FFFFFF]">{manga.title}</h1>
                <div className="flex items-center gap-3 mt-4">
                  {manga.website && (
                    <a
                      href={manga.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-[#E94560] hover:bg-[#d63851] px-4 py-2 rounded-xl text-white font-medium transition-all duration-200"
                    >
                      <Globe size={16} />
                      <span>Start Reading</span>
                    </a>
                  )}
                  {!manga.website && <p className="text-[#B3B3B3]">No website provided</p>}
                </div>
              </div>
            )}
          </div>

          {/* Editable Fields */}
          <div className="bg-[#1E1E1E] rounded-2xl p-6 shadow-lg space-y-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Edit3 size={20} className="text-[#E94560]" />
              {isEditing ? "Edit Information" : "Information"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-[#B3B3B3] text-sm font-medium mb-2 flex items-center gap-2">
                  <Eye size={16} />
                  Reading Status
                </label>
                {isEditing ? (
                  <select
                    className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-colors duration-200"
                    value={manga.status}
                    onChange={(e) => setManga({ ...manga, status: e.target.value })}
                  >
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                    <option value="On-Hold">On-Hold</option>
                    <option value="Dropped">Dropped</option>
                    <option value="Plan to Read">Plan to Read</option>
                  </select>
                ) : (
                  <div
                    className={`inline-flex px-4 py-2 rounded-xl text-white font-medium ${getStatusColor(manga.status)}`}
                  >
                    {manga.status}
                  </div>
                )}
              </div>

              {/* Current Chapter */}
              <div>
                <label className="block text-[#B3B3B3] text-sm font-medium mb-2 flex items-center gap-2">
                  <BookOpen size={16} />
                  Current Chapter
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-colors duration-200"
                    value={manga.currentChapter}
                    onChange={(e) => setManga({ ...manga, currentChapter: e.target.value })}
                    min="0"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateChapter(false)}
                      disabled={isUpdatingChapter || manga.currentChapter <= 0}
                      className="p-1 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="text-[#FFFFFF] text-lg font-medium min-w-[30px] text-center">
                      {isUpdatingChapter ? <Loader2 size={16} className="animate-spin mx-auto" /> : manga.currentChapter}
                    </div>
                    <button
                      onClick={() => handleUpdateChapter(true)}
                      disabled={isUpdatingChapter}
                      className="p-1 bg-[#E94560] hover:bg-[#d63851] rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[#B3B3B3] text-sm font-medium mb-2 flex items-center gap-2">
                <FileText size={16} />
                Personal Notes
              </label>
              {isEditing ? (
                <textarea
                  className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-colors duration-200 resize-none"
                  value={manga.notes || ""}
                  onChange={(e) => setManga({ ...manga, notes: e.target.value })}
                  rows={4}
                  placeholder="Add your thoughts, reviews, or notes about this manga..."
                />
              ) : (
                <div className="bg-[#121212] rounded-xl p-4 text-[#B3B3B3] min-h-[100px] border border-[#333]">
                  {manga.notes || "No notes added yet."}
                </div>
              )}
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-[#333]">
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-[#E94560] hover:bg-[#d63851] px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MangaDetail
import { Eye, Edit3, Clock, CheckCircle, Pause, BookOpen, Image as ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

const MangaCard = ({ manga }) => {
  const [imageError, setImageError] = useState(false)

  const getStatusIcon = (status) => {
    const iconProps = { size: 16, className: "text-[#B3B3B3]" }

    switch (status?.toLowerCase()) {
      case "reading":
        return <Eye {...iconProps} />
      case "completed":
        return <CheckCircle {...iconProps} />
      case "on-hold":
        return <Pause {...iconProps} />
      case "dropped":
        return <Clock {...iconProps} />
      case "plan to read":
        return <Clock {...iconProps} />
      default:
        return <Clock {...iconProps} />
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const imageSource = manga.coverImage && !imageError ? manga.coverImage : "/placeholder.svg"
  const altText = manga.title ? `${manga.title} Cover` : "Manga Cover"

  return (
    <div className="bg-[#1E1E1E] rounded-2xl shadow-lg border border-[#2A2A2A] hover:border-[#E94560] transition-all duration-300 hover:shadow-xl hover:shadow-[#E94560]/10 overflow-hidden group">
      <div className="relative overflow-hidden h-64 w-full bg-[#2A2A2A] flex items-center justify-center">
        {imageSource === "/placeholder.svg" ? (
          <div className="text-[#B3B3B3] flex flex-col items-center justify-center p-4">
            <ImageIcon size={48} />
            <span className="text-lg mt-2 text-center">{manga.title}</span>
          </div>
        ) : (
          <img
            src={imageSource}
            alt={altText}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h2 className="text-[#FFFFFF] font-bold text-lg leading-tight line-clamp-2 mb-1">{manga.title || "Untitled Manga"}</h2>
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon(manga.status)}
            <p className="text-[#B3B3B3] text-sm capitalize">{manga.status}</p>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[#B3B3B3]" />
            <p className="text-[#B3B3B3] text-sm">
              Chapter {manga.currentChapter !== undefined ? manga.currentChapter : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Link
            to={`/mangas/${manga._id}`}
            className="flex-1 bg-[#E94560] hover:bg-[#E94560]/90 px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 group/btn"
          >
            <Eye size={16} className="group-hover/btn:scale-110 transition-transform duration-200" />
            View
          </Link>
          
        </div>
      </div>
    </div>
  )
}

export default MangaCard
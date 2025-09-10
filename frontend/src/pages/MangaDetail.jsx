"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMangaById,
  updateManga,
  deleteManga,
  updateMangaChapter,
} from "../api/mangaApi";
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
  Calendar,
  Clock,
  Users,
  Tag,
  Heart,
  ExternalLink,
  Check,
  X,
  BookmarkPlus,
  Share,
} from "lucide-react";

const MangaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manga, setManga] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingChapter, setIsUpdatingChapter] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const data = await getMangaById(id);
        setManga(data);
        setIsFavorite(data.isFavorite || false);
      } catch (error) {
        console.error("Failed to fetch manga:", error);
        navigate("/");
      }
    };
    fetchManga();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      await updateManga(id, manga);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update manga:", error);
      alert("Failed to update manga. Please try again.");
    }
  };

  const handleUpdateChapter = async (increment) => {
    setIsUpdatingChapter(true);
    try {
      const newChapter = Number(manga.currentChapter) + (increment ? 1 : -1);
      if (newChapter < 0) {
        setIsUpdatingChapter(false);
        return;
      }

      const response = await updateMangaChapter(id, {
        currentChapter: newChapter,
      });
      setManga(response.manga);
    } catch (error) {
      console.error("Failed to update chapter:", error);
      alert("Failed to update chapter. Please try again.");
    } finally {
      setIsUpdatingChapter(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteManga(id);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete manga:", error);
      alert("Failed to delete manga. Please try again.");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setManga({ ...manga, isFavorite: !isFavorite });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: manga.title,
          text: `Check out ${manga.title} on MangaVault!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "reading":
        return "bg-gradient-to-r from-[#E94560] to-[#d63851]";
      case "completed":
        return "bg-gradient-to-r from-[#FFB400] to-[#e6a200]";
      case "on-hold":
        return "bg-gradient-to-r from-[#B3B3B3] to-[#999999]";
      case "dropped":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "plan to read":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-r from-[#B3B3B3] to-[#999999]";
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            size={16}
            className="fill-[#FFB400] text-[#FFB400] drop-shadow-sm"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star size={16} className="text-[#B3B3B3]" />
            <Star
              size={16}
              className="absolute top-0 left-0 fill-[#FFB400] text-[#FFB400] drop-shadow-sm"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-[#B3B3B3]" />);
      }
    }
    return stars;
  };

  if (!manga) {
    return (
      <div className="p-6 bg-[#121212] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#FFFFFF]">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1E1E1E] border-t-[#E94560]"></div>
            <div
              className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-r-[#FFB400] animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <span className="text-lg font-medium">Loading manga details...</span>
          <div className="w-48 h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#E94560] to-[#FFB400] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#121212] min-h-screen text-[#FFFFFF]">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={() => navigate("/mangas")}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-[#FFFFFF] transition-all duration-200 group"
        >
          <ArrowLeft
            size={20}
            className="transform group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span className="font-medium">Back to Library</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={toggleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border ${
              isFavorite
                ? "bg-[#E94560] hover:bg-[#d63851] border-[#E94560] text-white"
                : "bg-[#1E1E1E] hover:bg-[#2A2A2A] border-[#333] text-[#B3B3B3] hover:text-white"
            }`}
          >
            <Heart size={16} className={isFavorite ? "fill-current" : ""} />
            <span className="hidden sm:inline">
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] px-4 py-2 rounded-xl transition-all duration-200 border border-[#333] text-[#B3B3B3] hover:text-white"
          >
            <Share size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 border ${
              isEditing
                ? "bg-[#FFB400] hover:bg-[#e6a200] border-[#FFB400] text-black font-medium"
                : "bg-[#1E1E1E] hover:bg-[#2A2A2A] border-[#333] text-[#B3B3B3] hover:text-white"
            }`}
          >
            {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            <span className="hidden sm:inline">
              {isEditing ? "Cancel" : "Edit"}
            </span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 px-4 py-2 rounded-xl transition-all duration-200 border border-red-600/30 hover:border-red-600 text-red-400 hover:text-white"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Enhanced Cover Section */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-[#1E1E1E] to-[#191919] rounded-2xl p-6 shadow-2xl border border-[#333]/50">
            <div className="relative group w-full h-80 sm:h-96 rounded-xl shadow-lg overflow-hidden bg-gray-800 flex items-center justify-center">
              {manga.coverImage ? (
                <>
                  <img
                    src={manga.coverImage}
                    alt={manga.title}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 text-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                  <span className="text-white font-semibold">
                    {manga.title}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}

              {isFavorite && (
                <div className="absolute top-3 right-3 bg-[#E94560] rounded-full p-2 shadow-lg">
                  <Heart size={16} className="fill-current text-white" />
                </div>
              )}
            </div>

            {/* Enhanced Quick Stats */}
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-[#B3B3B3] flex items-center gap-2 font-medium">
                  <Eye size={16} />
                  Status
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg ${getStatusColor(
                    manga.status
                  )}`}
                >
                  {manga.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#B3B3B3] flex items-center gap-2 font-medium">
                  <BookOpen size={16} />
                  Chapter
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[#FFFFFF] font-bold text-lg">
                    {manga.currentChapter}
                  </span>
                  {manga.totalChapters && (
                    <span className="text-[#B3B3B3] text-sm">
                      / {manga.totalChapters}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#B3B3B3] flex items-center gap-2 font-medium">
                  <Star size={16} />
                  Rating
                </span>
                <div className="flex items-center gap-1">
                  {getRatingStars(manga.rating)}
                  <span className="ml-2 text-[#FFFFFF] font-medium text-sm">
                    {manga.rating ? manga.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>

              {manga.genre &&
                typeof manga.genre === "string" &&
                manga.genre.trim() && (
                  <div className="flex items-start justify-between">
                    <span className="text-[#B3B3B3] flex items-center gap-2 font-medium">
                      <Tag size={16} />
                      Genre
                    </span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-32">
                      {manga.genre.split(",").map((g, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#333] rounded-full text-xs text-[#FFFFFF] font-medium"
                        >
                          {g.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {manga.lastRead && (
                <div className="flex items-center justify-between">
                  <span className="text-[#B3B3B3] flex items-center gap-2 font-medium">
                    <Clock size={16} />
                    Last Read
                  </span>
                  <span className="text-[#FFFFFF] font-medium text-sm">
                    {new Date(manga.lastRead).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Title and Website */}
          <div className="bg-gradient-to-r from-[#1E1E1E] to-[#191919] rounded-2xl p-6 shadow-lg border border-[#333]/50">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[#B3B3B3] text-sm font-bold mb-3">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#121212] border-2 border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-all duration-200 font-medium"
                    value={manga.title}
                    onChange={(e) =>
                      setManga({ ...manga, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[#B3B3B3] text-sm font-bold mb-3 flex items-center gap-2">
                    <Globe size={16} /> Website URL
                  </label>
                  <input
                    type="url"
                    className="w-full bg-[#121212] border-2 border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-all duration-200"
                    value={manga.website || ""}
                    onChange={(e) =>
                      setManga({ ...manga, website: e.target.value })
                    }
                    placeholder="e.g., https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-[#B3B3B3] text-sm font-bold mb-3 flex items-center gap-2">
                    <Tag size={16} /> Genres
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#121212] border-2 border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-all duration-200"
                    value={manga.genre || ""}
                    onChange={(e) =>
                      setManga({ ...manga, genre: e.target.value })
                    }
                    placeholder="Action, Adventure, Romance (comma separated)"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#FFFFFF] leading-tight">
                  {manga.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  {manga.website && (
                    <a
                      href={manga.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gradient-to-r from-[#E94560] to-[#d63851] hover:from-[#d63851] hover:to-[#c12d47] px-5 py-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <Globe size={18} />
                      <span>Start Reading</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  <button
                    onClick={() =>
                      navigator.clipboard
                        .writeText(manga.title)
                        .then(() => {
                          alert("Title copied to clipboard");
                        })
                        .catch((err) => {
                          alert("Failed to copy title");
                          console.error(err);
                        })
                    }
                    className="flex items-center gap-2 bg-[#333] hover:bg-[#404040] px-4 py-3 rounded-xl text-[#B3B3B3] hover:text-white transition-all duration-200"
                  >
                    <BookmarkPlus size={16} />
                    <span className="hidden sm:inline">Copy Title</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Information Section */}
          <div className="bg-gradient-to-b from-[#1E1E1E] to-[#191919] rounded-2xl p-6 shadow-lg border border-[#333]/50">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Edit3 size={24} className="text-[#E94560]" />
              {isEditing ? "Edit Information" : "Information"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enhanced Status */}
              <div className="space-y-3">
                <label className="block text-[#B3B3B3] text-sm font-bold flex items-center gap-2">
                  <Eye size={16} />
                  Reading Status
                </label>
                {isEditing ? (
                  <select
                    className="w-full bg-[#121212] border-2 border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-all duration-200 font-medium"
                    value={manga.status}
                    onChange={(e) =>
                      setManga({ ...manga, status: e.target.value })
                    }
                  >
                    <option value="Reading">📖 Reading</option>
                    <option value="Completed">✅ Completed</option>
                    <option value="On-Hold">⏸️ On-Hold</option>
                    <option value="Dropped">❌ Dropped</option>
                    <option value="Plan to Read">📚 Plan to Read</option>
                  </select>
                ) : (
                  <div
                    className={`inline-flex items-center px-6 py-3 rounded-xl text-white font-bold shadow-lg ${getStatusColor(
                      manga.status
                    )}`}
                  >
                    <span className="text-lg">{manga.status}</span>
                  </div>
                )}
              </div>

              {/* Enhanced Current Chapter */}
              <div className="space-y-3">
                <label className="block text-[#B3B3B3] text-sm font-bold flex items-center gap-2">
                  <BookOpen size={16} />
                  Current Chapter
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      className="w-full bg-[#121212] border-2 border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-all duration-200 font-medium"
                      value={manga.currentChapter}
                      onChange={(e) =>
                        setManga({ ...manga, currentChapter: e.target.value })
                      }
                      min="0"
                    />
                    <input
                      type="number"
                      className="w-full bg-[#121212] border-2 border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-all duration-200 font-medium"
                      value={manga.totalChapters || ""}
                      onChange={(e) =>
                        setManga({ ...manga, totalChapters: e.target.value })
                      }
                      min="0"
                      placeholder="Total chapters (optional)"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateChapter(false)}
                      disabled={isUpdatingChapter || manga.currentChapter <= 0}
                      className="p-2 bg-[#333] hover:bg-[#404040] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                    >
                      <Minus size={18} className="text-white" />
                    </button>
                    <div className="bg-[#121212] px-6 py-3 rounded-xl border-2 border-[#333] min-w-[80px] text-center">
                      {isUpdatingChapter ? (
                        <Loader2
                          size={20}
                          className="animate-spin mx-auto text-[#E94560]"
                        />
                      ) : (
                        <span className="text-[#FFFFFF] text-xl font-bold">
                          {manga.currentChapter}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleUpdateChapter(true)}
                      disabled={isUpdatingChapter}
                      className="p-2 bg-gradient-to-r from-[#E94560] to-[#d63851] hover:from-[#d63851] hover:to-[#c12d47] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <Plus size={18} className="text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Enhanced Rating */}
              <div className="space-y-3">
                <label className="block text-[#B3B3B3] text-sm font-bold flex items-center gap-2">
                  <Star size={16} />
                  Your Rating
                </label>
                {isEditing ? (
                  <select
                    className="w-full bg-[#121212] border-2 border-[#333] rounded-xl px-4 py-3 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-all duration-200 font-medium"
                    value={manga.rating || ""}
                    onChange={(e) =>
                      setManga({
                        ...manga,
                        rating: parseFloat(e.target.value) || 0,
                      })
                    }
                  >
                    <option value="">No Rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5/5) Masterpiece</option>
                    <option value="4.5">⭐⭐⭐⭐💫 (4.5/5) Excellent</option>
                    <option value="4">⭐⭐⭐⭐ (4/5) Very Good</option>
                    <option value="3.5">⭐⭐⭐💫 (3.5/5) Good</option>
                    <option value="3">⭐⭐⭐ (3/5) Average</option>
                    <option value="2.5">⭐⭐💫 (2.5/5) Below Average</option>
                    <option value="2">⭐⭐ (2/5) Poor</option>
                    <option value="1.5">⭐💫 (1.5/5) Bad</option>
                    <option value="1">⭐ (1/5) Awful</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {getRatingStars(manga.rating)}
                    </div>
                    <span className="text-[#FFFFFF] font-bold text-lg">
                      {manga.rating ? `${manga.rating}/5` : "Not Rated"}
                    </span>
                  </div>
                )}
              </div>

              {/* Date Added */}
              <div className="space-y-3">
                <label className="block text-[#B3B3B3] text-sm font-bold flex items-center gap-2">
                  <Calendar size={16} />
                  Date Added
                </label>
                <div className="bg-[#121212] px-4 py-3 rounded-xl border-2 border-[#333] text-[#FFFFFF] font-medium">
                  {manga.createdAt
                    ? new Date(manga.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </div>
              </div>
            </div>

            {/* Enhanced Notes */}
            <div className="mt-6 space-y-3">
              <label className="block text-[#B3B3B3] text-sm font-bold flex items-center gap-2">
                <FileText size={16} />
                Personal Notes & Review
              </label>
              {isEditing ? (
                <textarea
                  className="w-full bg-[#121212] border-2 border-[#333] rounded-xl px-4 py-4 text-[#FFFFFF] focus:border-[#E94560] focus:outline-none transition-all duration-200 resize-none font-medium leading-relaxed"
                  value={manga.notes || ""}
                  onChange={(e) =>
                    setManga({ ...manga, notes: e.target.value })
                  }
                  rows={5}
                  placeholder="Share your thoughts about this manga... What did you like? Any memorable moments? Would you recommend it?"
                />
              ) : (
                <div className="bg-[#121212] rounded-xl p-4 text-[#B3B3B3] min-h-[120px] border-2 border-[#333] leading-relaxed">
                  {manga.notes ? (
                    <p className="text-[#FFFFFF] whitespace-pre-wrap">
                      {manga.notes}
                    </p>
                  ) : (
                    <p className="italic">
                      No notes added yet. Share your thoughts about this manga!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Save Button */}
            {isEditing && (
              <div className="flex justify-end pt-6 border-t-2 border-[#333] mt-6">
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-3 bg-gradient-to-r from-[#E94560] to-[#d63851] hover:from-[#d63851] hover:to-[#c12d47] px-8 py-4 rounded-xl text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-[#1E1E1E] to-[#191919] rounded-2xl p-8 shadow-2xl border border-[#333] max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-4">
                <Trash2 className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-[#FFFFFF] mb-2">
                Delete Manga
              </h3>
              <p className="text-[#B3B3B3] mb-6 leading-relaxed">
                Are you sure you want to delete "{manga.title}"? This action
                cannot be undone and all your progress will be lost.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-[#333] hover:bg-[#404040] px-6 py-3 rounded-xl text-[#FFFFFF] font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-xl text-white font-bold transition-all duration-200 transform hover:scale-105"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangaDetail;

import { useState } from "react";
import {
  BookOpen,
  Globe,
  Hash,
  FileText,
  Image,
  Plus,
  ArrowLeft,
  Check,
  Pause,
  RotateCcw,
  Car,
  Calendar,
} from "lucide-react";
import { FaRoad } from "react-icons/fa";
import { addManga } from "../api/mangaApi";
import { useNavigate } from "react-router-dom";

const AddManga = () => {
  const [form, setForm] = useState({
    title: "",
    website: "",
    status: "Reading",
    currentChapter: 0,
    releaseDay: "",
    notes: "",
    coverImage: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const releaseDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addManga(form);
    navigate("/");
    console.log("Adding manga:", form);

    setIsSubmitting(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Reading":
        return <BookOpen className="w-4 h-4" />;
      case "Completed":
        return <Check className="w-4 h-4" />;
      case "Paused":
        return <Pause className="w-4 h-4" />;
      default:
        return <RotateCcw className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Reading":
        return "#E94560";
      case "Completed":
        return "#00D4AA";
      case "Paused":
        return "#FFB400";
      default:
        return "#B3B3B3";
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        color: "#FFFFFF",
      }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-6 mb-12 ">
        <button
          className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-6 group"
          style={{
            backgroundColor: "#1E1E1E",
            border: "1px solid rgba(233, 69, 96, 0.2)",
          }}
        >
          <Plus
            className="w-5 h-5 transition-colors duration-300 group-hover:text-white"
            style={{ color: "#B3B3B3" }}
          />
        </button>
        <div className="">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Add New Manga
          </h1>
          <p
            style={{ color: "#B3B3B3" }}
            className="text-base mt-2 font-medium"
          >
            Expand your collection with a new adventure
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div
        className="max-w-3xl mx-auto p-10 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-800/50 relative overflow-hidden"
        style={{
          backgroundColor: "rgba(30, 30, 30, 0.95)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-yellow-500/5 pointer-events-none" />

        <div className="space-y-8 relative">
          {/* Title Input */}
          <div className="space-y-3">
            <label
              className="flex items-center gap-3 text-base font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "rgba(233, 69, 96, 0.2)" }}
              >
                <BookOpen className="w-5 h-5" style={{ color: "#E94560" }} />
              </div>
              Title *
            </label>
            <input
              type="text"
              required
              className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] placeholder-gray-500 text-lg font-medium"
              style={{
                backgroundColor: "rgba(18, 18, 18, 0.8)",
                color: "#FFFFFF",
                borderColor: "#333333",
                backdropFilter: "blur(10px)",
              }}
              placeholder="Enter manga title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onFocus={(e) => {
                e.target.style.borderColor = "#E94560";
                e.target.style.boxShadow = "0 0 0 3px rgba(233, 69, 96, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#333333";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Website Input */}
          <div className="space-y-3">
            <label
              className="flex items-center gap-3 text-base font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "rgba(255, 180, 0, 0.2)" }}
              >
                <Globe className="w-5 h-5" style={{ color: "#FFB400" }} />
              </div>
              Website
            </label>
            <input
              type="url"
              className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] placeholder-gray-500 text-lg"
              style={{
                backgroundColor: "rgba(18, 18, 18, 0.8)",
                color: "#FFFFFF",
                borderColor: "#333333",
                backdropFilter: "blur(10px)",
              }}
              placeholder="https://example.com"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              onFocus={(e) => {
                e.target.style.borderColor = "#FFB400";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 180, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#333333";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Status, Release Day, and Chapter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Select */}
            <div className="space-y-3">
              <label
                className="flex items-center gap-3 text-base font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `${getStatusColor(form.status)}20`,
                  }}
                >
                  <FaRoad
                    className="w-5 h-5"
                    style={{ color: getStatusColor(form.status) }}
                  />
                </div>
                <span style={{ color: "#FFFFFF" }}>Status</span>
              </label>
              <select
                className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] cursor-pointer text-lg font-medium"
                style={{
                  backgroundColor: "rgba(18, 18, 18, 0.8)",
                  color: "#FFFFFF",
                  borderColor: "#333333",
                  backdropFilter: "blur(10px)",
                }}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                onFocus={(e) => {
                  e.target.style.borderColor = getStatusColor(form.status);
                  e.target.style.boxShadow = `0 0 0 3px ${getStatusColor(
                    form.status
                  )}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#333333";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="Reading">Reading</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            <div className="space-y-3">
              <label
                className="flex items-center gap-3 text-base font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "rgba(255, 180, 0, 0.2)" }}
                >
                  <BookOpen className="w-5 h-5" style={{ color: "#FFB400" }} />
                </div>
                Current Chapter
              </label>
              <input
                type="number"
                min="0"
                className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] placeholder-gray-500 text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                style={{
                  backgroundColor: "rgba(18, 18, 18, 0.8)",
                  color: "#FFFFFF",
                  borderColor: "#333333",
                  backdropFilter: "blur(10px)",
                }}
                placeholder="0"
                value={form.currentChapter}
                onChange={(e) =>
                  setForm({ ...form, currentChapter: parseInt(e.target.value) })
                }
                onFocus={(e) => {
                  e.target.style.borderColor = "#E94560";
                  e.target.style.boxShadow = "0 0 0 3px rgba(233, 69, 96, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#333333";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Release Day Select */}
            <div className="space-y-3">
              <label
                className="flex items-center gap-3 text-base font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "rgba(233, 69, 96, 0.2)" }}
                >
                  <Calendar className="w-5 h-5" style={{ color: "#E94560" }} />
                </div>
                Release Day *
              </label>
              <select
                required
                className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] cursor-pointer text-lg font-medium"
                style={{
                  backgroundColor: "rgba(18, 18, 18, 0.8)",
                  color: "#FFFFFF",
                  borderColor: "#333333",
                  backdropFilter: "blur(10px)",
                }}
                value={form.releaseDay}
                onChange={(e) =>
                  setForm({ ...form, releaseDay: e.target.value })
                }
                onFocus={(e) => {
                  e.target.style.borderColor = "#E94560";
                  e.target.style.boxShadow = "0 0 0 3px rgba(233, 69, 96, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#333333";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select release day...</option>
                {releaseDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Chapter */}
          </div>

          {/* Cover Image URL */}
          <div className="space-y-3">
            <label
              className="flex items-center gap-3 text-base font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "rgba(255, 180, 0, 0.2)" }}
              >
                <Image className="w-5 h-5" style={{ color: "#FFB400" }} />
              </div>
              Cover Image URL
              <span
                className="text-sm font-normal px-2 py-1 rounded-full"
                style={{
                  backgroundColor: "rgba(179, 179, 179, 0.2)",
                  color: "#B3B3B3",
                }}
              >
                Optional
              </span>
            </label>
            <input
              type="url"
              className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] placeholder-gray-500 text-lg"
              style={{
                backgroundColor: "rgba(18, 18, 18, 0.8)",
                color: "#FFFFFF",
                borderColor: "#333333",
                backdropFilter: "blur(10px)",
              }}
              placeholder="https://example.com/cover.jpg"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              onFocus={(e) => {
                e.target.style.borderColor = "#FFB400";
                e.target.style.boxShadow = "0 0 0 3px rgba(255, 180, 0, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#333333";
                e.target.style.boxShadow = "none";
              }}
            />
            {form.coverImage && (
              <div className="mt-4 flex justify-center">
                <div className="relative group">
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    className="w-32 h-44 object-cover rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    style={{ border: "2px solid rgba(255, 180, 0, 0.3)" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            )}
          </div>

          {/* Notes Textarea */}
          <div className="space-y-3">
            <label
              className="flex items-center gap-3 text-base font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "rgba(179, 179, 179, 0.2)" }}
              >
                <FileText className="w-5 h-5" style={{ color: "#B3B3B3" }} />
              </div>
              Notes
            </label>
            <textarea
              rows="5"
              className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] resize-none placeholder-gray-500 text-lg leading-relaxed"
              style={{
                backgroundColor: "rgba(18, 18, 18, 0.8)",
                color: "#FFFFFF",
                borderColor: "#333333",
                backdropFilter: "blur(10px)",
              }}
              placeholder="Share your thoughts, ratings, or any memorable moments from this manga..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              onFocus={(e) => {
                e.target.style.borderColor = "#B3B3B3";
                e.target.style.boxShadow = "0 0 0 3px rgba(179, 179, 179, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#333333";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="button"
              disabled={isSubmitting || !form.title.trim() || !form.releaseDay}
              onClick={handleSubmit}
              className={`w-full py-5 px-8 rounded-xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
                isSubmitting || !form.title.trim() || !form.releaseDay
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] transform-gpu"
              }`}
              style={{
                backgroundColor: "#E94560",
                boxShadow:
                  isSubmitting || !form.title.trim() || !form.releaseDay
                    ? "none"
                    : "0 10px 40px rgba(233, 69, 96, 0.4)",
                background:
                  isSubmitting || !form.title.trim() || !form.releaseDay
                    ? "#E94560"
                    : "linear-gradient(135deg, #E94560 0%, #FF6B8A 100%)",
              }}
            >
              {/* Animated background effect */}
              {!isSubmitting && form.title.trim() && form.releaseDay && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}

              {isSubmitting ? (
                <>
                  <RotateCcw className="w-6 h-6 animate-spin" />
                  Adding Manga...
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
                  Add to Collection
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-3xl mx-auto mt-8 text-center">
        <p className="text-base font-medium" style={{ color: "#B3B3B3" }}>
          Fields marked with * are required • Cover image and other details are
          optional
        </p>
      </div>
    </div>
  );
};

export default AddManga;

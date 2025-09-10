import { useState, useEffect } from "react";
import {
  BookOpen,
  Globe,
  Plus,
  ArrowLeft,
  Check,
  Pause,
  RotateCcw,
  Calendar,
  Image,
  FileText,
  AlertCircle,
} from "lucide-react";
import { FaRoad } from "react-icons/fa";
import { addManga } from "../api/mangaApi";
import { useNavigate } from "react-router-dom";

const releaseDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Helper functions for icons and colors
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

// Enhanced Form Field Component
const FormField = ({
  icon: Icon,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  color,
  children,
  name,
  error,
  min,
  max,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Dynamic style based on focus, color, and error state
  const focusStyle = error
    ? {
        borderColor: "#EF4444",
        boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.2)",
      }
    : isFocused
    ? {
        borderColor: color,
        boxShadow: `0 0 0 3px ${color}20`,
      }
    : {
        borderColor: "#333333",
        boxShadow: "none",
      };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3 text-base font-semibold text-white">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          {Icon}
        </div>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children ? (
        children({
          focusStyle,
          onFocus: () => setIsFocused(true),
          onBlur: () => setIsFocused(false),
        })
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          min={min}
          max={max}
          className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] placeholder-gray-500 text-lg font-medium"
          style={{
            backgroundColor: "rgba(18, 18, 18, 0.8)",
            color: "#FFFFFF",
            backdropFilter: "blur(10px)",
            ...focusStyle,
          }}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};

// Main AddManga Component
const AddManga = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    website: "",
    status: "Reading",
    currentChapter: "",
    totalChapters: "",
    releaseDay: "",
    notes: "",
    coverImage: "",
  });

  // Use a state variable to track form validity
  const [isFormValid, setIsFormValid] = useState(false);

  // Form validation function
  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.releaseDay) {
      newErrors.releaseDay = "Please select a release day";
    }

    if(!formData.website){
      newErrors.website="Website URL is required"
    }

     if (!formData.currentChapter) {
       newErrors.currentChapter = "Reading chapter is required";
     }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid URL";
    }

    if (formData.coverImage && !isValidUrl(formData.coverImage)) {
      newErrors.coverImage = "Please enter a valid image URL";
    }

    if (formData.currentChapter && formData.totalChapters) {
      const current = parseInt(formData.currentChapter) || 0;
      const total = parseInt(formData.totalChapters) || 0;
      if (current > total && total > 0) {
        newErrors.currentChapter =
          "Current chapter cannot exceed total chapters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Run validation on form state change
  useEffect(() => {
    setIsFormValid(validateForm(form));
  }, [form]);

  // Enhanced input change handler
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let processedValue = value;

    // Handle number inputs properly
    if (type === "number") {
      // Allow empty string for clearing the field
      processedValue =
        value === "" ? "" : Math.max(0, parseInt(value) || 0).toString();
    }

    setForm((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(form)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert empty strings to appropriate values for API
      const submissionData = {
        ...form,
        currentChapter: form.currentChapter ? parseInt(form.currentChapter) : 0,
        totalChapters: form.totalChapters ? parseInt(form.totalChapters) : 0,
      };

      await addManga(submissionData);
      navigate("/");
    } catch (error) {
      console.error("Failed to add manga:", error);
      setErrors({ submit: "Failed to add manga. Please try again." });
    } finally {
      setIsSubmitting(false);
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
      <div className="flex items-center justify-center gap-6 mb-12">
        <button
          className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-6 group"
          style={{
            backgroundColor: "#1E1E1E",
            border: "1px solid rgba(233, 69, 96, 0.2)",
          }}
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft
            className="w-5 h-5 transition-colors duration-300 group-hover:text-white"
            style={{ color: "#B3B3B3" }}
          />
        </button>
        <div>
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

      {/* Main Container with Form */}
      <div
        className="max-w-3xl mx-auto p-10 rounded-3xl shadow-2xl backdrop-blur-sm border border-gray-800/50 relative overflow-hidden"
        style={{
          backgroundColor: "rgba(30, 30, 30, 0.95)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-yellow-500/5 pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-8 relative" noValidate>
          {/* Title Input */}
          <FormField
            icon={<BookOpen className="w-5 h-5" style={{ color: "#E94560" }} />}
            label="Title"
            type="text"
            name="title"
            placeholder="Enter manga title..."
            value={form.title}
            onChange={handleInputChange}
            required
            color="#E94560"
            error={errors.title}
          />

          {/* Website Input */}
          <FormField
            icon={<Globe className="w-5 h-5" style={{ color: "#FFB400" }} />}
            label="Website"
            type="url"
            name="website"
            placeholder="https://example.com"
            value={form.website}
            onChange={handleInputChange}
            required
            color="#FFB400"
            error={errors.website}
          />

          {/* Grid for Chapters and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              icon={
                <FaRoad
                  className="w-5 h-5"
                  style={{ color: getStatusColor(form.status) }}
                />
              }
              label="Status"
              color={getStatusColor(form.status)}
              name="status"
            >
              {({ focusStyle, onFocus, onBlur }) => (
                <select
                  name="status"
                  className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] cursor-pointer text-lg font-medium"
                  style={{
                    backgroundColor: "rgba(18, 18, 18, 0.8)",
                    color: "#FFFFFF",
                    backdropFilter: "blur(10px)",
                    ...focusStyle,
                  }}
                  value={form.status}
                  onChange={handleInputChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                >
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                  <option value="Paused">Paused</option>
                </select>
              )}
            </FormField>

            <FormField
              icon={
                <BookOpen className="w-5 h-5" style={{ color: "#FFB400" }} />
              }
              label="Reading Chapter"
              type="number"
              name="currentChapter"
              placeholder="0"
              value={form.currentChapter}
              onChange={handleInputChange}
              color="#FFB400"
              min="0"
              required
              error={errors.currentChapter}
            />

            <FormField
              icon={
                <BookOpen className="w-5 h-5" style={{ color: "#E94560" }} />
              }
              label="Total Chapters"
              type="number"
              name="totalChapters"
              placeholder="0(Optional)"
              value={form.totalChapters}
              onChange={handleInputChange}
              color="#E94560"
              min="0"
            />
          </div>

          {/* Release Day Select */}
          <FormField
            icon={<Calendar className="w-5 h-5" style={{ color: "#FFB400" }} />}
            label="Release Day"
            color="#FFB400"
            required
            name="releaseDay"
            error={errors.releaseDay}
          >
            {({ focusStyle, onFocus, onBlur }) => (
              <select
                name="releaseDay"
                required
                className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] cursor-pointer text-lg font-medium"
                style={{
                  backgroundColor: "rgba(18, 18, 18, 0.8)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(10px)",
                  ...focusStyle,
                }}
                value={form.releaseDay}
                onChange={handleInputChange}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="">Select release day...</option>
                {releaseDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          {/* Cover Image URL */}
          <FormField
            icon={<Image className="w-5 h-5" style={{ color: "#E94560" }} />}
            label="Cover Image URL"
            type="url"
            name="coverImage"
            placeholder="https://example.com/cover.jpg(Optional)"
            value={form.coverImage}
            onChange={handleInputChange}
            color="#E94560"
            error={errors.coverImage}
          />

          {form.coverImage && !errors.coverImage && (
            <div className="mt-4 flex justify-center">
              <div className="relative group">
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="w-32 h-44 object-cover rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  style={{ border: "2px solid rgba(255, 180, 0, 0.3)" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    setErrors((prev) => ({
                      ...prev,
                      coverImage: "Unable to load image from this URL",
                    }));
                  }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          )}

          {/* Notes Textarea */}
          <FormField
            icon={<FileText className="w-5 h-5" style={{ color: "#FFB400" }} />}
            label="Notes"
            color="#FFB400"
            name="notes"
          >
            {({ focusStyle, onFocus, onBlur }) => (
              <textarea
                name="notes"
                rows="5"
                className="w-full p-5 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.01] resize-none placeholder-gray-500 text-lg leading-relaxed"
                style={{
                  backgroundColor: "rgba(18, 18, 18, 0.8)",
                  color: "#FFFFFF",
                  backdropFilter: "blur(10px)",
                  ...focusStyle,
                }}
                placeholder="Share your thoughts, ratings, or any memorable moments from this manga..."
                value={form.notes}
                onChange={handleInputChange}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            )}
          </FormField>

          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-base font-medium bg-red-400/10 p-4 rounded-xl border border-red-400/20">
              <AlertCircle className="w-5 h-5" />
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-5 px-8 rounded-xl font-bold text-white text-lg transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
                isSubmitting || !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] transform-gpu"
              }`}
              style={{
                backgroundColor: "#E94560",
                boxShadow:
                  isSubmitting || !isFormValid
                    ? "none"
                    : "0 10px 40px rgba(233, 69, 96, 0.4)",
                background:
                  isSubmitting || !isFormValid
                    ? "#E94560"
                    : "linear-gradient(135deg, #E94560 0%, #FF6B8A 100%)",
              }}
            >
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
        </form>
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

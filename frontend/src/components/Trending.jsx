import { useEffect, useState } from "react";
import { TrendingUp, ExternalLink, Image, Loader2, AlertTriangle, RefreshCw } from "lucide-react";

const TrendingManga = () => {
  const [trendingData, setTrendingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTrendingData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/manga/scrape', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending manga');
      }
      
      const data = await response.json();
      setTrendingData(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch trending data:", err);
      setError("Failed to load trending manga. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchTrendingDataRefresh = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/manga/scrape?refresh=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending manga');
      }
      
      const data = await response.json();
      setTrendingData(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch trending data:", err);
      setError("Failed to load trending manga. Please try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const handleImageError = (mangaIndex) => {
    setImageErrors(prev => new Set([...prev, mangaIndex]));
  };

  const handleRefresh = () => {
    fetchTrendingDataRefresh(true);
  };

  if (isLoading) {
    return (
      <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2A2A2A]">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#E94560] mr-3" />
          <span className="text-[#B3B3B3]">Loading trending manga...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2A2A2A]">
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <AlertTriangle size={24} className="text-red-500 mx-auto mb-3" />
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchTrendingData()}
              className="bg-[#E94560] hover:bg-[#E94560]/90 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2A2A2A]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#E94560]/10 rounded-lg">
            <TrendingUp size={24} className="text-[#E94560]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Trending Manga</h2>
            <p className="text-[#B3B3B3] text-sm">
              {trendingData?.count || 0} trending titles from various sources
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] px-4 py-2 rounded-lg text-[#B3B3B3] hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Manga Grid */}
      {trendingData?.mangas && trendingData.mangas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {trendingData.mangas.map((manga, index) => (
            <TrendingMangaCard 
              key={`${manga.site}-${index}`} 
              manga={manga} 
              index={index}
              onImageError={handleImageError}
              hasImageError={imageErrors.has(index)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp size={48} className="text-[#2A2A2A] mx-auto mb-4" />
          <p className="text-[#B3B3B3]">No trending manga available at the moment</p>
        </div>
      )}
    </div>
  );
};

const TrendingMangaCard = ({ manga, index, onImageError, hasImageError }) => {
  const handleImageError = () => {
    onImageError(index);
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#2A2A2A] rounded-xl overflow-hidden group hover:bg-[#333333] transition-all duration-300 hover:shadow-lg hover:shadow-[#E94560]/10 border border-transparent hover:border-[#E94560]/30">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] bg-[#1E1E1E] overflow-hidden">
        {!hasImageError && manga.cover ? (
          <img
            src={manga.cover}
            alt={manga.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image size={32} className="text-[#B3B3B3]" />
          </div>
        )}
        
        {/* Overlay with external link */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => openInNewTab(manga.link)}
            className="bg-[#E94560] hover:bg-[#E94560]/90 p-2 rounded-full transition-colors"
          >
            <ExternalLink size={16} className="text-white" />
          </button>
        </div>
        
        {/* Site badge */}
        <div className="absolute top-2 right-2">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {manga.site}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 
          className="text-white font-medium text-sm leading-tight line-clamp-2 group-hover:text-[#E94560] transition-colors cursor-pointer"
          onClick={() => openInNewTab(manga.link)}
          title={manga.title}
        >
          {manga.title}
        </h3>
      </div>
    </div>
  );
};

export default TrendingManga;
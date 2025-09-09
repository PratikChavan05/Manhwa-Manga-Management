import { useEffect, useState } from "react";
import StatsCard from "../components/StatsCard";
import MangaCard from "../components/MangaCard";
import { getMangaStats, getMangas } from "../api/mangaApi";
import { Book, Star, Eye, CheckCircle, Clock,Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentMangas, setRecentMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const statsData = await getMangaStats();
        setStats(statsData);

        const allMangas = await getMangas();
        // Sort by updatedAt field to get truly recent updates
        const sortedMangas = allMangas.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setRecentMangas(sortedMangas.slice(0, 6)); // Display up to 6 recent mangas

        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "reading":
        return <Eye size={20} />;
      case "completed":
        return <CheckCircle size={20} />;
      case "on-hold":
        return <Clock size={20} />;
      default:
        return <Book size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-[#121212] min-h-screen flex items-center justify-center text-white text-lg">
        <Loader2 size={24} className="animate-spin mr-3" /> Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-[#121212] min-h-screen flex items-center justify-center text-red-500 text-lg">
        <AlertTriangle size={24} className="mr-3" /> {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#121212] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      

      <h2 className="text-2xl font-bold mb-4">Recently Updated</h2>
      
      {/* Recent Mangas Section */}
      {recentMangas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentMangas.map((manga) => (
            <MangaCard key={manga._id} manga={manga} />
          ))}
        </div>
      ) : (
        <div className="text-center text-[#B3B3B3] p-8 rounded-lg border border-[#2A2A2A]">
          <p>No recently updated manga found. Start adding to your library!</p>
          <Link
            to="/mangas/add"
            className="mt-4 inline-block bg-[#E94560] hover:bg-[#d63851] px-6 py-2 rounded-xl text-white font-medium transition-colors"
          >
            Add New Manga
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
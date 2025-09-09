import { TrendingUp, Star, BookOpen, Users } from "lucide-react"

const StatsCard = ({ title, value }) => {
  const getIcon = (title) => {
    const iconProps = { size: 24, className: "text-[#FFB400]" }

    if (title.toLowerCase().includes("total")) return <BookOpen {...iconProps} />
    if (title.toLowerCase().includes("rating")) return <Star {...iconProps} />
    if (title.toLowerCase().includes("reading") || title.toLowerCase().includes("ongoing"))
      return <TrendingUp {...iconProps} />
    return <Users {...iconProps} />
  }

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-2xl shadow-lg border border-[#2A2A2A] hover:border-[#E94560] transition-all duration-300 hover:shadow-xl hover:shadow-[#E94560]/10 flex flex-col items-center group">
      <div className="mb-3 p-2 rounded-full bg-[#121212] group-hover:bg-[#E94560]/10 transition-colors duration-300">
        {getIcon(title)}
      </div>
      <span className="text-[#B3B3B3] text-sm font-medium mb-1 text-center">{title}</span>
      <span className="text-[#E94560] text-3xl font-bold tracking-tight">{value || "0"}</span>
    </div>
  )
}

export default StatsCard

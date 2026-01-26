import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/catalog/${category.id}`}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-tg-secondary active:scale-95 transition-transform"
    >
      <div className="w-14 h-14 rounded-full bg-tg-button/10 flex items-center justify-center text-2xl">
        {category.emoji}
      </div>
      <span className="text-xs font-medium text-tg-text text-center">
        {category.name}
      </span>
    </Link>
  )
}

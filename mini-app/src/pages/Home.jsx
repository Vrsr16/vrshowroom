import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Sparkles, ArrowRight, Cpu, Factory, Shirt, Watch, Car } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/mockData'
import { useCart } from '../hooks/useCart'
import { useTelegram } from '../providers/TelegramProvider'

const homeCategories = [
  { id: 'electronics', name: 'Электроника', emoji: '📱', icon: Cpu, color: 'from-blue-500 to-cyan-500' },
  { id: 'equipment', name: 'Оборудование', emoji: '🏭', icon: Factory, color: 'from-orange-500 to-amber-500' },
  { id: 'textiles', name: 'Текстиль', emoji: '👕', icon: Shirt, color: 'from-pink-500 to-rose-500' },
  { id: 'accessories', name: 'Аксессуары', emoji: '⌚', icon: Watch, color: 'from-purple-500 to-violet-500' },
  { id: 'auto', name: 'Автозапчасти', emoji: '🚗', icon: Car, color: 'from-green-500 to-emerald-500' },
]

export default function Home() {
  const { webApp, user } = useTelegram()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  const handleAddToCart = (product) => {
    addToCart(product)
    webApp.hapticFeedback.notificationOccurred('success')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      webApp.hapticFeedback.impactOccurred('light')
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleCategoryClick = (categoryId) => {
    webApp.hapticFeedback.impactOccurred('light')
    navigate(`/catalog/${categoryId}`)
  }

  const handleStartSearch = () => {
    webApp.hapticFeedback.impactOccurred('medium')
    navigate('/search')
  }

  const popularProducts = products.slice(0, 6)

  return (
    <div className="pb-4">
      {/* Hero Section with Large Search */}
      <div className="bg-gradient-to-b from-tg-button/5 to-transparent px-4 pt-6 pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-tg-text mb-1">
            Привет, {user.firstName}! 👋
          </h1>
          <p className="text-sm text-tg-hint">
            Найдите товары и оборудование из Китая
          </p>
        </div>

        {/* Large Search Input */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <div className="relative">
            <Search 
              size={22} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-tg-hint" 
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров или оборудования из Китая..."
              className="w-full pl-12 pr-4 py-4 bg-tg-secondary rounded-2xl text-tg-text placeholder:text-tg-hint text-base focus:outline-none focus:ring-2 focus:ring-tg-button/30 shadow-sm"
            />
          </div>
        </form>

        {/* Start Search Button */}
        <button
          onClick={handleStartSearch}
          className="w-full py-4 bg-gradient-to-r from-tg-button to-tg-button/80 text-tg-button-text rounded-2xl font-semibold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
        >
          <Search size={20} />
          Начать поиск
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Categories - Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-base font-semibold text-tg-text">Категории</h2>
          <Link to="/catalog" className="text-sm text-tg-link flex items-center">
            Все <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-4 pb-2">
            {homeCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex-shrink-0 w-28 bg-tg-secondary rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}>
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <span className="text-xs font-medium text-tg-text text-center leading-tight">
                    {category.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/catalog"
            className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white active:scale-[0.98] transition-transform"
          >
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-semibold mb-0.5">Каталог</h3>
            <p className="text-xs text-white/70">1000+ товаров</p>
          </Link>
          
          <Link
            to="/orders"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white active:scale-[0.98] transition-transform"
          >
            <div className="text-2xl mb-2">🚚</div>
            <h3 className="font-semibold mb-0.5">Мои заказы</h3>
            <p className="text-xs text-white/70">Отслеживание</p>
          </Link>
        </div>
      </div>

      {/* Popular Products */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-tg-text">🔥 Популярные товары</h2>
          <Link to="/catalog" className="text-sm text-tg-link flex items-center">
            Все <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {popularProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} />
            <span className="font-semibold">AI-помощник</span>
          </div>
          <p className="text-sm text-white/80 mb-3">
            Опишите что ищете, и AI подберёт лучшие варианты с фабрик Китая
          </p>
          <button 
            onClick={() => navigate('/search')}
            className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium active:scale-95 transition-transform"
          >
            Попробовать
          </button>
        </div>
      </div>
    </div>
  )
}

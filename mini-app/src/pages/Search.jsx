import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Clock, TrendingUp, X } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'
import { products } from '../data/mockData'
import { useCart } from '../hooks/useCart'

const popularSearches = [
  'Наушники TWS',
  'LED светильники',
  'Умные часы',
  'Лазерный станок',
  'Пуховик',
  'Робот-пылесос',
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vr_recent_searches') || '[]')
    } catch {
      return []
    }
  })
  const { addToCart } = useCart()

  const searchResults = query
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.supplier.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    if (query && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches.slice(0, 9)]
      setRecentSearches(updated)
      localStorage.setItem('vr_recent_searches', JSON.stringify(updated))
    }
  }, [query])

  const handleSearch = (q) => {
    setQuery(q)
    setSearchParams({ q })
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('vr_recent_searches')
  }

  const removeRecentSearch = (search) => {
    const updated = recentSearches.filter(s => s !== search)
    setRecentSearches(updated)
    localStorage.setItem('vr_recent_searches', JSON.stringify(updated))
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 sticky top-0 bg-tg-bg z-10">
        <h1 className="text-xl font-bold text-tg-text mb-3">🔍 Поиск</h1>
        <SearchBar 
          placeholder="Товар, категория или фабрика..." 
          onSearch={handleSearch}
        />
      </div>

      {query ? (
        /* Search Results */
        <div className="px-4">
          <p className="text-sm text-tg-hint mb-4">
            Найдено: {searchResults.length} товаров по запросу "{query}"
          </p>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {searchResults.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-tg-text font-medium mb-2">Ничего не найдено</p>
              <p className="text-sm text-tg-hint">
                Попробуйте изменить запрос или посмотрите популярные товары
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Search Suggestions */
        <div className="px-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-tg-hint" />
                  <span className="text-sm font-medium text-tg-text">Недавние</span>
                </div>
                <button 
                  onClick={clearRecentSearches}
                  className="text-xs text-tg-link"
                >
                  Очистить
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(search => (
                  <div
                    key={search}
                    className="flex items-center gap-1 bg-tg-secondary rounded-full pl-3 pr-1 py-1.5"
                  >
                    <button
                      onClick={() => handleSearch(search)}
                      className="text-sm text-tg-text"
                    >
                      {search}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="w-5 h-5 flex items-center justify-center text-tg-hint"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-tg-hint" />
              <span className="text-sm font-medium text-tg-text">Популярные запросы</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {popularSearches.map(search => (
                <button
                  key={search}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-1.5 bg-tg-secondary rounded-full text-sm text-tg-text"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4">
            <h3 className="font-medium text-tg-text mb-2">🤖 AI-поиск</h3>
            <p className="text-sm text-tg-hint mb-3">
              Опишите, что вам нужно, и AI подберёт лучшие варианты
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => handleSearch('наушники для спорта водонепроницаемые')}
                className="w-full text-left px-3 py-2 bg-tg-bg rounded-lg text-sm text-tg-text"
              >
                "Наушники для спорта, водонепроницаемые"
              </button>
              <button 
                onClick={() => handleSearch('оборудование для малого бизнеса')}
                className="w-full text-left px-3 py-2 bg-tg-bg rounded-lg text-sm text-tg-text"
              >
                "Оборудование для малого бизнеса"
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

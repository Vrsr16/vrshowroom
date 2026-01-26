import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Filter, ChevronDown } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import ProductCard from '../components/ProductCard'
import { categories, products } from '../data/mockData'
import { useCart } from '../hooks/useCart'

const sortOptions = [
  { id: 'popular', name: 'Популярные' },
  { id: 'price_asc', name: 'Цена ↑' },
  { id: 'price_desc', name: 'Цена ↓' },
  { id: 'rating', name: 'Рейтинг' },
  { id: 'new', name: 'Новинки' },
]

export default function Catalog() {
  const { category } = useParams()
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { addToCart } = useCart()

  const filteredProducts = useMemo(() => {
    let result = [...products]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.supplier.toLowerCase().includes(query)
      )
    }
    
    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => b.reviews - a.reviews)
    }
    
    return result
  }, [selectedCategory, sortBy, searchQuery])

  const currentCategory = categories.find(c => c.id === selectedCategory)

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 sticky top-0 bg-tg-bg z-10">
        <h1 className="text-xl font-bold text-tg-text mb-3">
          {currentCategory ? `${currentCategory.emoji} ${currentCategory.name}` : '📦 Каталог'}
        </h1>
        <SearchBar 
          placeholder="Поиск в каталоге..." 
          onSearch={setSearchQuery}
        />
      </div>

      {/* Categories Pills */}
      <div className="px-4 mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-tg-button text-tg-button-text'
                : 'bg-tg-secondary text-tg-text'
            }`}
          >
            Все товары
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-tg-button text-tg-button-text'
                  : 'bg-tg-secondary text-tg-text'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort & Filter Bar */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-tg-hint">
            {filteredProducts.length} товаров
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-3 py-1.5 bg-tg-secondary rounded-lg text-sm"
          >
            <Filter size={16} />
            Фильтры
          </button>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-3 py-1.5 pr-8 bg-tg-secondary rounded-lg text-sm text-tg-text focus:outline-none"
            >
              {sortOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-tg-hint pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-4 mb-4 p-4 bg-tg-secondary rounded-xl mx-4 animate-fade-in">
          <h3 className="font-medium text-tg-text mb-3">Фильтры</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-tg-hint mb-1 block">Цена (¥)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="От"
                  className="w-full px-3 py-2 bg-tg-bg rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="До"
                  className="w-full px-3 py-2 bg-tg-bg rounded-lg text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-tg-hint mb-1 block">Минимальный заказ</label>
              <select className="w-full px-3 py-2 bg-tg-bg rounded-lg text-sm">
                <option>Любой</option>
                <option>До 10 шт</option>
                <option>До 50 шт</option>
                <option>До 100 шт</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-tg-hint mb-1 block">Рейтинг поставщика</label>
              <select className="w-full px-3 py-2 bg-tg-bg rounded-lg text-sm">
                <option>Любой</option>
                <option>4.5+</option>
                <option>4.0+</option>
                <option>3.5+</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2 bg-tg-bg rounded-lg text-sm">
              Сбросить
            </button>
            <button className="flex-1 py-2 bg-tg-button text-tg-button-text rounded-lg text-sm font-medium">
              Применить
            </button>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="px-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-tg-hint text-lg mb-2">😔 Товары не найдены</p>
            <p className="text-tg-hint text-sm">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>
    </div>
  )
}

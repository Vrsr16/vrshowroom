import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'

export default function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product)
    
    // Haptic feedback
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light')
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card block">
      <div className="relative aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 w-9 h-9 bg-tg-button text-tg-button-text rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-tg-text line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs text-tg-hint">
            {product.rating} ({product.reviews})
          </span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-tg-text">
            {product.price}¥
          </span>
          {product.oldPrice && (
            <span className="text-xs text-tg-hint line-through">
              {product.oldPrice}¥
            </span>
          )}
          <span className="text-xs text-tg-hint ml-auto">
            ≈{Math.round(product.price * 12.5)}₽
          </span>
        </div>
        
        <div className="mt-2 text-xs text-tg-hint">
          MOQ: {product.moq} шт
        </div>
      </div>
    </Link>
  )
}

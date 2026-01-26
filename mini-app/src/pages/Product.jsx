import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, ShoppingCart, MessageCircle, Share2, Heart, Truck, Shield, Clock } from 'lucide-react'
import { products } from '../data/mockData'
import { useCart } from '../hooks/useCart'
import { useTelegram } from '../providers/TelegramProvider'

export default function Product() {
  const { webApp } = useTelegram()
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, cart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const product = products.find(p => p.id === parseInt(id))
  const isInCart = cart.some(item => item.id === product?.id)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-tg-hint text-lg mb-4">Товар не найден</p>
        <button onClick={() => navigate(-1)} className="tg-button max-w-xs">
          Назад
        </button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    webApp.hapticFeedback.notificationOccurred('success')
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.name} - ${product.price}¥`,
        url: window.location.href,
      })
    }
  }

  const handleContact = () => {
    webApp.hapticFeedback.impactOccurred('medium')
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-tg-bg/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-tg-secondary flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 rounded-full bg-tg-secondary flex items-center justify-center"
            >
              <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-tg-secondary flex items-center justify-center"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-tg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        {/* Price */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-2xl font-bold text-tg-text">{product.price}¥</span>
          {product.oldPrice && (
            <span className="text-base text-tg-hint line-through">{product.oldPrice}¥</span>
          )}
          {product.discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              -{product.discount}%
            </span>
          )}
          <span className="text-sm text-tg-hint ml-auto">
            ≈{Math.round(product.price * 12.5)}₽
          </span>
        </div>

        {/* Name */}
        <h1 className="text-lg font-medium text-tg-text mb-3">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-tg-hint">({product.reviews} отзывов)</span>
          <span className="text-sm text-tg-hint">•</span>
          <span className="text-sm text-tg-hint">MOQ: {product.moq} шт</span>
        </div>

        {/* Supplier */}
        <div className="bg-tg-secondary rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-tg-text">{product.supplier}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-tg-hint">{product.supplierRating} рейтинг</span>
              </div>
            </div>
            <button 
              onClick={handleContact}
              className="flex items-center gap-1 px-3 py-2 bg-tg-button/10 text-tg-button rounded-lg text-sm font-medium"
            >
              <MessageCircle size={16} />
              Написать
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-tg-secondary rounded-xl p-3 text-center">
            <Truck size={20} className="mx-auto mb-1 text-tg-button" />
            <p className="text-xs text-tg-hint">Доставка</p>
            <p className="text-xs font-medium">7-14 дней</p>
          </div>
          <div className="bg-tg-secondary rounded-xl p-3 text-center">
            <Shield size={20} className="mx-auto mb-1 text-tg-button" />
            <p className="text-xs text-tg-hint">Гарантия</p>
            <p className="text-xs font-medium">Защита</p>
          </div>
          <div className="bg-tg-secondary rounded-xl p-3 text-center">
            <Clock size={20} className="mx-auto mb-1 text-tg-button" />
            <p className="text-xs text-tg-hint">Ответ</p>
            <p className="text-xs font-medium">&lt;24 часа</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-tg-text mb-2">Описание</h2>
          <p className="text-sm text-tg-hint leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specs */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-tg-text mb-2">Характеристики</h2>
          <div className="bg-tg-secondary rounded-xl overflow-hidden">
            {Object.entries(product.specs).map(([key, value], index) => (
              <div 
                key={key}
                className={`flex justify-between px-4 py-3 ${
                  index !== Object.keys(product.specs).length - 1 ? 'border-b border-tg-bg' : ''
                }`}
              >
                <span className="text-sm text-tg-hint">{key}</span>
                <span className="text-sm font-medium text-tg-text">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-tg-text mb-2">Количество</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-tg-secondary rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(product.moq, quantity - 10))}
                className="w-12 h-12 flex items-center justify-center text-xl font-medium"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                className="w-20 text-center bg-transparent text-tg-text font-medium focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 10)}
                className="w-12 h-12 flex items-center justify-center text-xl font-medium"
              >
                +
              </button>
            </div>
            <span className="text-sm text-tg-hint">
              Мин. заказ: {product.moq} шт
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-tg-bg border-t border-tg-secondary px-4 py-3">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
              isInCart 
                ? 'bg-green-500 text-white' 
                : 'bg-tg-secondary text-tg-text'
            }`}
          >
            <ShoppingCart size={20} />
            {isInCart ? 'В корзине' : 'В корзину'}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 bg-tg-button text-tg-button-text rounded-xl font-medium"
          >
            Купить • {product.price * quantity}¥
          </button>
        </div>
      </div>
    </div>
  )
}

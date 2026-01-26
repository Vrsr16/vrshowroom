import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useTelegram } from '../providers/TelegramProvider'

export default function Cart() {
  const { webApp } = useTelegram()
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart()

  const handleCheckout = () => {
    if (cart.length === 0) return
    
    webApp.hapticFeedback.notificationOccurred('success')
    
    const orderData = {
      action: 'order',
      orderId: Date.now(),
      items: cartCount,
      total: cartTotal,
      products: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))
    }
    
    webApp.sendData(orderData)
  }

  const handleRemove = (productId) => {
    webApp.hapticFeedback.impactOccurred('medium')
    removeFromCart(productId)
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-24 h-24 rounded-full bg-tg-secondary flex items-center justify-center mb-4">
          <ShoppingBag size={40} className="text-tg-hint" />
        </div>
        <h2 className="text-xl font-semibold text-tg-text mb-2">Корзина пуста</h2>
        <p className="text-tg-hint text-center mb-6">
          Добавьте товары из каталога, чтобы оформить заказ
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="tg-button max-w-xs flex items-center justify-center gap-2"
        >
          Перейти в каталог
          <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 sticky top-0 bg-tg-bg z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-tg-text">🛒 Корзина</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 font-medium"
          >
            Очистить
          </button>
        </div>
        <p className="text-sm text-tg-hint mt-1">
          {cartCount} товаров на сумму {cartTotal}¥
        </p>
      </div>

      {/* Cart Items */}
      <div className="px-4 space-y-3">
        {cart.map(item => (
          <div key={item.id} className="bg-tg-secondary rounded-xl p-3 flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-tg-text line-clamp-2 mb-1">
                {item.name}
              </h3>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-base font-bold text-tg-text">
                  {item.price}¥
                </span>
                <span className="text-xs text-tg-hint">
                  × {item.quantity} = {item.price * item.quantity}¥
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-tg-bg rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="px-4 mt-6">
        <div className="bg-tg-secondary rounded-xl p-4">
          <h2 className="text-base font-semibold text-tg-text mb-3">Итого</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-tg-hint">Товары ({cartCount})</span>
              <span className="text-tg-text">{cartTotal}¥</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tg-hint">Доставка</span>
              <span className="text-tg-text">Рассчитывается</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-tg-hint">Комиссия сервиса</span>
              <span className="text-tg-text">{Math.round(cartTotal * 0.03)}¥</span>
            </div>
          </div>
          
          <div className="border-t border-tg-bg pt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-tg-text">К оплате</span>
              <div className="text-right">
                <span className="text-xl font-bold text-tg-text">
                  {Math.round(cartTotal * 1.03)}¥
                </span>
                <p className="text-xs text-tg-hint">
                  ≈{Math.round(cartTotal * 1.03 * 12.5)}₽
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-tg-bg border-t border-tg-secondary px-4 py-3">
        <button
          onClick={handleCheckout}
          className="tg-button flex items-center justify-center gap-2"
        >
          Оформить заказ • {Math.round(cartTotal * 1.03)}¥
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

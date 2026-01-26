import { Package, Truck, CheckCircle, Clock, ChevronRight, RefreshCw } from 'lucide-react'
import { useTelegram } from '../providers/TelegramProvider'

const orders = [
  {
    id: 'VRS-2024-003',
    status: 'processing',
    statusText: 'В обработке',
    statusColor: 'bg-yellow-500/10 text-yellow-600',
    statusIcon: Clock,
    description: 'Умные часы Smart Watch Series X × 30 шт',
    total: '4,680¥',
    date: '25 янв 2024',
    estimatedDelivery: '10-15 фев 2024',
  },
  {
    id: 'VRS-2024-002',
    status: 'shipping',
    statusText: 'В пути',
    statusColor: 'bg-blue-500/10 text-blue-600',
    statusIcon: Truck,
    description: 'LED светильник промышленный × 100 шт',
    total: '4,500¥',
    date: '22 янв 2024',
    trackingNumber: 'SF1234567890',
    estimatedDelivery: '5-8 фев 2024',
  },
  {
    id: 'VRS-2024-001',
    status: 'delivered',
    statusText: 'Доставлен',
    statusColor: 'bg-green-500/10 text-green-600',
    statusIcon: CheckCircle,
    description: 'Беспроводные наушники TWS Pro × 50 шт',
    total: '4,450¥',
    date: '15 янв 2024',
    deliveredDate: '28 янв 2024',
  },
]

export default function Orders() {
  const { webApp } = useTelegram()

  const handleTrackOrder = (order) => {
    webApp.hapticFeedback.impactOccurred('light')
    if (order.trackingNumber) {
      webApp.showAlert(`Трек-номер: ${order.trackingNumber}\n\nСтатус: ${order.statusText}`)
    }
  }

  const handleRefresh = () => {
    webApp.hapticFeedback.impactOccurred('medium')
    webApp.showAlert('Статусы заказов обновлены')
  }

  const activeOrders = orders.filter(o => o.status !== 'delivered')
  const completedOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 sticky top-0 bg-tg-bg z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-tg-text">📦 Мои заказы</h1>
            <p className="text-sm text-tg-hint mt-0.5">
              {orders.length} заказов
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="w-10 h-10 rounded-full bg-tg-secondary flex items-center justify-center active:scale-95 transition-transform"
          >
            <RefreshCw size={20} className="text-tg-hint" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-yellow-500/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-yellow-600">
              {orders.filter(o => o.status === 'processing').length}
            </p>
            <p className="text-xs text-tg-hint">В обработке</p>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-blue-600">
              {orders.filter(o => o.status === 'shipping').length}
            </p>
            <p className="text-xs text-tg-hint">В пути</p>
          </div>
          <div className="bg-green-500/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
            <p className="text-xs text-tg-hint">Доставлено</p>
          </div>
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-base font-semibold text-tg-text mb-3">Активные заказы</h2>
          <div className="space-y-3">
            {activeOrders.map(order => {
              const StatusIcon = order.statusIcon
              return (
                <button
                  key={order.id}
                  onClick={() => handleTrackOrder(order)}
                  className="w-full bg-tg-secondary rounded-xl p-4 text-left active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon size={16} className={order.statusColor.split(' ')[1]} />
                      <span className="text-sm font-medium text-tg-text">#{order.id}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.statusColor}`}>
                      {order.statusText}
                    </span>
                  </div>
                  
                  <p className="text-xs text-tg-hint mb-2">
                    {order.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-tg-text">{order.total}</span>
                    <div className="flex items-center gap-1 text-tg-link text-xs">
                      <span>Отследить</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                  
                  {order.estimatedDelivery && (
                    <div className="mt-2 pt-2 border-t border-tg-bg">
                      <p className="text-xs text-tg-hint">
                        Ожидаемая доставка: <span className="text-tg-text">{order.estimatedDelivery}</span>
                      </p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div className="px-4">
          <h2 className="text-base font-semibold text-tg-text mb-3">Завершённые</h2>
          <div className="space-y-3">
            {completedOrders.map(order => {
              const StatusIcon = order.statusIcon
              return (
                <div
                  key={order.id}
                  className="bg-tg-secondary rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StatusIcon size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-tg-text">#{order.id}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.statusColor}`}>
                      {order.statusText}
                    </span>
                  </div>
                  
                  <p className="text-xs text-tg-hint mb-2">
                    {order.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-tg-text">{order.total}</span>
                    <span className="text-xs text-tg-hint">{order.date}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <div className="w-20 h-20 rounded-full bg-tg-secondary flex items-center justify-center mb-4">
            <Package size={36} className="text-tg-hint" />
          </div>
          <h2 className="text-lg font-semibold text-tg-text mb-2">Нет заказов</h2>
          <p className="text-sm text-tg-hint text-center">
            Ваши заказы появятся здесь после оформления
          </p>
        </div>
      )}
    </div>
  )
}

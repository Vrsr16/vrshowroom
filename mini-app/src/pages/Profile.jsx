import { 
  Package, 
  Heart, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Star, 
  TrendingUp,
  UserPlus,
  MessageCircle,
  Share2,
  Headphones,
  AlertCircle
} from 'lucide-react'
import { useTelegram } from '../providers/TelegramProvider'

export default function Profile() {
  const { user, isTelegramEnv, webApp, botUsername } = useTelegram()

  const menuItems = [
    { icon: Package, label: 'Мои заказы', count: 3, path: '/orders' },
    { icon: Heart, label: 'Избранное', count: 12, path: '/favorites' },
    { icon: TrendingUp, label: 'Аналитика', path: '/analytics' },
    { icon: Settings, label: 'Настройки', path: '/settings' },
    { icon: HelpCircle, label: 'Помощь', path: '/help' },
  ]

  const stats = [
    { label: 'Заказов', value: '3' },
    { label: 'Потрачено', value: '2,450¥' },
    { label: 'Экономия', value: '890¥' },
  ]

  const recentOrders = [
    {
      id: 'VRS-2024-001',
      status: 'delivered',
      statusText: 'Доставлен',
      statusColor: 'bg-green-500/10 text-green-600',
      description: 'Беспроводные наушники TWS Pro × 50 шт',
      total: '4,450¥',
      date: '15 янв 2024',
    },
    {
      id: 'VRS-2024-002',
      status: 'shipping',
      statusText: 'В пути',
      statusColor: 'bg-blue-500/10 text-blue-600',
      description: 'LED светильник промышленный × 100 шт',
      total: '4,500¥',
      date: '22 янв 2024',
    },
  ]

  const handleInviteFriend = () => {
    webApp.hapticFeedback.impactOccurred('light')
    
    const inviteLink = `https://t.me/${botUsername}?start=ref_${user.id}`
    const shareText = 'Присоединяйся к VR Showroom — товары из Китая напрямую с фабрик! 🛍️'
    
    if (isTelegramEnv) {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`
      webApp.openTelegramLink(shareUrl)
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'VR Showroom',
          text: shareText,
          url: inviteLink,
        })
      } else {
        navigator.clipboard.writeText(inviteLink)
        webApp.showAlert('Ссылка скопирована в буфер обмена!')
      }
    }
  }

  const handleContactSupport = () => {
    webApp.hapticFeedback.impactOccurred('medium')
    
    if (isTelegramEnv) {
      webApp.sendData(JSON.stringify({
        action: 'contact_support',
        userId: user.id,
        username: user.username,
      }))
      webApp.openTelegramLink(`https://t.me/${botUsername}?start=support`)
    } else {
      webApp.showAlert('В Telegram откроется чат с поддержкой')
    }
  }

  const handleLogout = () => {
    webApp.hapticFeedback.impactOccurred('medium')
    webApp.showConfirm('Вы уверены, что хотите выйти?', (confirmed) => {
      if (confirmed) {
        webApp.close()
      }
    })
  }

  return (
    <div className="pb-4">
      {/* Environment Badge (for testing) */}
      {!isTelegramEnv && (
        <div className="mx-4 mt-2 mb-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="text-yellow-600" />
          <span className="text-xs text-yellow-700">
            Режим браузера — некоторые функции недоступны
          </span>
        </div>
      )}

      {/* Header */}
      <div className="px-4 pt-4 pb-6 bg-gradient-to-b from-tg-button/10 to-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.firstName}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-tg-button/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-tg-button to-tg-button/70 flex items-center justify-center text-tg-button-text text-2xl font-bold shadow-lg">
                {user.firstName?.[0] || 'U'}
              </div>
            )}
            
            <div>
              <h1 className="text-xl font-bold text-tg-text">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-tg-hint">
                @{user.username || 'user'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {user.isPremium ? (
                  <>
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-yellow-600 font-medium">Telegram Premium</span>
                  </>
                ) : (
                  <>
                    <Star size={14} className="text-tg-hint" />
                    <span className="text-xs text-tg-hint">Клиент VR Showroom</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Invite Friend Button */}
          <button
            onClick={handleInviteFriend}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
            title="Пригласить друга"
          >
            <UserPlus size={20} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="bg-tg-secondary rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-tg-text">{stat.value}</p>
              <p className="text-xs text-tg-hint">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Banner */}
      <div className="px-4 mb-4">
        <button
          onClick={handleInviteFriend}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white text-left active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Share2 size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Пригласи друга</h3>
                <p className="text-sm text-white/80">
                  Получи 100¥ за каждого друга
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/60" />
          </div>
        </button>
      </div>

      {/* Premium Banner */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">VR Showroom Premium</h3>
              <p className="text-sm text-white/80">
                Расширенный поиск и скидки до 10%
              </p>
            </div>
            <button className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-sm font-medium active:scale-95 transition-transform">
              Подробнее
            </button>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4">
        <div className="bg-tg-secondary rounded-xl overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => webApp.hapticFeedback.selectionChanged()}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-tg-bg/50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-tg-bg' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-tg-button/10 flex items-center justify-center">
                <item.icon size={18} className="text-tg-button" />
              </div>
              <span className="flex-1 text-sm font-medium text-tg-text">
                {item.label}
              </span>
              {item.count !== undefined && (
                <span className="text-xs text-tg-hint bg-tg-bg px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
              <ChevronRight size={18} className="text-tg-hint" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-semibold text-tg-text mb-3">Последние заказы</h2>
        
        <div className="space-y-3">
          {recentOrders.map(order => (
            <div key={order.id} className="bg-tg-secondary rounded-xl p-4 active:scale-[0.99] transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-tg-text">#{order.id}</span>
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
          ))}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-semibold text-tg-text mb-3">Нужна помощь?</h2>
        
        <div className="bg-tg-secondary rounded-xl overflow-hidden">
          <button
            onClick={handleContactSupport}
            className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-tg-bg/50 transition-colors border-b border-tg-bg"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-tg-text block">Написать в поддержку</span>
              <span className="text-xs text-tg-hint">Ответим в течение 15 минут</span>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>
          
          <button
            onClick={() => {
              webApp.hapticFeedback.impactOccurred('light')
              if (isTelegramEnv) {
                webApp.openTelegramLink('https://t.me/vrshowroom_support')
              } else {
                window.open('https://t.me/vrshowroom_support', '_blank')
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-tg-bg/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Headphones size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-tg-text block">Канал поддержки</span>
              <span className="text-xs text-tg-hint">@vrshowroom_support</span>
            </div>
            <ChevronRight size={18} className="text-tg-hint" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-500 text-sm font-medium active:opacity-70 transition-opacity"
        >
          <LogOut size={18} />
          Выйти
        </button>
      </div>

      {/* App Version */}
      <div className="px-4 mt-4 mb-2 text-center">
        <p className="text-xs text-tg-hint">
          VR Showroom v1.0.0 • {isTelegramEnv ? 'Telegram' : 'Browser'}
        </p>
      </div>
    </div>
  )
}

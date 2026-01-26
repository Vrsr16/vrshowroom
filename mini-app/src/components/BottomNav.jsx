import { NavLink, useLocation } from 'react-router-dom'
import { Search, LayoutGrid, Package, User } from 'lucide-react'
import { useTelegram } from '../providers/TelegramProvider'

const navItems = [
  { path: '/search', icon: Search, label: 'Поиск' },
  { path: '/catalog', icon: LayoutGrid, label: 'Каталог' },
  { path: '/orders', icon: Package, label: 'Заказы' },
  { path: '/profile', icon: User, label: 'Профиль' },
]

export default function BottomNav() {
  const location = useLocation()
  const { webApp } = useTelegram()

  const handleNavClick = () => {
    webApp.hapticFeedback.selectionChanged()
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-tg-bg/95 backdrop-blur-lg border-t border-tg-secondary z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto px-2 py-1 safe-area-pb">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/catalog' && location.pathname.startsWith('/catalog'))
          
          return (
            <NavLink
              key={path}
              to={path}
              onClick={handleNavClick}
              className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 min-w-[64px] ${
                isActive 
                  ? 'text-tg-button' 
                  : 'text-tg-hint active:text-tg-text'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-tg-button/10' : ''
              }`}>
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className="transition-all duration-200"
                />
              </div>
              <span className={`text-[10px] font-medium transition-all duration-200 ${
                isActive ? 'text-tg-button' : ''
              }`}>
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

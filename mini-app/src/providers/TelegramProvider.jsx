import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TelegramContext = createContext(null)

// Mock user for browser testing
const MOCK_USER = {
  id: 123456789,
  firstName: 'Тестовый',
  lastName: 'Пользователь',
  username: 'test_user',
  languageCode: 'ru',
  isPremium: false,
  photoUrl: null,
}

// Mock theme for browser testing
const MOCK_THEME = {
  bgColor: '#ffffff',
  textColor: '#000000',
  hintColor: '#999999',
  linkColor: '#2481cc',
  buttonColor: '#2481cc',
  buttonTextColor: '#ffffff',
  secondaryBgColor: '#f1f1f1',
}

function TelegramProviderInner({ children }) {
  const [isTelegramEnv, setIsTelegramEnv] = useState(false)
  const [tgWebApp, setTgWebApp] = useState(null)

  useEffect(() => {
    const webApp = window.Telegram?.WebApp
    const isTg = !!webApp?.initData
    setIsTelegramEnv(isTg)
    setTgWebApp(webApp)

    if (isTg && webApp) {
      try {
        webApp.ready()
        webApp.expand()
      } catch (e) {
        console.warn('Failed to initialize Telegram WebApp:', e)
      }
    }
  }, [])

  // Get user from Telegram WebApp or use mock
  const user = useMemo(() => {
    const tgUser = tgWebApp?.initDataUnsafe?.user
    if (tgUser) {
      return {
        id: tgUser.id,
        firstName: tgUser.first_name,
        lastName: tgUser.last_name || '',
        username: tgUser.username || '',
        languageCode: tgUser.language_code || 'ru',
        isPremium: tgUser.is_premium || false,
        photoUrl: tgUser.photo_url || null,
      }
    }
    return MOCK_USER
  }, [tgWebApp])

  // Get theme from Telegram WebApp or use mock
  const theme = useMemo(() => {
    const tp = tgWebApp?.themeParams
    if (tp && isTelegramEnv) {
      return {
        bgColor: tp.bg_color || MOCK_THEME.bgColor,
        textColor: tp.text_color || MOCK_THEME.textColor,
        hintColor: tp.hint_color || MOCK_THEME.hintColor,
        linkColor: tp.link_color || MOCK_THEME.linkColor,
        buttonColor: tp.button_color || MOCK_THEME.buttonColor,
        buttonTextColor: tp.button_text_color || MOCK_THEME.buttonTextColor,
        secondaryBgColor: tp.secondary_bg_color || MOCK_THEME.secondaryBgColor,
      }
    }
    return MOCK_THEME
  }, [tgWebApp, isTelegramEnv])

  // Apply theme to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bgColor)
    document.documentElement.style.setProperty('--tg-theme-text-color', theme.textColor)
    document.documentElement.style.setProperty('--tg-theme-hint-color', theme.hintColor)
    document.documentElement.style.setProperty('--tg-theme-link-color', theme.linkColor)
    document.documentElement.style.setProperty('--tg-theme-button-color', theme.buttonColor)
    document.documentElement.style.setProperty('--tg-theme-button-text-color', theme.buttonTextColor)
    document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', theme.secondaryBgColor)
  }, [theme])

  // Telegram WebApp methods
  const webApp = useMemo(() => ({
    openTelegramLink: (url) => {
      if (isTelegramEnv && window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url)
      } else {
        window.open(url, '_blank')
      }
    },
    openLink: (url) => {
      if (isTelegramEnv && window.Telegram?.WebApp?.openLink) {
        window.Telegram.WebApp.openLink(url)
      } else {
        window.open(url, '_blank')
      }
    },
    sendData: (data) => {
      if (isTelegramEnv && window.Telegram?.WebApp?.sendData) {
        window.Telegram.WebApp.sendData(typeof data === 'string' ? data : JSON.stringify(data))
      } else {
        console.log('[Mock] sendData:', data)
      }
    },
    close: () => {
      if (isTelegramEnv && window.Telegram?.WebApp?.close) {
        window.Telegram.WebApp.close()
      } else {
        console.log('[Mock] close WebApp')
      }
    },
    showAlert: (message) => {
      if (isTelegramEnv && window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(message)
      } else {
        alert(message)
      }
    },
    showConfirm: (message, callback) => {
      if (isTelegramEnv && window.Telegram?.WebApp?.showConfirm) {
        window.Telegram.WebApp.showConfirm(message, callback)
      } else {
        const result = confirm(message)
        callback?.(result)
      }
    },
    hapticFeedback: {
      impactOccurred: (style = 'medium') => {
        if (isTelegramEnv && window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred(style)
        }
      },
      notificationOccurred: (type = 'success') => {
        if (isTelegramEnv && window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred(type)
        }
      },
      selectionChanged: () => {
        if (isTelegramEnv && window.Telegram?.WebApp?.HapticFeedback?.selectionChanged) {
          window.Telegram.WebApp.HapticFeedback.selectionChanged()
        }
      },
    },
  }), [isTelegramEnv])

  const value = useMemo(() => ({
    user,
    theme,
    isTelegramEnv,
    webApp,
    initData: tgWebApp?.initDataUnsafe || null,
    botUsername: 'vrshowroom_bot',
  }), [user, theme, isTelegramEnv, webApp, tgWebApp])

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

export function TelegramProvider({ children }) {
  return (
    <TelegramProviderInner>
      {children}
    </TelegramProviderInner>
  )
}

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}

export default TelegramProvider

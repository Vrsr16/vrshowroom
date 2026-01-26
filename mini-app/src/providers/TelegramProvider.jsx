import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { 
  SDKProvider, 
  useInitData, 
  useLaunchParams,
  useThemeParams,
  useMiniApp,
  useViewport,
  useHapticFeedback,
} from '@telegram-apps/sdk-react'
import { init, miniApp, themeParams, viewport, initData } from '@telegram-apps/sdk'

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
  const initDataResult = useInitData()
  const themeParamsResult = useThemeParams()
  const [isTelegramEnv, setIsTelegramEnv] = useState(false)

  useEffect(() => {
    const isTg = typeof window !== 'undefined' && window.Telegram?.WebApp?.initData
    setIsTelegramEnv(!!isTg)

    if (isTg) {
      try {
        window.Telegram.WebApp.ready()
        window.Telegram.WebApp.expand()
      } catch (e) {
        console.warn('Failed to initialize Telegram WebApp:', e)
      }
    }
  }, [])

  // Get user from SDK or use mock
  const user = useMemo(() => {
    if (initDataResult?.user) {
      return {
        id: initDataResult.user.id,
        firstName: initDataResult.user.firstName,
        lastName: initDataResult.user.lastName || '',
        username: initDataResult.user.username || '',
        languageCode: initDataResult.user.languageCode || 'ru',
        isPremium: initDataResult.user.isPremium || false,
        photoUrl: initDataResult.user.photoUrl || null,
      }
    }
    return MOCK_USER
  }, [initDataResult])

  // Get theme from SDK or use mock
  const theme = useMemo(() => {
    if (themeParamsResult && isTelegramEnv) {
      return {
        bgColor: themeParamsResult.bgColor || MOCK_THEME.bgColor,
        textColor: themeParamsResult.textColor || MOCK_THEME.textColor,
        hintColor: themeParamsResult.hintColor || MOCK_THEME.hintColor,
        linkColor: themeParamsResult.linkColor || MOCK_THEME.linkColor,
        buttonColor: themeParamsResult.buttonColor || MOCK_THEME.buttonColor,
        buttonTextColor: themeParamsResult.buttonTextColor || MOCK_THEME.buttonTextColor,
        secondaryBgColor: themeParamsResult.secondaryBgColor || MOCK_THEME.secondaryBgColor,
      }
    }
    return MOCK_THEME
  }, [themeParamsResult, isTelegramEnv])

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
    initData: initDataResult,
    botUsername: 'vrshowroom_bot', // Replace with your bot username
  }), [user, theme, isTelegramEnv, webApp, initDataResult])

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

export function TelegramProvider({ children }) {
  const [sdkError, setSdkError] = useState(false)

  // Try to detect if we're in Telegram environment
  const isTelegramEnv = typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initData

  if (!isTelegramEnv) {
    // Render without SDK in browser
    return (
      <TelegramContext.Provider value={{
        user: MOCK_USER,
        theme: MOCK_THEME,
        isTelegramEnv: false,
        webApp: {
          openTelegramLink: (url) => window.open(url, '_blank'),
          openLink: (url) => window.open(url, '_blank'),
          sendData: (data) => console.log('[Mock] sendData:', data),
          close: () => console.log('[Mock] close'),
          showAlert: (msg) => alert(msg),
          showConfirm: (msg, cb) => cb?.(confirm(msg)),
          hapticFeedback: {
            impactOccurred: () => {},
            notificationOccurred: () => {},
            selectionChanged: () => {},
          },
        },
        initData: null,
        botUsername: 'vrshowroom_bot',
      }}>
        {children}
      </TelegramContext.Provider>
    )
  }

  return (
    <SDKProvider acceptCustomStyles>
      <TelegramProviderInner>
        {children}
      </TelegramProviderInner>
    </SDKProvider>
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

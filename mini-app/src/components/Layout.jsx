import BottomNav from './BottomNav'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen pb-20 bg-tg-bg">
      <main className="animate-fade-in">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

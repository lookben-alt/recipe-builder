import Header from './Header'
import Navigation from './Navigation'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full pb-20">
        {children}
      </main>
      <Navigation />
    </div>
  )
}

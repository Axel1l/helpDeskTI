import Link from 'next/link'
import { Bell, Settings, User } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-white font-bold text-xl">
              HelpDesk TI
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/dashboard/settings" className="text-gray-300 hover:text-white">
              <Settings className="h-5 w-5" />
            </Link>
            {/* <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
              <User className="h-5 w-5" />
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  )
}
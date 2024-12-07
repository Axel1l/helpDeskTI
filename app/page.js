import Link from 'next/link'
import { CircuitBoard, Headset, BarChart3, Users, CheckCircle, ArrowRight, Shield, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-purple-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col items-center justify-center text-center mb-24">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur"></div>
            <div className="relative flex items-center justify-center p-4 bg-black rounded-full">
              <CircuitBoard className="h-16 w-16 text-purple-500" />
            </div>
          </div>
          <h1 className="mt-8 text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
            HelpDesk TI
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl">
            Gestión inteligente de soporte técnico de la Distribuidora W.A Morillo S.R.L.
          </p>
          <div className="flex gap-4 mt-12">
            <Link
              href="/auth/login"
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              Iniciar Sesión
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-purple-500/10 p-6 rounded-xl hover:border-purple-500/30 transition-colors">
            <div className="bg-purple-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <Headset className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Soporte 24/7</h3>
            <p className="text-gray-400">Asistencia técnica continua para tu empresa</p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-purple-500/10 p-6 rounded-xl hover:border-purple-500/30 transition-colors">
            <div className="bg-blue-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analíticas</h3>
            <p className="text-gray-400">Métricas detalladas en tiempo real</p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-purple-500/10 p-6 rounded-xl hover:border-purple-500/30 transition-colors">
            <div className="bg-pink-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Colaboración</h3>
            <p className="text-gray-400">Gestión eficiente de equipos de soporte</p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-purple-500/10 p-6 rounded-xl hover:border-purple-500/30 transition-colors">
            <div className="bg-green-500/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Seguridad</h3>
            <p className="text-gray-400">Protección avanzada de datos</p>
          </div>
        </div> */}

        {/* Stats Section */}
        {/* <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Respaldado por números</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">99.9%</p>
              <p className="text-gray-400 mt-2">Tiempo activo</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">15min</p>
              <p className="text-gray-400 mt-2">Tiempo de respuesta</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">5000+</p>
              <p className="text-gray-400 mt-2">Clientes satisfechos</p>
            </div>
            <div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">24/7</p>
              <p className="text-gray-400 mt-2">Soporte disponible</p>
            </div>
          </div>
        </div> */}

        {/* Benefits Section */}
        {/* <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Respuesta Rápida</h3>
                <p className="text-gray-400">Resolución inmediata de incidencias críticas</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Fácil de Usar</h3>
                <p className="text-gray-400">Interfaz intuitiva y amigable</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Seguro</h3>
                <p className="text-gray-400">Máxima protección de datos sensibles</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </main>
  )
}
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Carousel from './components/Carousel'
import GranosGrid from './components/GranosGrid'
import ContactForm from './components/ContactForm'
import ChatWidget from './components/ChatWidget'
import AuthModal from './components/AuthModal'
import AdminPanel from './components/AdminPanel'

const AppContent = () => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('Todos')
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const fetchItems = async () => {
      const resultado = await axios.get('https://cota90-backend.onrender.com/api/granos')
      setItems(resultado.data.data || resultado.data)
      setIsLoading(false)
    }
    fetchItems()
  }, [])

  const regions = [
    'Todos',
    ...new Set(items.map((item) => item.origin.split('–')[0].trim())),
  ]

  const filteredItems =
    filter === 'Todos'
      ? items
      : items.filter((item) => item.origin.split('–')[0].trim() === filter)

  return (
    <>
      <div className="container">
        <Header onOpenAuth={() => setShowAuth(true)} />
        <Carousel />

        <section className="filter-section">
          <h2 className="section-title">Nuestros Granos</h2>
          <p className="section-subtitle">
            Café de especialidad tostado artesanalmente. Selecciona por origen.
          </p>
          <div className="filter-buttons">
            {regions.map((region) => (
              <button
                key={region}
                className={`btn-filter ${filter === region ? 'active' : ''}`}
                onClick={() => setFilter(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </section>

        <GranosGrid isLoading={isLoading} items={filteredItems} />

        {user?.role === 'admin' && <AdminPanel />}

        <ContactForm />
        <ChatWidget />

        <footer className="footer">
          <p>&copy; 2026 Cota 90 Café – Granos de Especialidad. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#granos">Granos</a>
            <a href="#contacto">Contacto</a>
            <a href="#chat">Chat</a>
          </div>
        </footer>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

import React from 'react'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'

const Header = ({ onOpenAuth }) => {
  const { user, logout } = useAuth()

  return (
    <header className='header center'>
      <div className='header-content'>
        <img src={logo} alt='Cota 90 Café' />
        <p className='tagline'>Café de especialidad tostado artesanalmente</p>
      </div>
      <nav className='nav'>
        <a href='#granos'>Granos</a>
        <a href='#contacto'>Contacto</a>
        <a href='#chat'>Chat</a>
        {user?.role === 'admin' && <a href='#admin'>Admin</a>}
        {user ? (
          <span className='nav-user'>
            Hola, {user.name}
            <button className='btn-logout' onClick={logout}>Salir</button>
          </span>
        ) : (
          <button className='btn-auth' onClick={onOpenAuth}>Iniciar Sesión</button>
        )}
      </nav>
    </header>
  )
}

export default Header

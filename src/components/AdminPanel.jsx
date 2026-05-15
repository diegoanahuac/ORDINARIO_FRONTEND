import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:5001/api'

const emptyGrano = {
  name: '', origin: '', price: '', weight: '', roast: 'Medio', img: '', description: '',
}

const AdminPanel = () => {
  const { token } = useAuth()
  const [tab, setTab] = useState('mensajes')
  const [mensajes, setMensajes] = useState([])
  const [granos, setGranos] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyGrano)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const headers = { Authorization: `Bearer ${token}` }

  const fetchMensajes = async () => {
    setLoading(true)
    const res = await axios.get(`${API}/contactos`, { headers })
    setMensajes(res.data.data || res.data)
    setLoading(false)
  }

  const fetchGranos = async () => {
    setLoading(true)
    const res = await axios.get(`${API}/granos`)
    setGranos(res.data.data || res.data)
    setLoading(false)
  }

  useEffect(() => {
    if (tab === 'mensajes') fetchMensajes()
    else fetchGranos()
  }, [tab])

  const markRead = async (id) => {
    await axios.patch(`${API}/contactos/${id}/read`, {}, { headers })
    setMensajes((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m))
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await axios.put(`${API}/granos/${editingId}`, form, { headers })
    } else {
      await axios.post(`${API}/granos`, form, { headers })
    }
    setForm(emptyGrano)
    setEditingId(null)
    setShowForm(false)
    fetchGranos()
  }

  const handleEdit = (grano) => {
    setForm({
      name: grano.name || '',
      origin: grano.origin || '',
      price: grano.price || '',
      weight: grano.weight || '',
      roast: grano.roast || 'Medio',
      img: grano.img || '',
      description: grano.description || '',
    })
    setEditingId(grano._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este grano?')) return
    await axios.delete(`${API}/granos/${id}`, { headers })
    setGranos((prev) => prev.filter((g) => g._id !== id))
  }

  const cancelForm = () => {
    setForm(emptyGrano)
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <section id="admin" className="admin-panel">
      <h2 className="section-title">Panel de Administrador</h2>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'mensajes' ? 'active' : ''}`}
          onClick={() => setTab('mensajes')}
        >
          Mensajes de Contacto
        </button>
        <button
          className={`admin-tab ${tab === 'granos' ? 'active' : ''}`}
          onClick={() => setTab('granos')}
        >
          Gestionar Granos
        </button>
      </div>

      {/* MENSAJES */}
      {tab === 'mensajes' && (
        <div className="admin-content">
          {loading ? (
            <p className="admin-loading">Cargando mensajes...</p>
          ) : mensajes.length === 0 ? (
            <p className="admin-empty">No hay mensajes todavía.</p>
          ) : (
            <div className="admin-messages">
              {mensajes.map((m) => (
                <div key={m._id} className={`admin-message ${m.read ? 'read' : 'unread'}`}>
                  <div className="admin-message-header">
                    <span className="admin-message-name">{m.name}</span>
                    <span className="admin-message-email">{m.email}</span>
                    <span className="admin-message-subject">{m.subject}</span>
                    {m.read
                      ? <span className="badge-read">Leído</span>
                      : <button className="btn-mark-read" onClick={() => markRead(m._id)}>Marcar leído</button>
                    }
                  </div>
                  <p className="admin-message-text">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GRANOS */}
      {tab === 'granos' && (
        <div className="admin-content">
          {!showForm && (
            <button className="btn btn-add-grano" onClick={() => setShowForm(true)}>
              + Agregar Grano
            </button>
          )}

          {showForm && (
            <form className="admin-form" onSubmit={handleSubmit}>
              <h3>{editingId ? 'Editar Grano' : 'Nuevo Grano'}</h3>
              <div className="admin-form-grid">
                <div className="form-group">
                  <label>Nombre</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Nombre del grano" />
                </div>
                <div className="form-group">
                  <label>Origen</label>
                  <input name="origin" value={form.origin} onChange={handleChange} required placeholder="País – Región" />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input name="price" value={form.price} onChange={handleChange} placeholder="$000" />
                </div>
                <div className="form-group">
                  <label>Peso</label>
                  <input name="weight" value={form.weight} onChange={handleChange} placeholder="340g" />
                </div>
                <div className="form-group">
                  <label>Tueste</label>
                  <select name="roast" value={form.roast} onChange={handleChange}>
                    <option value="Ligero">Ligero</option>
                    <option value="Medio-Ligero">Medio-Ligero</option>
                    <option value="Medio">Medio</option>
                    <option value="Medio-Oscuro">Medio-Oscuro</option>
                    <option value="Oscuro">Oscuro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>URL de Imagen</label>
                  <input name="img" value={form.img} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Descripción del grano..." />
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="btn">{editingId ? 'Guardar Cambios' : 'Crear Grano'}</button>
                <button type="button" className="btn btn-cancel" onClick={cancelForm}>Cancelar</button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="admin-loading">Cargando granos...</p>
          ) : (
            <div className="admin-granos-list">
              {granos.map((g) => (
                <div key={g._id} className="admin-grano-row">
                  {g.img && <img src={g.img} alt={g.name} className="admin-grano-img" />}
                  <div className="admin-grano-info">
                    <strong>{g.name}</strong>
                    <span>{g.origin}</span>
                  </div>
                  <div className="admin-grano-price">{g.price}</div>
                  <div className="admin-grano-actions">
                    <button className="btn btn-edit" onClick={() => handleEdit(g)}>Editar</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(g._id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default AdminPanel

import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#fafafa', padding: '10pt', position: 'sticky', top: '0', border: '1px solid #f0f0f0' }}>
      <section style={{ display: 'flex', padding: '0 20pt', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to={!!localStorage.getItem('user') ? "/dashboard" : "/"} style={{ textDecoration: 'none' }}>
          <h3 style={{ color: '#1f1f1f', margin: '0', fontWeight: 'bold' }}>cboard</h3>
        </Link>
        <div className="navContent">
          <div className="navLinks" style={{display: 'flex'}}>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <h4 style={{ color: '#434343', margin: '0 10pt' }}>Редактор</h4>
            </Link>
            <Link to="/account" style={{ textDecoration: 'none' }}>
              <h4 style={{ color: '#434343', margin: '0 0 0 10pt' }}>Аккаунт</h4>
            </Link>
          </div>
        </div>
      </section>
    </nav>
  )
}

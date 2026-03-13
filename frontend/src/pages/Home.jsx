import React from 'react'
import { Link } from 'react-router-dom'


function Home() {
  
  return (
    <div>Home

      <div>
        <Link to='/leads'>Leads</Link>
        <Link to="/dashboard"> Dashboard</Link>
      </div>
    </div>
  )
}

export default Home
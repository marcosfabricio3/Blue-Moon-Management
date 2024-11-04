import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import App from './App.jsx'
=======

import NavBar from './components/navBar';
import CalendarWeek from './components/calendar/calendarWeek';
>>>>>>> develop
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<<<<<<< HEAD
    <App />
=======
    <NavBar/>
    <CalendarWeek/>
>>>>>>> develop
  </StrictMode>,
)

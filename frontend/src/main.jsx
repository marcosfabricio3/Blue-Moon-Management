import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import NavBar from './components/navBar';
import CalendarWeek from './components/calendar/calendarWeek';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavBar/>
    <CalendarWeek/>
  </StrictMode>,
)

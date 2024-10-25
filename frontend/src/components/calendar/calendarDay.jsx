import './calendarDay.css';
import CalendarElement from './calendarElement.jsx';

function CalendarDay({day}) {
    const halfHourNumbers = 48;

    // Función para generar la hora correspondiente a cada índice
    const formatTime = (index) => {
        
        // Calcula la hora y los minutos según el índice
        const hours = Math.floor(index / 2);
        const minutes = index % 2 === 0 ? '00' : '30';

        // Asegura que las horas se muestren siempre con 2 dígitos (e.g., '00' en vez de '0')
        return `${String(hours).padStart(2, '0')}:${minutes}`;
    };

    return (
        <div className='CalendarDay'>
            <p>{day}</p>
            {[...Array(halfHourNumbers)].map((_, index) => (
                <CalendarElement number={formatTime(index)} key={index} />
            ))}
        </div>
    );
}

export default CalendarDay;
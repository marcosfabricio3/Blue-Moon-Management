import './calendarWeek.css';

import CalendarDay from './calendarDay';

function CalendarWeek() {

    return(
        <>

        <div className="CalendarWeek">
            <p>WEEK</p>
            <div className="CalendarWeekContainer">
 
                <CalendarDay day={'LU'} />
                <CalendarDay day={'MA'} />
                <CalendarDay day={'MI'} />
                <CalendarDay day={'JU'} />
                <CalendarDay day={'Vi'} />
                <CalendarDay day={'SA'} />
                <CalendarDay day={'DO'} />

            </div>
        </div>
        
        </>
    )
};

export default CalendarWeek;
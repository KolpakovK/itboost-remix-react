import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
    viewWeek,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar'

import './index.css'

function CalendarScreen() {
    const calendar = useCalendarApp({
        locale: 'uk-UA',
        defaultView: viewWeek.name,
        views: [createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
        dayBoundaries: {
            start: '09:00',
            end: '21:00',
        },

        weekOptions:{
            gridHeight: 650,
        },
        events: [
            {
                id: '1',
                title: 'Event 1',
                start: '2024-08-20',
                end: '2024-08-21',
            },
        ],
    })
    
    return (
        <div className="flex justify-center ">
            <div className="block-size">
                <ScheduleXCalendar calendarApp={calendar} />
            </div>
        </div>
    )
}

export default CalendarScreen
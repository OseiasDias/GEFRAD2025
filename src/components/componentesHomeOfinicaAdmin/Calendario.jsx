import { useState } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaPlusCircle
} from 'react-icons/fa';
import '../../css/calendario.css'; // Certifique-se de que o CSS está importado corretamente

const Calendar = ({
  onDateSelect,
  events = [],
  initialDate = new Date()
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '' });

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = [];
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push(i);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    ));
    setSelectedDate(null); // Limpa seleção ao mudar de mês
  };

  const nextMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    ));
    setSelectedDate(null); // Limpa seleção ao mudar de mês
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    if (onDateSelect) {
      onDateSelect(clickedDate);
    }
  };

  const hasEvents = (day) => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handleAddEvent = () => {
    if (!selectedDate) return;
    setNewEvent({
      ...newEvent,
      date: selectedDate.toISOString().split('T')[0]
    });
    setShowEventForm(true);
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    console.log('Novo evento:', newEvent);
    // Aqui você poderia disparar um `onAddEvent(newEvent)` via props, se quiser
    setShowEventForm(false);
    setNewEvent({ title: '', date: '' });
  };

  const renderCalendarDays = () => {
    const rows = [];
    let days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    daysInMonth.forEach((day, i) => {
      const isSelected = selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const today = new Date();
      const isToday = today.getDate() === day &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day 
            ${isSelected ? 'selected' : ''} 
            ${isToday ? 'today' : ''}
            ${hasEvents(day) ? 'has-events' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasEvents(day) && <div className="event-dot"></div>}
        </div>
      );

      if ((i + startingDay + 1) % 7 === 0 || i === daysInMonth.length - 1) {
        rows.push(
          <div key={`row-${rows.length}`} className="calendar-row">
            {days}
          </div>
        );
        days = [];
      }
    });

    return rows;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-button">
          <FaChevronLeft />
        </button>

        <h2 className="calendar-title">
          <FaCalendarAlt className="calendar-icon" />{' '}
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button onClick={nextMonth} className="nav-button">
          <FaChevronRight />
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>

      {selectedDate && (
        <button
          onClick={handleAddEvent}
          className="add-event-button"
        >
          <FaPlusCircle /> Adicionar Evento
        </button>
      )}

      {showEventForm && (
        <div className="event-form-modal">
          <div className="event-form-content">
            <h3>Adicionar Evento</h3>
            <form onSubmit={handleEventSubmit}>
              <div className="form-group">
                <label>Título do Evento</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    title: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    date: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
                <button type="submit" className="submit-button">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

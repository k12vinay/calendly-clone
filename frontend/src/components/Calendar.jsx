import React from "react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ currentMonth, selectedDate, onSelectDate, onChangeMonth }) => {
  const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDay = start.getDay();
  const totalDays = end.getDate();

  const days = [];
  for (let i = 0; i < startDay; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  }

  const isSameDay = (a, b) =>
    a && b && a.toDateString() === b.toDateString();

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          className="icon-btn"
          onClick={() =>
            onChangeMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
            )
          }
          aria-label="Previous month"
          type="button"
        >
          {"<"}
        </button>
        <div className="calendar-title">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          className="icon-btn"
          onClick={() =>
            onChangeMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
            )
          }
          aria-label="Next month"
          type="button"
        >
          {">"}
        </button>
      </div>
      <div className="calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        {days.map((date, index) => (
          <button
            key={`${date ? date.toISOString() : "empty"}-${index}`}
            className={`calendar-day ${
              date && isSameDay(date, selectedDate) ? "selected" : ""
            } ${date ? "" : "disabled"}`}
            onClick={() => date && onSelectDate(date)}
            disabled={!date}
            type="button"
          >
            {date ? date.getDate() : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

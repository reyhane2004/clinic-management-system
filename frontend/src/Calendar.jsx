import { useEffect, useState } from 'react'
import axios from 'axios'

function Calendar() {

  const today = new Date()

  const [currentDate, setCurrentDate] =
    useState(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    )

  const [appointments, setAppointments] =
    useState([])

  const [selectedAppointment, setSelectedAppointment] =
    useState(null)

  const monthNames = [
    'ژانویه',
    'فوریه',
    'مارس',
    'آوریل',
    'مه',
    'ژوئن',
    'ژوئیه',
    'اوت',
    'سپتامبر',
    'اکتبر',
    'نوامبر',
    'دسامبر',
  ]

  const weekDays = [
    'یکشنبه',
    'دوشنبه',
    'سه شنبه',
    'چهارشنبه',
    'پنجشنبه',
    'جمعه',
    'شنبه',
  ]

  useEffect(() => {

    axios
      .get(
        'http://127.0.0.1:8000/api/appointments'
      )
      .then((response) => {
        setAppointments(response.data)
      })
      .catch((error) => {
        console.error(
          'Error fetching appointments:',
          error
        )
      })

  }, [])

  const currentYear =
    currentDate.getFullYear()

  const currentMonth =
    currentDate.getMonth()

  const firstDayOfMonth =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay()

  const daysInMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate()

    const getAppointmentsForDay = (day) => {

      if (!day) {
        return []
      }
  
      return appointments.filter(
        (appointment) => {
  
          if (!appointment.appointment_date) {
            return false
          }
  
          const [
            year,
            month,
            date
          ] = appointment.appointment_date
            .substring(0, 10)
            .split('-')
            .map(Number)
  
          return (
            year === currentYear &&
            month === currentMonth + 1 &&
            date === day
          )
        }
      )
    }
  
    const days = []
  
    for (
      let i = 0;
      i < firstDayOfMonth;
      i++
    ) {
      days.push(null)
    }
  
    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push(day)
    }
  
    const goToPreviousMonth = () => {
  
      setCurrentDate(
        new Date(
          currentYear,
          currentMonth - 1,
          1
        )
      )
    }
  
    const goToNextMonth = () => {
  
      setCurrentDate(
        new Date(
          currentYear,
          currentMonth + 1,
          1
        )
      )
    }
  
    const isToday = (day) => {
  
      return (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      )
    }

    return (

      <div className="calendar-page">
  
        <div className="calendar-header">
  
          <div>
  
            <h1>تقویم نوبت‌ها</h1>
  
            <p>
              نوبت‌های کلینیک را بر اساس تاریخ
              مشاهده کنید.
            </p>
  
          </div>
  
          <div className="calendar-navigation">
  
            <button
              onClick={goToPreviousMonth}
            >
              ‹
            </button>
  
            <h2>
              {monthNames[currentMonth]}{' '}
              {currentYear}
            </h2>
  
            <button
              onClick={goToNextMonth}
            >
              ›
            </button>
  
          </div>
  
        </div>
  
        <div className="calendar-weekdays">
  
          {weekDays.map((day) => (
  
            <div key={day}>
              {day}
            </div>
  
          ))}
  
        </div>
  
        <div className="calendar-grid">
  
          {days.map((day, index) => {
  
            const dayAppointments =
              day
                ? getAppointmentsForDay(day)
                : []
  
            return (
  
              <div
                key={index}
                className={`calendar-day ${
                  day === null
                    ? 'empty'
                    : ''
                }`}
              >
  
                {day && (
  
                  <>
  
                    <span
                      className={`day-number ${
                        isToday(day)
                          ? 'today'
                          : ''
                      }`}
                    >
                      {day}
                    </span>
  
                    <div className="calendar-appointments">
  
                      {dayAppointments.map(
                        (appointment) => (
  
                          <div
                            key={appointment.id}
                            className={`calendar-appointment ${appointment.status}`}
                            onClick={() =>
                              setSelectedAppointment(
                                appointment
                              )
                            }
                          >
  
                            <strong>
                              {
                                appointment.appointment_time
                              }
                            </strong>
  
                            <span>
                              {
                                appointment.doctor?.user?.name ||
                                'Doctor'
                              }
                            </span>
  
                          </div>
  
                        )
                      )}
  
                    </div>
  
                  </>
  
                )}
  
              </div>
  
            )
          })}
  
        </div>

        {selectedAppointment && (

<div className="appointment-modal-overlay">

  <div className="appointment-modal">

    <div className="appointment-modal-header">

      <h2>
        جزئیات نوبت
      </h2>

      <button
        onClick={() =>
          setSelectedAppointment(null)
        }
      >
        ×
      </button>

    </div>

    <div className="appointment-modal-content">

      <p>
        <strong>
          بیمار:
        </strong>{' '}
        {
          selectedAppointment.patient?.user?.name ||
          'نامشخص'
        }
      </p>

      <p>
        <strong>
          پزشک:
        </strong>{' '}
        {
          selectedAppointment.doctor?.user?.name ||
          'نامشخص'
        }
      </p>

      <p>
      <strong>تاریخ:</strong>{' '}
        {(() => {
        const [year, month, day] =
        selectedAppointment.appointment_date
        .substring(0, 10)
        .split('-')
        .map(Number)

      return `${day} ${monthNames[month - 1]} ${year}`
    })()}
      </p>

      <p>
        <strong>
          ساعت:
        </strong>{' '}
        {
          selectedAppointment
            .appointment_time
        }
      </p>

      <p>
        <strong>
          وضعیت:
        </strong>{' '}

        {
          selectedAppointment.status ===
          'pending'
            ? 'در انتظار'
            : selectedAppointment.status ===
              'confirmed'
            ? 'تأیید شده'
            : selectedAppointment.status ===
              'completed'
            ? 'تکمیل شده'
            : selectedAppointment.status ===
              'cancelled'
            ? 'لغو شده'
            : selectedAppointment.status
        }

      </p>

      <p>
        <strong>
          توضیحات:
        </strong>{' '}

        {
          selectedAppointment.description ||
          'توضیحی ثبت نشده است.'
        }

      </p>

    </div>

    </div>

        </div>

      )}

    </div>

  )
}

export default Calendar
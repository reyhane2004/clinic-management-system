import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function Reports() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/appointments')
      .then((response) => {
        setAppointments(response.data)
      })
      .catch((error) => {
        console.error(
          'Error fetching appointments:',
          error
        )
      })

    axios
      .get('http://127.0.0.1:8000/api/doctors')
      .then((response) => {
        setDoctors(response.data)
      })
      .catch((error) => {
        console.error(
          'Error fetching doctors:',
          error
        )
      })

    axios
      .get('http://127.0.0.1:8000/api/patients')
      .then((response) => {
        setPatients(response.data)
      })
      .catch((error) => {
        console.error(
          'Error fetching patients:',
          error
        )
      })
  }, [])

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === 'completed'
  ).length

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === 'cancelled'
  ).length

  const pendingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === 'pending'
  ).length

  const doctorReports = doctors.map((doctor) => {
    const count = appointments.filter(
      (appointment) =>
        appointment.doctor_id === doctor.id
    ).length

    return {
      id: doctor.id,
      name: doctor.user?.name || 'نامشخص',
      count,
    }
  })

  return (
    <div className="reports-page">

      <div className="reports-header">
        <h1>گزارش‌ها</h1>

        <p>
          گزارش آماری سامانه مدیریت کلینیک
        </p>
      </div>

      <div className="reports-grid">

        <div className="report-card">
          <span>👨‍⚕️</span>
          <h3>تعداد پزشکان</h3>
          <strong>{doctors.length}</strong>
        </div>

        <div className="report-card">
          <span>👤</span>
          <h3>تعداد بیماران</h3>
          <strong>{patients.length}</strong>
        </div>

        <div className="report-card">
          <span>📅</span>
          <h3>کل نوبت‌ها</h3>
          <strong>{appointments.length}</strong>
        </div>

        <div className="report-card">
          <span>✅</span>
          <h3>نوبت‌های تکمیل‌شده</h3>
          <strong>
            {completedAppointments}
          </strong>
        </div>

        <div className="report-card">
          <span>⏳</span>
          <h3>نوبت‌های در انتظار</h3>
          <strong>
            {pendingAppointments}
          </strong>
        </div>

        <div className="report-card">
          <span>❌</span>
          <h3>نوبت‌های لغوشده</h3>
          <strong>
            {cancelledAppointments}
          </strong>
        </div>

      </div>

      <div className="doctor-reports">

<div className="doctor-reports-header">
  <h2>
    گزارش نوبت‌های پزشکان
  </h2>

  <p>
    تعداد نوبت‌های ثبت‌شده برای هر پزشک
  </p>
</div>

<div className="doctor-reports-list">

  {doctorReports.map((doctor) => (
    <div
      className="doctor-report-row"
      key={doctor.id}
    >

      <span>
        دکتر {doctor.name}
      </span>

      <strong>
        {doctor.count} نوبت
      </strong>

    </div>
  ))}

</div>

</div>

      <div className="status-reports">

        <div className="status-reports-header">
          <h2>گزارش وضعیت نوبت‌ها</h2>

          <p>
            وضعیت فعلی نوبت‌های ثبت‌شده در کلینیک
          </p>
        </div>

        <div className="status-reports-list">

          <div className="status-report-item">
            <span>⏳ در انتظار</span>
            <strong>{pendingAppointments}</strong>
          </div>

          <div className="status-report-item">
            <span>✅ تکمیل‌شده</span>
            <strong>{completedAppointments}</strong>
          </div>

          <div className="status-report-item">
            <span>❌ لغوشده</span>
            <strong>{cancelledAppointments}</strong>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Reports
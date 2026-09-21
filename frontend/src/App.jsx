import { useEffect, useState } from 'react'
import axios from 'axios'

import './App.css'

import Doctors from './Doctors'
import NewAppointment from './NewAppointment'
import Appointments from './Appointments'
import Reports from './Reports'
import Patients from './Patients'
import Calendar from './Calendar'
import Login from './Login'
import PublicAppointment from './PublicAppointment'

axios.interceptors.request.use((config) => {

  const savedUser =
    localStorage.getItem('clinicUser')

  if (savedUser) {

    const user =
      JSON.parse(savedUser)

    if (user?.id) {
      config.headers['X-User-Id'] =
        user.id
    }

  }

  return config

})

function App() {

  const [appointments, setAppointments] =
    useState([])

  const [doctors, setDoctors] =
    useState([])

  const [patients, setPatients] =
    useState([])

const [showDoctors, setShowDoctors] =
    useState(false)

  const [showAppointments, setShowAppointments] =
    useState(false)

  const [showNewAppointment, setShowNewAppointment] =
    useState(false)

  const [showPatients, setShowPatients] =
    useState(false)

const [showReports, setShowReports] =
    useState(false)

  const [showCalendar, setShowCalendar] =
    useState(false)

  const [showPublicAppointment, setShowPublicAppointment] =
    useState(false)

  const [showLogin, setShowLogin] =
    useState(false)

const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem('clinicUser')

    return savedUser
      ? JSON.parse(savedUser)
      : null

  })

  const userRole =
    user?.role?.name

const [currentPage, setCurrentPage] =
    useState('dashboard')

  const [pageHistory, setPageHistory] =
    useState([])

const setPageVisibility = (page) => {

    setShowDoctors(
      page === 'doctors'
    )

    setShowAppointments(
      page === 'appointments'
    )

    setShowNewAppointment(
      page === 'newAppointment'
    )

    setShowPatients(
      page === 'patients'
    )

    setShowReports(
      page === 'reports'
    )

    setShowCalendar(
      page === 'calendar'
    )

  }

const openPage = (page) => {

    if (page === currentPage) {
      return
    }

    setPageHistory((prev) => [
      ...prev,
      currentPage
    ])

    setCurrentPage(page)

    setPageVisibility(page)

    setShowPublicAppointment(false)

  }

const goBack = () => {

    setPageHistory((prev) => {

      if (prev.length === 0) {

        setCurrentPage('dashboard')

        setPageVisibility(
          'dashboard'
        )

        return []

      }

      const newHistory =
        [...prev]

      const previousPage =
        newHistory.pop()

      setCurrentPage(
        previousPage
      )

      setPageVisibility(
        previousPage
      )

      return newHistory

    })

  }

const goHome = () => {

    setCurrentPage(
      'dashboard'
    )

    setPageHistory([])

    setPageVisibility(
      'dashboard'
    )

    setShowPublicAppointment(
      false
    )

  }

const handleLogin = (
    loggedInUser
  ) => {

    localStorage.setItem(
      'clinicUser',
      JSON.stringify(
        loggedInUser
      )
    )

    setUser(
      loggedInUser
    )

    setShowLogin(
      false
    )

    setShowPublicAppointment(
      false
    )

    setCurrentPage(
      'dashboard'
    )

    setPageHistory([])

    setPageVisibility(
      'dashboard'
    )

  }

const handleLogout = () => {

    localStorage.removeItem(
      'clinicUser'
    )

    setUser(null)

    setShowLogin(
      false
    )

    setShowPublicAppointment(
      false
    )

    setCurrentPage(
      'dashboard'
    )

    setPageHistory([])

    setPageVisibility(
      'dashboard'
    )

  }

useEffect(() => {

    if (!user) {
      return
    }

    axios
      .get(
        'http://127.0.0.1:8000/api/appointments'
      )
      .then((response) => {

        setAppointments(
          response.data
        )

      })
      .catch((error) => {

        console.error(
          'Error fetching appointments:',
          error
        )

      })

  }, [user])

useEffect(() => {

    if (!user) {
      return
    }

    axios
      .get(
        'http://127.0.0.1:8000/api/doctors'
      )
      .then((response) => {

        setDoctors(
          response.data
        )

      })
      .catch((error) => {

        console.error(
          'Error fetching doctors:',
          error
        )

      })

  }, [user])

useEffect(() => {

    if (
      !user ||
      userRole === 'Patient'
    ) {
      return
    }

    axios
      .get(
        'http://127.0.0.1:8000/api/patients'
      )
      .then((response) => {

        setPatients(
          response.data
        )

      })
      .catch((error) => {

        console.error(
          'Error fetching patients:',
          error
        )

      })

  }, [user, userRole])

const today =
    new Date()

  const todayString =
    today.getFullYear() +
    '-' +
    String(
      today.getMonth() + 1
    ).padStart(2, '0') +
    '-' +
    String(
      today.getDate()
    ).padStart(2, '0')

const todayAppointments =
    appointments.filter(
      (appointment) =>
        appointment.appointment_date &&
        appointment.appointment_date.startsWith(
          todayString
        )
    )

const handleAppointmentCreated =
    (newAppointment) => {

      setAppointments((prev) => [
        ...prev,
        newAppointment
      ])

      openPage(
        'appointments'
      )

    }

if (
    !user &&
    showLogin
  ) {

    return (

      <Login
        onLogin={
          handleLogin
        }
      />

    )

  }

if (
    !user &&
    !showPublicAppointment
  ) {

    return (

      <div className="public-home">

        <h1>
          🏥 کلینیک من
        </h1>

        <p>
          به سامانه مدیریت کلینیک خوش آمدید
        </p>

        <div className="public-home-actions">

<button
            onClick={() =>
              setShowLogin(
                true
              )
            }
          >
            🔐 ورود به پنل مدیریت
          </button>

          <button
            onClick={() =>
              setShowPublicAppointment(
                true
              )
            }
          >
            📅 دریافت نوبت
          </button>

        </div>

      </div>

    )

  }

if (
    !user &&
    showPublicAppointment
  ) {

    return (

      <div className="public-home">

        <div className="public-home-actions">

          <button
            onClick={() =>
              setShowPublicAppointment(
                false
              )
            }
          >
            ← بازگشت به صفحه اصلی
          </button>

        </div>

        <PublicAppointment />

      </div>

    )

  }

return (

    <div className="app-container">

      <aside className="sidebar">

        <div className="sidebar-header">

          <h2>
            🏥 کلینیک من
          </h2>

          <p>
            پنل مدیریت
          </p>

        </div>

        <div className="sidebar-user">

          <strong>
            {user?.name}
          </strong>

          <span>
            {userRole}
          </span>

        </div>

<nav className="sidebar-menu">

          <button
            onClick={() =>
              openPage(
                'dashboard'
              )
            }
          >
            📊 داشبورد
          </button>


          {(userRole === 'Admin' ||
            userRole === 'Doctor' ||
            userRole === 'Receptionist' ||
            userRole === 'Patient') && (

            <button
              onClick={() =>
                openPage(
                  'doctors'
                )
              }
            >
              👨‍⚕️ پزشکان
            </button>

          )}

{(userRole === 'Admin' ||
            userRole === 'Doctor' ||
            userRole === 'Receptionist' ||
            userRole === 'Patient') && (

            <button
              onClick={() =>
                openPage(
                  'appointments'
                )
              }
            >
              📅 نوبت‌ها
            </button>

          )}


          {(userRole === 'Admin' ||
            userRole === 'Doctor' ||
            userRole === 'Receptionist' ||
            userRole === 'Patient') && (

            <button
              onClick={() =>
                openPage(
                  'newAppointment'
                )
              }
            >
              ➕ ثبت نوبت
            </button>

          )}

{(userRole === 'Admin' ||
            userRole === 'Receptionist') && (

            <button
              onClick={() =>
                openPage(
                  'patients'
                )
              }
            >
              👥 بیماران
            </button>

          )}


          {(userRole === 'Admin' ||
            userRole === 'Doctor' ||
            userRole === 'Receptionist' ||
            userRole === 'Patient') && (

            <button
              onClick={() =>
                openPage(
                  'calendar'
                )
              }
            >
              🗓️ تقویم
            </button>

          )}

{(userRole === 'Admin' ||
            userRole === 'Doctor' ||
            userRole === 'Receptionist') && (

            <button
              onClick={() =>
                openPage(
                  'reports'
                )
              }
            >
              📈 گزارش‌ها
            </button>

          )}

        </nav>

        <div className="sidebar-footer">

          <button
            onClick={
              handleLogout
            }
            className="logout-button"
          >
            🚪 خروج از حساب
          </button>

        </div>

      </aside>

<main className="main-content">

        <header className="dashboard-header">

          <div>

            <h1>
              سامانه مدیریت کلینیک
            </h1>

            <p>
              خوش آمدید، {user?.name}
            </p>

          </div>

          <div className="header-user">

            <span>
              نقش:
            </span>

            <strong>
              {userRole}
            </strong>

          </div>

        </header>

{(showDoctors ||
          showAppointments ||
          showNewAppointment ||
          showPatients ||
          showReports ||
          showCalendar) && (

          <div className="page-navigation">

            <button
              type="button"
              onClick={goBack}
              className="page-back-button"
            >
              ← برگشت
            </button>

            <button
              type="button"
              onClick={goHome}
              className="page-home-button"
            >
              🏠 صفحه اصلی
            </button>

          </div>

        )}

{!showDoctors &&
          !showAppointments &&
          !showNewAppointment &&
          !showPatients &&
          !showReports &&
          !showCalendar && (

            <div className="dashboard">

              <div className="dashboard-cards">

                <div className="dashboard-card">

                  <span>
                    👨‍⚕️
                  </span>

                  <div>

                    <h3>
                      پزشکان
                    </h3>

                    <strong>
                      {doctors.length}
                    </strong>

                  </div>

                </div>


                <div className="dashboard-card">

                  <span>
                    👥
                  </span>

                  <div>

                    <h3>
                      بیماران
                    </h3>

                    <strong>
                      {patients.length}
                    </strong>

                  </div>

                </div>

<div className="dashboard-card">

                  <span>
                    📅
                  </span>

                  <div>

                    <h3>
                      کل نوبت‌ها
                    </h3>

                    <strong>
                      {appointments.length}
                    </strong>

                  </div>

                </div>


                <div className="dashboard-card">

                  <span>
                    🕐
                  </span>

                  <div>

                    <h3>
                      نوبت‌های امروز
                    </h3>

                    <strong>
                      {todayAppointments.length}
                    </strong>

                  </div>

                </div>

              </div>


              <div className="quick-actions">

                <h2>
                  دسترسی سریع
                </h2>

                <div className="quick-actions-grid">

{(userRole === 'Admin' ||
                    userRole === 'Doctor' ||
                    userRole === 'Receptionist' ||
                    userRole === 'Patient') && (

                    <button
                      onClick={() =>
                        openPage(
                          'newAppointment'
                        )
                      }
                    >
                      ➕
                      <span>
                        ثبت نوبت جدید
                      </span>
                    </button>

                  )}


                  {(userRole === 'Admin' ||
                    userRole === 'Doctor' ||
                    userRole === 'Receptionist' ||
                    userRole === 'Patient') && (

                    <button
                      onClick={() =>
                        openPage(
                          'doctors'
                        )
                      }
                    >
                      👨‍⚕️
                      <span>
                        مشاهده پزشکان
                      </span>
                    </button>

                  )}

{(userRole === 'Admin' ||
                    userRole === 'Receptionist') && (

                    <button
                      onClick={() =>
                        openPage(
                          'patients'
                        )
                      }
                    >
                      👥
                      <span>
                        مدیریت بیماران
                      </span>
                    </button>

                  )}


                  {(userRole === 'Admin' ||
                    userRole === 'Doctor' ||
                    userRole === 'Receptionist') && (

                    <button
                      onClick={() =>
                        openPage(
                          'reports'
                        )
                      }
                    >
                      📈
                      <span>
                        مشاهده گزارش‌ها
                      </span>
                    </button>

                  )}

                </div>

              </div>

            </div>

          )}


        {showDoctors && (
          <Doctors />
        )}


        {showAppointments && (

          <Appointments
            appointments={
              appointments
            }

            onAppointmentUpdated={
              (updatedAppointment) => {

                setAppointments((prev) =>
                  prev.map(
                    (appointment) =>
                      appointment.id ===
                      updatedAppointment.id
                        ? updatedAppointment
                        : appointment
                  )
                )

              }
            }

            onAppointmentDeleted={
              (deletedId) => {

                setAppointments((prev) =>
                  prev.filter(
                    (appointment) =>
                      appointment.id !==
                      deletedId
                  )
                )

              }
            }

          />

        )}

{showNewAppointment && (

          <NewAppointment
            onAppointmentCreated={
              handleAppointmentCreated
            }
          />

        )}


        {showPatients && (
          <Patients />
        )}


        {showReports && (

          <Reports
            appointments={
              appointments
            }
            doctors={
              doctors
            }
            patients={
              patients
            }
          />

        )}


        {showCalendar && (

          <Calendar
            appointments={
              appointments
            }
          />

        )}

      </main>

    </div>

  )

}

export default App
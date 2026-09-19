import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function Appointments() {

  const savedUser = localStorage.getItem('clinicUser')

  const user = savedUser
    ? JSON.parse(savedUser)
    : null

  const userRole = user?.role?.name

  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  const [editingAppointment, setEditingAppointment] =
    useState(null)

  const [showEditForm, setShowEditForm] =
    useState(false)

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

  const formatGregorianDate = (dateString) => {
    if (!dateString) {
      return 'تاریخ نامشخص'
    }

    const [year, month, day] = dateString
      .substring(0, 10)
      .split('-')
      .map(Number)

    return `${day} ${monthNames[month - 1]} ${year}`
  }

  useEffect(() => {
    getAppointments()
    getDoctors()

    if (userRole !== 'Patient') {
      getPatients()
    }
  }, [])

const getAppointments = () => {
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
  }

  const getDoctors = () => {
    axios
      .get(
        'http://127.0.0.1:8000/api/doctors'
      )
      .then((response) => {
        setDoctors(response.data)
      })
      .catch((error) => {
        console.error(
          'Error fetching doctors:',
          error
        )
      })
  }

const getPatients = () => {
    axios
      .get(
        'http://127.0.0.1:8000/api/patients'
      )
      .then((response) => {
        setPatients(response.data)
      })
      .catch((error) => {
        console.error(
          'Error fetching patients:',
          error
        )
      })
  }

  const filteredAppointments =
    appointments.filter((appointment) => {

      const patientName =
        appointment.patient?.user?.name
          ?.toLowerCase() || ''

      const doctorName =
        appointment.doctor?.user?.name
          ?.toLowerCase() || ''

      const searchValue =
        search.toLowerCase().trim()

const matchesSearch =
        patientName.includes(searchValue) ||
        doctorName.includes(searchValue)

      const matchesStatus =
        statusFilter === 'all' ||
        appointment.status === statusFilter

      const matchesDate =
        dateFilter === '' ||
        appointment.appointment_date
          ?.startsWith(dateFilter)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      )
    })

  const startEditing = (appointment) => {
    setEditingAppointment({
      id: appointment.id,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,

      appointment_date:
        appointment.appointment_date
          ?.substring(0, 10) || '',

appointment_time:
        appointment.appointment_time
          ?.substring(0, 5) || '',

      description:
        appointment.description || '',
    })

    setShowEditForm(true)
  }

  const cancelEditing = () => {
    setEditingAppointment(null)
    setShowEditForm(false)
  }

  const updateAppointment = (e) => {
    e.preventDefault()

    axios
      .put(
        `http://127.0.0.1:8000/api/appointments/${editingAppointment.id}`,
        {
          patient_id:
            editingAppointment.patient_id,

          doctor_id:
            editingAppointment.doctor_id,

          appointment_date:
            editingAppointment.appointment_date,

          appointment_time:
            editingAppointment.appointment_time,

description:
            editingAppointment.description,
        }
      )
      .then((response) => {

        setAppointments(
          (currentAppointments) =>
            currentAppointments.map(
              (appointment) =>
                appointment.id ===
                editingAppointment.id
                  ? response.data.appointment
                  : appointment
            )
        )

        alert(
          'نوبت با موفقیت ویرایش شد.'
        )

        cancelEditing()
      })
      .catch((error) => {

        console.error(
          'Error updating appointment:',
          error
        )

        if (error.response?.data?.message) {
          alert(error.response.data.message)
        } else {
          alert(
            'ویرایش نوبت با مشکل مواجه شد.'
          )
        }
      })
  }

const deleteAppointment = (id) => {
    const confirmed = window.confirm(
      'آیا از حذف این نوبت مطمئن هستید؟'
    )

    if (!confirmed) {
      return
    }

    axios
      .delete(
        `http://127.0.0.1:8000/api/appointments/${id}`
      )
      .then(() => {

        setAppointments(
          (currentAppointments) =>
            currentAppointments.filter(
              (appointment) =>
                appointment.id !== id
            )
        )

        alert(
          'نوبت با موفقیت حذف شد.'
        )
      })
      .catch((error) => {

        console.error(
          'Error deleting appointment:',
          error
        )

        alert(
          'حذف نوبت با مشکل مواجه شد.'
        )
      })
  }

const updateStatus = (id, status) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/appointments/${id}/status`,
        {
          status: status,
        }
      )
      .then((response) => {

        setAppointments(
          (currentAppointments) =>
            currentAppointments.map(
              (appointment) =>
                appointment.id === id
                  ? response.data.appointment
                  : appointment
            )
        )

        if (status === 'cancelled') {
          alert(
            'نوبت با موفقیت لغو شد.'
          )
        }

        if (status === 'confirmed') {
          alert(
            'نوبت با موفقیت تأیید شد.'
          )
        }

        if (status === 'completed') {
          alert(
            'نوبت به عنوان انجام‌شده ثبت شد.'
          )
        }
      })

.catch((error) => {

        console.error(
          'Error updating appointment status:',
          error
        )

        if (error.response?.data?.message) {
          alert(error.response.data.message)
        } else {
          alert(
            'تغییر وضعیت نوبت با مشکل مواجه شد.'
          )
        }
      })
  }

  if (
    showEditForm &&
    editingAppointment
  ) {
    return (
      <div className="new-appointment-page">

        <div className="new-appointment-header">

          <h1>
            ویرایش نوبت
          </h1>

          <p>
            اطلاعات نوبت را ویرایش کنید.
          </p>

        </div>

<form
          onSubmit={updateAppointment}
          className="appointment-form"
        >

          <div className="form-group">

            <label>
              بیمار
            </label>

            <select
              value={
                editingAppointment.patient_id
              }
              onChange={(e) =>
                setEditingAppointment({
                  ...editingAppointment,
                  patient_id: e.target.value,
                })
              }
              required
            >

              <option value="">
                بیمار را انتخاب کنید
              </option>

              {patients.map((patient) => (
                <option
                  key={patient.id}
                  value={patient.id}
                >
                  {patient.user?.name ||
                    'نامشخص'}
                </option>
              ))}

            </select>

          </div>

<div className="form-group">

            <label>
              پزشک
            </label>

            <select
              value={
                editingAppointment.doctor_id
              }
              onChange={(e) =>
                setEditingAppointment({
                  ...editingAppointment,
                  doctor_id: e.target.value,
                })
              }
              required
            >

              <option value="">
                پزشک را انتخاب کنید
              </option>

              {doctors.map((doctor) => (
                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  دکتر {doctor.user?.name}
                  {' - '}
                  {doctor.department?.name}
                </option>
              ))}

            </select>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                تاریخ نوبت
              </label>

              <input
                type="date"
                value={
                  editingAppointment.appointment_date
                }

onChange={(e) =>
                  setEditingAppointment({
                    ...editingAppointment,
                    appointment_date:
                      e.target.value,
                  })
                }
                required
              />

            </div>

            <div className="form-group">

              <label>
                ساعت نوبت
              </label>

              <input
                type="time"
                value={
                  editingAppointment.appointment_time
                }
                onChange={(e) =>
                  setEditingAppointment({
                    ...editingAppointment,
                    appointment_time:
                      e.target.value,
                  })
                }
                required
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              توضیحات
            </label>

            <textarea
              value={
                editingAppointment.description
              }

onChange={(e) =>
                setEditingAppointment({
                  ...editingAppointment,
                  description: e.target.value,
                })
              }
              rows="4"
              placeholder="توضیحات مربوط به نوبت..."
            />

          </div>

          <div className="appointment-edit-actions">

            <button
              type="submit"
              className="submit-appointment"
            >
              💾 ذخیره تغییرات
            </button>

            <button
              type="button"
              className="back-button"
              onClick={cancelEditing}
            >
              ↩️ انصراف
            </button>

          </div>

        </form>

      </div>
    )
  }

  return (
    <div className="appointments-page">

<div className="appointments-page-header">

        <div>

          <h1>
            نوبت‌ها
          </h1>

          <p>
            لیست نوبت‌های ثبت‌شده
          </p>

        </div>

        <div className="appointment-search">

          <input
            type="text"
            placeholder="جست‌وجوی بیمار یا پزشک..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="appointment-date-filter">

          <input
            type="date"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
          />

        </div>

<div className="appointment-filter">

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="all">
              همه نوبت‌ها
            </option>

            <option value="pending">
              در انتظار تأیید
            </option>

            <option value="confirmed">
              تأیید شده
            </option>

            <option value="completed">
              انجام شده
            </option>

            <option value="cancelled">
              لغو شده
            </option>

          </select>

        </div>

        <div className="appointment-count">

          تعداد نوبت‌های نمایش‌داده‌شده:{' '}
          {filteredAppointments.length}

        </div>

      </div>

      {appointments.length === 0 ? (

        <p>
          در حال دریافت اطلاعات نوبت‌ها...
        </p>

      ) : filteredAppointments.length === 0 ? (

        <div className="no-appointments">
          نوبتی با این مشخصات پیدا نشد.
        </div>

) : (

        <div className="appointments-list">

          {filteredAppointments.map(
            (appointment) => (

              <div
                className="appointment-card"
                key={appointment.id}
              >

                <div className="appointment-card-header">

                  <div>

                    <h2>
                      نوبت شماره {appointment.id}
                    </h2>

                    <span>
                      {formatGregorianDate(
                        appointment.appointment_date
                      )}
                      {' - '}
                      {appointment.appointment_time}
                    </span>

                  </div>

                  <span
                    className={`status ${appointment.status}`}
                  >
                    {appointment.status ===
                    'pending'
                      ? 'در انتظار تأیید'
                      : appointment.status ===
                        'confirmed'
                      ? 'تأیید شده'
                      : appointment.status ===
                        'completed'
                      ? 'انجام شده'
                      : appointment.status ===
                        'cancelled'
                      ? 'لغو شده'
                      : appointment.status}
                  </span>

                </div>

<div className="appointment-card-info">

                  <div>

                    <span>
                      بیمار
                    </span>

                    <strong>
                      {appointment.patient?.user?.name ||
                        'نامشخص'}
                    </strong>

                  </div>

                  <div>

                    <span>
                      پزشک
                    </span>

                    <strong>
                      دکتر{' '}
                      {appointment.doctor?.user?.name ||
                        'نامشخص'}
                    </strong>

                  </div>

                  <div>

                    <span>
                      تخصص
                    </span>

                    <strong>
                      {appointment.doctor?.department?.name ||
                        'نامشخص'}
                    </strong>

                  </div>

                </div>

                {appointment.description && (

                  <div className="appointment-description">

                    <span>
                      توضیحات
                    </span>

                    <p>
                      {appointment.description}
                    </p>

                  </div>

                )}

                {userRole === 'Patient' ? (

                  <>
                    {(appointment.status ===
                      'pending' ||
                      appointment.status ===
                        'confirmed') && (

                      <div className="appointment-actions">

<button
                          onClick={() => {

                            const confirmed =
                              window.confirm(
                                'آیا از لغو این نوبت مطمئن هستید؟'
                              )

                            if (confirmed) {
                              updateStatus(
                                appointment.id,
                                'cancelled'
                              )
                            }

                          }}
                          className="cancel-button"
                        >
                          ❌ لغو نوبت
                        </button>

                      </div>

                    )}
                  </>

                ) : (

                  <>

                {(userRole === 'Admin' || userRole === 'Receptionist') && (
                  <div className="appointment-actions">

                    <button
                    onClick={() =>
                      startEditing(appointment)
                    }
                    className="edit-appointment-button"
                  >
                    ✏️ ویرایش
                    </button>

                    <button
                    onClick={() =>
                      deleteAppointment(appointment.id)
                    }
                    className="delete-appointment-button"
                  >
                  🗑️ حذف
                  </button>

                </div>
                )}
                    

                    {appointment.status === 'pending' && (

<div className="appointment-actions">

  {userRole !== 'Patient' && (
    <button
      onClick={() =>
        updateStatus(
          appointment.id,
          'confirmed'
        )
      }
      className="confirm-button"
    >
      ✅ تأیید نوبت
    </button>
  )}

  <button
    onClick={() =>
      updateStatus(
        appointment.id,
        'cancelled'
      )
    }
    className="cancel-button"
  >
    ❌ لغو نوبت
  </button>

</div>

)}

{appointment.status === 'confirmed' && (

<div className="appointment-actions">

  {userRole !== 'Patient' && (
    <button
      onClick={() =>
        updateStatus(
          appointment.id,
          'completed'
        )
      }
      className="complete-button"
    >
      ✅ انجام شد
    </button>
  )}

  <button
    onClick={() =>
      updateStatus(
        appointment.id,
        'cancelled'
      )
    }
    className="cancel-button"
  >
    ❌ لغو نوبت
  </button>

</div>

)}

                  </>

                )}

              </div>
            )
          )}

        </div>
      )}

    </div>
  )
}

export default Appointments
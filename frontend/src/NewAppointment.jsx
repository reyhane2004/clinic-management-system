import { useEffect, useState } from 'react'
import axios from 'axios'

function NewAppointment({
  onAppointmentCreated,
}) {

  const savedUser =
    localStorage.getItem('clinicUser')

  const user = savedUser
    ? JSON.parse(savedUser)
    : null

  const userRole =
    user?.role?.name

  const [doctors, setDoctors] =
    useState([])

  const [patients, setPatients] =
    useState([])

  const [patientSearch, setPatientSearch] =
    useState('')

  const [selectedPatient, setSelectedPatient] =
    useState(null)

const [form, setForm] = useState({
    patient_id:
      user?.patient?.id || '',

    doctor_id: '',

    appointment_date: '',

    appointment_time: '',

    description: '',
  })

  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')

  useEffect(() => {

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

        setError(
          'دریافت لیست پزشکان با مشکل مواجه شد.'
        )

      })

    if (userRole !== 'Patient') {

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

          setError(
            'دریافت لیست بیماران با مشکل مواجه شد.'
          )

        })

    }

  }, [])

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    })

  }

const handlePatientSearch = (e) => {

    const value =
      e.target.value

    setPatientSearch(value)

    setSelectedPatient(null)

    setForm({
      ...form,
      patient_id: '',
    })

  }

  const selectPatient = (patient) => {

    setSelectedPatient(
      patient
    )

    setPatientSearch(
      patient.user?.name || ''
    )

    setForm({
      ...form,
      patient_id:
        patient.id,
    })

  }

const clearSelectedPatient = () => {

    setSelectedPatient(null)

    setPatientSearch('')

    setForm({
      ...form,
      patient_id: '',
    })

  }

  const filteredPatients =
    patients.filter((patient) => {

      const name =
        patient.user?.name
          ?.toLowerCase() || ''

      const phone =
        patient.phone
          ?.toLowerCase() || ''

      const search =
        patientSearch
          .toLowerCase()
          .trim()

return (
        name.includes(search) ||
        phone.includes(search)
      )

    })

  const handleSubmit = (e) => {

    e.preventDefault()

    setMessage('')

    setError('')

    if (
      userRole !== 'Patient' &&
      !form.patient_id
    ) {

      setError(
        'لطفاً ابتدا یک بیمار را انتخاب کنید.'
      )

      return

    }

    if (!form.doctor_id) {

      setError(
        'لطفاً پزشک را انتخاب کنید.'
      )

      return
    }

if (!form.appointment_date) {

      setError(
        'لطفاً تاریخ نوبت را انتخاب کنید.'
      )

      return
    }

    if (!form.appointment_time) {

      setError(
        'لطفاً ساعت نوبت را انتخاب کنید.'
      )

      return
    }

    axios
      .post(
        'http://127.0.0.1:8000/api/appointments',
        form
      )
      .then((response) => {

        setMessage(
          'نوبت با موفقیت ثبت شد.'
        )

        if (
          onAppointmentCreated
        ) {

onAppointmentCreated(
            response.data.appointment
          )
        }

        setSelectedPatient(
          null
        )

        setPatientSearch('')

        setForm({

          patient_id:
            userRole === 'Patient'
              ? user?.patient?.id || ''
              : '',

          doctor_id: '',

          appointment_date: '',

          appointment_time: '',

          description: '',
        })

      })
      .catch((error) => {

        console.error(
          'Error creating appointment:',
          error
        )

if (
          error.response?.data?.message
        ) {

          setError(
            error.response.data.message
          )

        } else if (
          error.response?.data?.errors
        ) {

          setError(
            'اطلاعات وارد شده صحیح نیست.'
          )

        } else {

          setError(
            'ثبت نوبت با مشکل مواجه شد.'
          )

        }

      })

  }

  return (

    <div className="new-appointment-page">

<div className="new-appointment-header">

        <h1>
          ثبت نوبت جدید
        </h1>

        <p>
          اطلاعات نوبت بیمار را وارد کنید.
        </p>

      </div>

      {message && (

        <div className="success-message">
          {message}
        </div>

      )}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}

      <form
        onSubmit={handleSubmit}
        className="appointment-form"
      >

{userRole === 'Patient' ? (

          <div className="form-group">

            <label>
              بیمار
            </label>

            <input
              type="text"
              value={
                user?.name || ''
              }
              disabled
            />

          </div>

        ) : (

          <div className="form-group patient-select-group">

            <label>
              بیمار
            </label>

            <div className="patient-search-wrapper">

              <input
                type="text"
                placeholder="نام یا شماره تماس بیمار را وارد کنید..."
                value={patientSearch}
                onChange={
                  handlePatientSearch
                }
                autoComplete="off"
              />

{selectedPatient && (

                <button
                  type="button"
                  className="clear-patient-button"
                  onClick={
                    clearSelectedPatient
                  }
                  aria-label="پاک کردن بیمار انتخاب‌شده"
                >
                  ✕
                </button>

              )}

            </div>

            {!selectedPatient &&
              patientSearch.trim() !== '' && (

                <div className="patient-search-results">

                  {filteredPatients.length > 0 ? (

                    filteredPatients.map(
                      (patient) => (

                        <button
                          type="button"
                          className="patient-search-result"
                          key={patient.id}
                          onClick={() =>
                            selectPatient(
                              patient
                            )
                          }
                        >

<strong>
                            {patient.user?.name ||
                              'نامشخص'}
                          </strong>

                          <span>
                            {patient.phone ||
                              'شماره تماس ثبت نشده'}
                          </span>

                        </button>

                      )
                    )

                  ) : (

                    <div className="no-patient-result">
                      بیماری با این مشخصات پیدا نشد.
                    </div>

                  )}

                </div>

              )}

              {selectedPatient && (

                <div className="selected-patient-box">

                  <div>

                    <strong>
                      {selectedPatient.user?.name ||
                        'نامشخص'}
                    </strong>

                    <span>
                      📞{' '}
                      {selectedPatient.phone ||
                        'شماره تماس ثبت نشده'}
                    </span>

                  </div>

<span className="selected-patient-check">
                    ✓ انتخاب شد
                  </span>

                </div>

              )}

          </div>

        )}

        <div className="form-group">

          <label>
            پزشک
          </label>

          <select
            name="doctor_id"
            value={form.doctor_id}
            onChange={handleChange}
            required
          >

            <option value="">
              پزشک را انتخاب کنید
            </option>

            {doctors.map(
              (doctor) => (

                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  دکتر{' '}
                  {doctor.user?.name}
                  {' - '}
                  {doctor.department?.name}
                </option>

)
            )}

          </select>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>
              تاریخ نوبت
            </label>

            <input
              type="date"
              name="appointment_date"
              value={
                form.appointment_date
              }
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>
              ساعت نوبت
            </label>

            <input
              type="time"
              name="appointment_time"
              value={
                form.appointment_time
              }
              onChange={handleChange}
              required
            />

          </div>

</div>

        <div className="form-group">

          <label>
            توضیحات
          </label>

          <textarea
            name="description"
            value={
              form.description
            }
            onChange={handleChange}
            placeholder="توضیحات مربوط به نوبت..."
            rows="4"
          />

        </div>

        <button
          type="submit"
          className="submit-appointment"
        >
          ➕ ثبت نوبت
        </button>

      </form>

    </div>

  )
}

export default NewAppointment
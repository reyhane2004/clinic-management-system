import { useEffect, useState } from 'react'
import axios from 'axios'

function PublicAppointment() {

  const [doctors, setDoctors] = useState([])

  const [form, setForm] = useState({
    name: '',
    phone: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    description: '',
  })

  const [message, setMessage] = useState('')

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)



  useEffect(() => {

    axios
      .get(
        'http://127.0.0.1:8000/api/public/doctors'
      )
      .then((response) => {

        setDoctors(response.data)

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

  }, [])



  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })

  }



  const handleSubmit = (e) => {

    e.preventDefault()

    setMessage('')

    setError('')

    setLoading(true)


    axios
      .post(
        'http://127.0.0.1:8000/api/public/appointments',
        form
      )


      .then((response) => {

        setMessage(
          response.data.message ||
          'نوبت شما با موفقیت ثبت شد.'
        )

        setForm({
          name: '',
          phone: '',
          doctor_id: '',
          appointment_date: '',
          appointment_time: '',
          description: '',
        })

      })

      .catch((error) => {

        console.error(
          'Error creating public appointment:',
          error
        )


        if (error.response?.data?.message) {

          setError(
            error.response.data.message
          )

        } else if (
          error.response?.data?.errors
        ) {

          setError(
            'لطفاً اطلاعات وارد شده را بررسی کنید.'
          )

        } else {

          setError(
            'ثبت نوبت با مشکل مواجه شد.'
          )

        }

      })

      .finally(() => {

        setLoading(false)

      })

  }


  return (

    <div className="new-appointment-page">

      <div className="new-appointment-header">

        <h1>
          📅 دریافت نوبت
        </h1>

        <p>
          برای دریافت نوبت، اطلاعات خود را وارد کنید.
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


        <div className="form-group">

          <label>
            نام و نام خانوادگی
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="نام و نام خانوادگی خود را وارد کنید"
            required
          />

        </div>


        <div className="form-group">

          <label>
            شماره موبایل
          </label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="مثلاً 09123456789"
            required
          />

        </div>


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
              name="appointment_date"
              value={form.appointment_date}
              onChange={handleChange}
              min={
                new Date()
                  .toISOString()
                  .split('T')[0]
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
              name="appointment_time"
              value={form.appointment_time}
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
            value={form.description}
            onChange={handleChange}
            placeholder="در صورت نیاز توضیحات خود را وارد کنید..."
            rows="4"
          />

        </div>


        <button
          type="submit"
          className="submit-appointment"
          disabled={loading}
        >

          {loading
            ? 'در حال ثبت نوبت...'
            : '📅 ثبت نوبت'
          }

        </button>

      </form>

    </div>

  )

}

export default PublicAppointment
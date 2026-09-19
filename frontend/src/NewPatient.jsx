import { useState } from 'react'
import axios from 'axios'

function NewPatient({ onPatientCreated }) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    address: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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

axios
      .post(
        'http://127.0.0.1:8000/api/patients',
        form
      )
      .then((response) => {

        setMessage(
          'بیمار با موفقیت ثبت شد.'
        )

        setForm({
          name: '',
          email: '',
          password: '',
          date_of_birth: '',
          gender: '',
          phone: '',
          address: '',
        })

if (onPatientCreated) {
          onPatientCreated(response.data.patient)
        }

      })
      .catch((error) => {

        console.error(
          'Error creating patient:',
          error
        )

        if (error.response?.data?.errors) {

          setError(
            'اطلاعات وارد شده صحیح نیست. لطفاً موارد را بررسی کنید.'
          )

} else if (error.response?.data?.message) {

          setError(
            error.response.data.message
          )

        } else {

          setError(
            'ثبت بیمار با مشکل مواجه شد.'
          )

        }

      })

  }

  return (

    <div className="new-patient-page">

      <div className="new-patient-header">

        <h1>ثبت بیمار جدید</h1>

<p>
          اطلاعات بیمار جدید را وارد کنید.
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
        className="patient-form"
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
            placeholder="مثلاً علی رضایی"
            required
          />

        </div>

<div className="form-group">

          <label>
            ایمیل
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            required
          />

        </div>

        <div className="form-group">

          <label>
            رمز عبور
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="حداقل ۸ کاراکتر"
            required
          />

        </div>

<div className="form-row">

          <div className="form-group">

            <label>
              تاریخ تولد
            </label>

            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>
              جنسیت
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >

              <option value="">
                انتخاب کنید
              </option>

              <option value="Female">
                زن
              </option>

              <option value="Male">
                مرد
              </option>

            </select>

          </div>

        </div>

<div className="form-group">

          <label>
            شماره تماس
          </label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="09120000000"
          />

        </div>

        <div className="form-group">

          <label>
            آدرس
          </label>

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="آدرس بیمار..."
            rows="4"
          />

        </div>

<div className="patient-form-actions">

          <button
            type="submit"
            className="submit-patient"
          >
            ➕ ثبت بیمار
          </button>

          <button
            type="button"
            className="back-button"
            onClick={() => {
              if (onPatientCreated) {
                onPatientCreated()
              }
            }}
          >
            ↩️ بازگشت
          </button>

        </div>

      </form>

    </div>

  )
}

export default NewPatient
import { useState } from 'react'
import axios from 'axios'

function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    axios
      .post('http://127.0.0.1:8000/api/login', form)
      .then((response) => {
        if (onLogin) {
          onLogin(response.data.user)
        }
      })
      .catch((error) => {
        console.error('Login error:', error)

        if (error.response?.data?.message) {
          setError(error.response.data.message)
        } else {
          setError('ورود به سیستم با مشکل مواجه شد.')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">
          <div className="login-icon">
            🏥
          </div>

          <h1>ورود به سامانه</h1>

          <p>
            به سامانه مدیریت کلینیک خوش آمدید
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>ایمیل</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ایمیل خود را وارد کنید"
              required
            />
          </div>
          <div className="form-group">
            <label>رمز عبور</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="رمز عبور خود را وارد کنید"
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login
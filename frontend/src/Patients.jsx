import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import NewPatient from './NewPatient'

function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [showNewPatient, setShowNewPatient] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [editingPatient, setEditingPatient] = useState(null)

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    address: '',
  })

  const getPatients = () => {
    axios
      .get('http://127.0.0.1:8000/api/patients')
      .then((response) => {
        setPatients(response.data)
      })
      .catch((error) => {
        console.error('Error fetching patients:', error)
      })
  }

  useEffect(() => {
    getPatients()
  }, [])

  const handlePatientCreated = () => {
    setShowNewPatient(false)
    getPatients()
  }

  const filteredPatients = patients.filter((patient) =>
    patient.user?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  )

  const startEditing = (patient) => {
    setEditingPatient(patient)

    setEditForm({
      name: patient.user?.name || '',
      email: patient.user?.email || '',
      date_of_birth: patient.date_of_birth || '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      address: patient.address || '',
    })
  }

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    axios
      .put(
        `http://127.0.0.1:8000/api/patients/${editingPatient.id}`,
        editForm
      )
      .then((response) => {
        alert('بیمار با موفقیت ویرایش شد.')

        setEditingPatient(null)

        getPatients()
      })
      .catch((error) => {
        console.error('Error updating patient:', error)

        if (error.response?.data?.errors) {
          alert('لطفاً اطلاعات واردشده را بررسی کنید.')
        } else {
          alert('ویرایش بیمار با مشکل مواجه شد.')
        }
      })
  }

  const handleDelete = (patient) => {
    const patientName =
      patient.user?.name || 'این بیمار'

    const confirmed = window.confirm(
      `آیا از حذف ${patientName} مطمئن هستید؟`
    )

    if (!confirmed) {
      return
    }

    axios
      .delete(
        `http://127.0.0.1:8000/api/patients/${patient.id}`
      )
      .then(() => {
        alert('بیمار با موفقیت حذف شد.')

        setSelectedPatient(null)

        getPatients()
      })
      .catch((error) => {
        console.error('Error deleting patient:', error)

        alert('حذف بیمار با مشکل مواجه شد.')
      })
  }

  if (showNewPatient) {
    return (
      <NewPatient
        onPatientCreated={handlePatientCreated}
      />
    )
  }

  if (editingPatient) {
    return (
      <div className="patient-edit-page">

        <div className="patient-edit-header">
          <h1>ویرایش بیمار</h1>
          <p>اطلاعات بیمار را ویرایش کنید.</p>
        </div>

        <form
          onSubmit={handleUpdate}
          className="patient-form"
        >

<div className="form-group">
            <label>نام بیمار</label>

            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ایمیل</label>

            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>تاریخ تولد</label>

              <input
                type="date"
                name="date_of_birth"
                value={editForm.date_of_birth}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>جنسیت</label>

              <select
                name="gender"
                value={editForm.gender}
                onChange={handleEditChange}
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
            <label>شماره تماس</label>

            <input
              type="tel"
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
              placeholder="09120000000"
            />
          </div>

          <div className="form-group">
            <label>آدرس</label>

            <textarea
              name="address"
              value={editForm.address}
              onChange={handleEditChange}
              rows="4"
            />
          </div>

          <div className="patient-edit-actions">

            <button
              type="submit"
              className="submit-patient"
            >
              ذخیره تغییرات
            </button>

            <button
              type="button"
              className="back-button"
              onClick={() => setEditingPatient(null)}
            >
              انصراف
            </button>

          </div>

        </form>
      </div>
    )
  }

  if (selectedPatient) {
    return (
      <div className="patient-details-page">

        <button
          className="back-button"
          onClick={() => setSelectedPatient(null)}
        >
          ⬅️ بازگشت به لیست بیماران
        </button>

        <div className="patient-details-card">

          <div className="patient-details-avatar">
            {selectedPatient.user?.name?.charAt(0) || 'ب'}
          </div>

          <h1>
            {selectedPatient.user?.name || 'نامشخص'}
          </h1>

          <p>جزئیات کامل بیمار</p>

          <div className="patient-details-info">

            <div>
              <span>🆔 کد بیمار</span>
              <strong>{selectedPatient.id}</strong>
            </div>

            <div>
              <span>📧 ایمیل</span>
              <strong>
                {selectedPatient.user?.email || 'ثبت نشده'}
              </strong>
            </div>

            <div>
              <span>📞 شماره تماس</span>
              <strong>
                {selectedPatient.phone || 'ثبت نشده'}
              </strong>
            </div>

            <div>
              <span>🎂 تاریخ تولد</span>
              <strong>
                {selectedPatient.date_of_birth || 'ثبت نشده'}
              </strong>
            </div>

            <div>
              <span>جنسیت</span>
              <strong>
                {selectedPatient.gender === 'Female'
                  ? 'زن'
                  : selectedPatient.gender === 'Male'
                  ? 'مرد'
                  : 'ثبت نشده'}
              </strong>
            </div>

            <div>
              <span>📍 آدرس</span>
              <strong>
                {selectedPatient.address || 'ثبت نشده'}
              </strong>
            </div>

          </div>

          <div className="patient-details-actions">

            <button
              className="edit-patient-button"
              onClick={() => {
                startEditing(selectedPatient)
                setSelectedPatient(null)
              }}
            >
              ✏️ ویرایش بیمار
            </button>

            <button
              className="delete-patient-button"
              onClick={() => handleDelete(selectedPatient)}
            >
              🗑️ حذف بیمار
            </button>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="patients-page">

      <div className="patients-header">

        <div>
          <h1>بیماران</h1>
          <p>لیست بیماران کلینیک</p>
        </div>

        <div className="patient-search">
          <input
            type="text"
            placeholder="جست‌وجوی بیمار..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="patients-header-actions">

<div className="patient-count">
  تعداد بیماران: {patients.length}
</div>

<button
  className="add-patient-button"
  onClick={() => setShowNewPatient(true)}
>
  ➕ ثبت بیمار جدید
</button>

</div>

</div>

{patients.length === 0 ? (

<p>در حال دریافت اطلاعات بیماران...</p>

) : (

<div className="patients-grid">

{filteredPatients.map((patient) => (

  <div
    className="patient-card"
    key={patient.id}
  >

    <div className="patient-card-top">

      <div className="patient-avatar">
        {patient.user?.name?.charAt(0) || 'ب'}
      </div>

      <div>
        <h2>
          {patient.user?.name || 'نامشخص'}
        </h2>

        <span>
          {patient.gender === 'Female'
            ? 'زن'
            : patient.gender === 'Male'
            ? 'مرد'
            : 'ثبت نشده'}
        </span>
      </div>

    </div>

    <div className="patient-info">

      <div>
        <span>📞 شماره تماس</span>
        <strong>
          {patient.phone || 'ثبت نشده'}
        </strong>
      </div>

      <div>
        <span>📧 ایمیل</span>
        <strong>
          {patient.user?.email || 'ثبت نشده'}
        </strong>
      </div>

      <div>
        <span>🎂 تاریخ تولد</span>
        <strong>
          {patient.date_of_birth || 'ثبت نشده'}
        </strong>
      </div>

      <div>
        <span>📍 آدرس</span>
        <strong>
          {patient.address || 'ثبت نشده'}
        </strong>
      </div>

    </div>

    <div className="patient-card-actions">

      <button
        className="view-patient-button"
        onClick={() => setSelectedPatient(patient)}
      >
        👁️ مشاهده جزئیات
      </button>

      <button
        className="edit-patient-button"
        onClick={() => startEditing(patient)}
      >
        ✏️ ویرایش
      </button>

      <button
        className="delete-patient-button"
        onClick={() => handleDelete(patient)}
      >
        🗑️ حذف
      </button>

    </div>

  </div>

))}

</div>

)}

</div>
)
}

export default Patients
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function Doctors() {

  const savedUser =
    localStorage.getItem('clinicUser')

  const user =
    savedUser
      ? JSON.parse(savedUser)
      : null

  const userRole =
    user?.role?.name


  const [doctors, setDoctors] =
    useState([])

  const [departments, setDepartments] =
    useState([])

  const [search, setSearch] =
    useState('')


  const [showNewDoctor, setShowNewDoctor] =
    useState(false)

  const [editingDoctor, setEditingDoctor] =
    useState(null)


  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    department_id: '',
    medical_license_number: '',
    phone: '',
    consultation_fee: '',
    is_available: true,
    profile_image: null,
  })



  const getDoctors = () => {

    axios
      .get(
        'http://127.0.0.1:8000/api/doctors',
        {
          headers: {
            'X-User-Id': user?.id
          }
        }
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



  const getDepartments = () => {

    axios
      .get(
        'http://127.0.0.1:8000/api/departments'
      )
      .then((response) => {

        setDepartments(response.data)

      })
      .catch((error) => {

        console.error(
          'Error fetching departments:',
          error
        )

      })

  }



  useEffect(() => {

    getDoctors()

    getDepartments()

  }, [])

 

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target


    setForm({
      ...form,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    })

  }



  const resetForm = () => {

    setForm({

      name: '',

      email: '',

      password: '',

      department_id: '',

      medical_license_number: '',

      phone: '',

      consultation_fee: '',

      is_available: true,

      profile_image: null,

    })

  }



  const handleCreate = (e) => {

    e.preventDefault()


    const formData =
      new FormData()


    formData.append(
      'name',
      form.name
    )


    formData.append(
      'email',
      form.email
    )


    formData.append(
      'password',
      form.password
    )


    formData.append(
      'department_id',
      form.department_id
    )


    formData.append(
      'medical_license_number',
      form.medical_license_number
    )


    formData.append(
      'phone',
      form.phone
    )


    formData.append(
      'consultation_fee',
      form.consultation_fee
    )


    formData.append(
      'is_available',
      form.is_available
        ? '1'
        : '0'
    )


    if (form.profile_image) {

      formData.append(
        'profile_image',
        form.profile_image
      )

    }


    axios
      .post(
        'http://127.0.0.1:8000/api/doctors',
        formData
      )
      .then(() => {

        alert(
          'پزشک با موفقیت ثبت شد.'
        )


        setShowNewDoctor(false)

        setEditingDoctor(null)

        resetForm()

        getDoctors()

      })
      .catch((error) => {

        console.error(
          'Error creating doctor:',
          error
        )


        if (
          error.response?.data?.errors
        ) {

          alert(
            'لطفاً اطلاعات واردشده را بررسی کنید.'
          )

        } else {

          alert(
            error.response?.data?.message ||
            'ثبت پزشک با مشکل مواجه شد.'
          )

        }

      })

  }


  const startEditing = (doctor) => {

    setEditingDoctor(doctor)

    setShowNewDoctor(false)


    setForm({

      name:
        doctor.user?.name || '',

      email:
        doctor.user?.email || '',

      password: '',

      department_id:
        doctor.department_id || '',

      medical_license_number:
        doctor.medical_license_number || '',

      phone:
        doctor.phone || '',

      consultation_fee:
        doctor.consultation_fee || '',

      is_available:
        Boolean(
          doctor.is_available
        ),

      profile_image: null,

    })

  }



  const handleUpdate = (e) => {

    e.preventDefault()


    const formData =
      new FormData()


    formData.append(
      'name',
      form.name
    )


    formData.append(
      'email',
      form.email
    )


    formData.append(
      'department_id',
      form.department_id
    )


    formData.append(
      'medical_license_number',
      form.medical_license_number
    )


    formData.append(
      'phone',
      form.phone
    )


    formData.append(
      'consultation_fee',
      form.consultation_fee
    )


    formData.append(
      'is_available',
      form.is_available
        ? '1'
        : '0'
    )


    if (form.profile_image) {

      formData.append(
        'profile_image',
        form.profile_image
      )

    }


    formData.append(
      '_method',
      'PUT'
    )


    axios
      .post(
        `http://127.0.0.1:8000/api/doctors/${editingDoctor.id}`,
        formData
      )
      .then(() => {

        alert(
          'پزشک با موفقیت ویرایش شد.'
        )


        setEditingDoctor(null)

        setShowNewDoctor(false)

        resetForm()

        getDoctors()

      })
      .catch((error) => {

        console.error(
          'Error updating doctor:',
          error
        )


        if (
          error.response?.data?.errors
        ) {

          alert(
            'لطفاً اطلاعات واردشده را بررسی کنید.'
          )

        } else {

          alert(
            error.response?.data?.message ||
            'ویرایش پزشک با مشکل مواجه شد.'
          )

        }

      })

  }


  const handleDelete = (doctor) => {

    const doctorName =
      doctor.user?.name ||
      'این پزشک'


    const confirmed =
      window.confirm(
        `آیا از حذف ${doctorName} مطمئن هستید؟`
      )


    if (!confirmed) {

      return

    }


    axios
      .delete(
        `http://127.0.0.1:8000/api/doctors/${doctor.id}`
      )
      .then(() => {

        alert(
          'پزشک با موفقیت حذف شد.'
        )

        getDoctors()

      })
      .catch((error) => {

        console.error(
          'Error deleting doctor:',
          error
        )


        alert(
          error.response?.data?.message ||
          'حذف پزشک با مشکل مواجه شد.'
        )

      })

  }


  const filteredDoctors =
    doctors.filter((doctor) => {

      const doctorName =
        doctor.user?.name || ''


      return doctorName
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    })



  if (
    showNewDoctor ||
    editingDoctor
  ) {

    const isEditing =
      Boolean(editingDoctor)


    return (

      <div className="doctor-form-page">

        <div className="doctor-form-header">

          <h1>

            {
              isEditing
                ? 'ویرایش پزشک'
                : 'ثبت پزشک جدید'
            }

          </h1>


          <p>

            {
              isEditing
                ? 'اطلاعات پزشک را ویرایش کنید.'
                : 'اطلاعات پزشک جدید را وارد کنید.'
            }

          </p>

        </div>

        <form
          onSubmit={
            isEditing
              ? handleUpdate
              : handleCreate
          }

          className="doctor-form"
        >



          <div className="form-group">

            <label>
              نام پزشک
            </label>


            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

          </div>



          <div className="form-group">

            <label>
              عکس پزشک
            </label>


            {
              isEditing &&
              editingDoctor?.profile_image && (

                <div className="current-doctor-image">

                  <img
                    src={`http://127.0.0.1:8000/storage/${editingDoctor.profile_image}`}
                    alt={
                      editingDoctor.user?.name ||
                      'پزشک'
                    }
                  />


                  <span>
                    عکس فعلی
                  </span>

                </div>

              )
            }


            <input
              type="file"
              name="profile_image"
              accept="image/jpeg,image/png,image/webp"

              onChange={(e) => {

                setForm({

                  ...form,

                  profile_image:
                    e.target.files[0] ||
                    null,

                })

              }}

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
              required
            />

          </div>



          {!isEditing && (

            <div className="form-group">

              <label>
                رمز عبور
              </label>


              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength="6"
              />

            </div>

          )}


          <div className="form-row">


            <div className="form-group">

              <label>
                تخصص
              </label>


              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                required
              >

                <option value="">
                  تخصص را انتخاب کنید
                </option>


                {departments.map(
                  (department) => (

                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>

                  )
                )}

              </select>

            </div>


            <div className="form-group">

              <label>
                شماره نظام پزشکی
              </label>


              <input
                type="text"
                name="medical_license_number"
                value={
                  form.medical_license_number
                }
                onChange={handleChange}
                required
              />

            </div>

          </div>



          <div className="form-row">


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
                هزینه ویزیت
              </label>


              <input
                type="number"
                name="consultation_fee"
                value={
                  form.consultation_fee
                }
                onChange={handleChange}
                min="0"
                required
              />

            </div>

          </div>



<div className="doctor-availability">

<label>

  <input
    type="checkbox"
    name="is_available"
    checked={
      form.is_available
    }
    onChange={handleChange}
  />


  آماده پذیرش

</label>

</div>


          <div className="doctor-form-actions">


            <button
              type="submit"
              className="submit-doctor"
            >

              {
                isEditing
                  ? 'ذخیره تغییرات'
                  : 'ثبت پزشک'
              }

            </button>


            <button
              type="button"
              className="back-button"

              onClick={() => {

                setShowNewDoctor(false)

                setEditingDoctor(null)

                resetForm()

              }}
            >

              انصراف

            </button>


          </div>


        </form>

      </div>

    )

  }



  return (

    <div className="doctors-page">


      <div className="doctors-header">



        <div className="doctors-title">

          <h1>
            پزشکان
          </h1>

          <p>
            لیست پزشکان کلینیک
          </p>

        </div>



        <div className="doctor-search">

          <input
            type="text"
            placeholder="جست‌وجوی پزشک..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>



        <div className="doctor-header-actions">


          <div className="doctor-count">

            تعداد پزشکان: {doctors.length}

          </div>


{userRole !== 'Patient' && (

<button
  type="button"
  className="add-doctor-button"

  onClick={() => {

    setEditingDoctor(null)

    resetForm()

    setShowNewDoctor(true)

  }}
>

  ➕ ثبت پزشک جدید

</button>

)}

</div>


</div>


      {doctors.length === 0 ? (

        <p>
          در حال دریافت اطلاعات پزشکان...
        </p>

      ) : (

        <div className="doctors-grid">

          {filteredDoctors.map(
            (doctor) => (

              <div
                className="doctor-card"
                key={doctor.id}
              >



                <div className="doctor-card-top">


                  <div className="doctor-avatar-large">

                    {doctor.profile_image ? (

                      <img
                        src={`http://127.0.0.1:8000/storage/${doctor.profile_image}`}
                        alt={
                          doctor.user?.name ||
                          'پزشک'
                        }
                      />

                    ) : (

                      doctor.user?.name?.charAt(
                        0
                      ) || 'د'

                    )}

                  </div>


                  <div>

                    <h2>

                      دکتر{' '}

                      {
                        doctor.user?.name ||
                        'نامشخص'
                      }

                    </h2>


                    <span className="doctor-specialty">

                      {
                        doctor.department?.name ||
                        'تخصص ثبت نشده'
                      }

                    </span>

                  </div>


                </div>



                <div className="doctor-info">


                  <div>

                    <span>
                      📞 شماره تماس
                    </span>

                    <strong>

                      {
                        doctor.phone ||
                        'ثبت نشده'
                      }

                    </strong>

                  </div>


                  <div>

                    <span>
                      💰 هزینه ویزیت
                    </span>

                    <strong>

                      {
                        Number(
                          doctor.consultation_fee
                        ).toLocaleString()
                      }{' '}

                      تومان

                    </strong>

                  </div>


                  <div>

                    <span>
                      🪪 شماره نظام پزشکی
                    </span>

                    <strong>

                      {
                        doctor.medical_license_number ||
                        'ثبت نشده'
                      }

                    </strong>

                  </div>


                </div>



<div className="doctor-status">

{doctor.is_available ? (

  <span className="available">

    ● آماده پذیرش

  </span>

) : (

  <span className="unavailable">

    ● فعلاً در دسترس نیست

  </span>

)}

</div>

{(
  userRole === 'Admin' ||
  userRole === 'Receptionist' ||
  (
    userRole === 'Doctor' &&
    doctor.user_id === user?.id
  )
) && (

  <div className="doctor-card-actions">

    <button
      type="button"
      className="edit-doctor-button"
      onClick={() =>
        startEditing(doctor)
      }
    >
      ✏️ ویرایش
    </button>

    {(userRole === 'Admin' ||
      userRole === 'Receptionist') && (

      <button
        type="button"
        className="delete-doctor-button"
        onClick={() =>
          handleDelete(doctor)
        }
      >
        🗑️ حذف
      </button>

    )}

  </div>

)}

</div>

)
)}

</div>

)}


</div>

)

}


export default Doctors
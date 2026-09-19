# سامانه مدیریت کلینیک پزشکی

این پروژه یک سامانه تحت وب برای مدیریت کلینیک پزشکی است که با استفاده از React، Laravel و MySQL طراحی و پیاده‌سازی شده است.

هدف پروژه، ایجاد یک سیستم یکپارچه برای مدیریت پزشکان، بیماران، نوبت‌ها، کاربران و اطلاعات کلینیک است.

## تکنولوژی‌های استفاده‌شده

- React.js
- Laravel
- PHP
- MySQL
- REST API
- Vite
- Git
- GitHub

## امکانات پروژه

- Authentication
- Authorization و مدیریت سطح دسترسی
- مدیریت پزشکان
- مدیریت بیماران
- مدیریت نوبت‌ها
- ثبت نوبت
- ثبت نوبت عمومی
- جستجو و فیلتر اطلاعات
- Dashboard
- Reports
- Calendar
- File Upload
- Responsive Design
- REST API
- طراحی و مدیریت پایگاه داده

## نقش‌های کاربری

### Admin

مدیر سیستم امکان مدیریت بخش‌های مختلف سامانه را دارد، از جمله:

- مدیریت پزشکان
- مدیریت بیماران
- مدیریت نوبت‌ها
- مشاهده اطلاعات و گزارش‌ها

### Receptionist

کاربر پذیرش امکان مدیریت اطلاعات بیماران، پزشکان و نوبت‌ها را دارد.

### Doctor

پزشک می‌تواند اطلاعات مربوط به خود و نوبت‌های مرتبط با خود را مشاهده و مدیریت کند.

### Patient

بیمار می‌تواند نوبت‌های مربوط به خود را مشاهده کرده و نوبت خود را لغو کند.

## Authentication

سیستم دارای صفحه ورود کاربران است.

پس از ورود، اطلاعات کاربر و نقش او مشخص شده و دسترسی به بخش‌های مختلف سامانه بر اساس نقش کاربر کنترل می‌شود.

## Authorization

سطح دسترسی کاربران در Backend و Frontend کنترل شده است.

دسترسی کاربران به عملیات مختلف مانند ایجاد، ویرایش، حذف و مشاهده اطلاعات بر اساس نقش کاربری محدود می‌شود.

## مدیریت پزشکان

امکانات این بخش:

- ثبت پزشک
- مشاهده لیست پزشکان
- ویرایش پزشک
- حذف پزشک
- انتخاب بخش یا تخصص
- ثبت شماره نظام پزشکی
- ثبت شماره تماس
- تعیین هزینه ویزیت
- تعیین وضعیت فعالیت پزشک
- آپلود تصویر پروفایل پزشک
- نمایش تصویر پزشک

## مدیریت بیماران

امکانات این بخش:

- ثبت بیمار جدید
- مشاهده بیماران
- ویرایش اطلاعات بیمار
- حذف بیمار
- جستجوی بیمار
- ثبت تاریخ تولد
- ثبت جنسیت
- ثبت شماره تماس
- ثبت آدرس

## مدیریت نوبت‌ها

سیستم امکان ثبت و مدیریت نوبت‌های کلینیک را فراهم می‌کند.

اطلاعات نوبت شامل:

- بیمار
- پزشک
- تاریخ
- ساعت
- توضیحات
- وضعیت نوبت

وضعیت‌های نوبت:

- Pending
- Confirmed
- Completed
- Cancelled

## ثبت نوبت عمومی

سامانه دارای بخش ثبت نوبت عمومی است.

کاربر می‌تواند پزشک موردنظر خود را انتخاب کرده و درخواست نوبت ثبت کند.

درخواست ثبت نوبت از طریق REST API به Backend ارسال شده و در پایگاه داده ذخیره می‌شود.

## Dashboard

داشبورد برای نمایش اطلاعات کلی و آماری سیستم طراحی شده است.

از طریق داشبورد می‌توان به بخش‌های مختلف سامانه دسترسی داشت و وضعیت کلی اطلاعات کلینیک را مشاهده کرد.

## Search

سیستم دارای قابلیت جستجو و فیلتر اطلاعات است.

امکان جستجو در بخش‌هایی مانند بیماران، پزشکان و نوبت‌ها فراهم شده است.

## Reports

بخش گزارش‌ها برای نمایش اطلاعات آماری سیستم طراحی شده است.

برخی از اطلاعات قابل بررسی شامل:

- تعداد نوبت‌ها
- وضعیت نوبت‌ها
- نوبت‌های تکمیل‌شده
- نوبت‌های لغوشده
- اطلاعات پزشکان
- اطلاعات بیماران

## Calendar

بخش Calendar برای نمایش نوبت‌ها بر اساس تاریخ طراحی شده است.

کاربر می‌تواند نوبت‌های ثبت‌شده را در قالب تقویم مشاهده و بررسی کند.

## File Upload

در بخش پزشکان امکان آپلود تصویر پروفایل وجود دارد.

فرمت‌های مجاز:

- JPG
- JPEG
- PNG
- WEBP

فایل‌های آپلودشده توسط Laravel در Storage مدیریت می‌شوند.

## Responsive Design

رابط کاربری پروژه به صورت Responsive طراحی شده است تا در اندازه‌های مختلف صفحه نمایش قابل استفاده باشد.

صفحات پروژه برای:

- Desktop
- Laptop
- Tablet
- Mobile

طراحی شده‌اند.

## REST API

ارتباط بین Frontend و Backend از طریق REST API انجام می‌شود.

### Authentication

POST /api/login

### Doctors

GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/{id}
DELETE /api/doctors/{id}

### Patients

GET    /api/patients
POST   /api/patients
PUT    /api/patients/{id}
DELETE /api/patients/{id}

### Appointments

GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/{id}
PUT    /api/appointments/{id}/status
DELETE /api/appointments/{id}

### Public Appointment

GET  /api/public/doctors
POST /api/public/appointments

## ساختار پروژه

Clinic Management System
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   └── Middleware/
│   └── Models/
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── clinic_management.sql
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── App.jsx
│       ├── Appointments.jsx
│       ├── Calendar.jsx
│       ├── Doctors.jsx
│       ├── Login.jsx
│       ├── NewAppointment.jsx
│       ├── NewPatient.jsx
│       ├── Patients.jsx
│       ├── PublicAppointment.jsx
│       └── Reports.jsx
│
├── routes/
│   └── api.php
│
├── public/
├── resources/
├── composer.json
├── package.json
└── vite.config.js

## پایگاه داده

پایگاه داده پروژه با MySQL طراحی شده است.

جداول اصلی شامل:

- users
- roles
- departments
- doctors
- patients
- appointments

فایل خروجی پایگاه داده نیز در مسیر زیر قرار دارد:

database/clinic_management.sql

## نصب و راه‌اندازی Backend

پس از Clone کردن Repository، وارد پوشه پروژه شوید:

cd clinic-management-system

سپس وابستگی‌های Laravel را نصب کنید:

composer install

فایل تنظیمات محیطی را ایجاد کنید:

cp .env.example .env

در Windows می‌توانید از دستور زیر استفاده کنید:

copy .env.example .env

سپس کلید Laravel را ایجاد کنید:

php artisan key:generate

## تنظیم MySQL

در فایل .env اطلاعات اتصال به MySQL را تنظیم کنید.

نمونه:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=clinic_management
DB_USERNAME=root
DB_PASSWORD=

سپس فایل زیر را در MySQL یا phpMyAdmin Import کنید:

database/clinic_management.sql

## اجرای Backend

برای اجرای Laravel:

php artisan serve

Backend به صورت پیش‌فرض در آدرس زیر اجرا می‌شود:

http://127.0.0.1:8000

برای فعال‌سازی Storage نیز می‌توان از دستور زیر استفاده کرد:

php artisan storage:link

## نصب و اجرای Frontend

وارد پوشه Frontend شوید:

cd frontend

وابستگی‌های React را نصب کنید:

npm install

سپس پروژه را اجرا کنید:

npm run dev

Frontend توسط Vite اجرا می‌شود و آدرس آن در Terminal نمایش داده خواهد شد.

## GitHub Repository

Repository پروژه در GitHub:

https://github.com/reyhane2004/clinic-management-system

## اطلاعات پروژه

عنوان پروژه: سامانه مدیریت کلینیک پزشکی

Frontend: React.js

Backend: Laravel

Database: MySQL

Architecture: REST API

Version Control: Git / GitHub

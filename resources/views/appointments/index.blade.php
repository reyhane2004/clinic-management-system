<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>نوبت های پزشکی </title>
</head>

<body>
    <h1>نوبت های پزشکی </h1>
    @foreach($appointments as $appointment)
        <div>
            <h3>نوبت شماره {{ $appointment->id }}</h3>
            <P>تاریخ: {{ $appointment->appointment_date }}</p>
            <P>ساعت: {{ $appointment->appointment_time }}</p>
            <p>بیمار: {{ $appointment->patient->user->name }}</p>
            <p>پزشک: {{ $appointment->doctor->user->name }}</p>
            <p>تخصص: {{ $appointment->doctor->department->name }}</p>
            <p>وضعیت: @if($appointment->status === 'pending')
                 در انتظار تأیید
                       @elseif($appointment->status === 'confirmed')
                 تایید شده
                       @elseif($appointment->status === 'completed')
                 تکمیل شده
                       @elseif($appointment->status === 'cancelled')
                 لغو شده 
                       @endif
            </p>
        </div>
        <hr>
        @endforeach                    
</body>
</html>    
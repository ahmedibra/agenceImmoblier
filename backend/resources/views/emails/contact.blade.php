<!DOCTYPE html>
<html>
<head>
    <title>Nouveau message de contact</title>
</head>
<body>
    <h2>Message de {{ $data['fullname'] }}</h2>
    <p><strong>Email :</strong> {{ $data['email'] }}</p>
    <p><strong>télephone :</strong> {{ $data['phone'] }}</p>
    <p><strong>Sujet :</strong> {{ $data['subject'] }}</p>
    <p><strong>Message :</strong></p>
    <p>{{ $data['message'] }}</p>

</body>
</html>

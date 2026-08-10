<!DOCTYPE html>
<html>
<head>
    <title>Nouvelle propriété ajoutée</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .property-details { margin: 20px 0; }
        .property-details th { text-align: left; padding: 5px; background: #f8f9fa; }
        .property-details td { padding: 5px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 20px; }
        .btn { display: inline-block; background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🏠 Nouvelle propriété ajoutée</h2>
        </div>
        <div class="content">
            <p>Bonjour Administrateur,</p>
            <p>Un nouveau bien vient d'être ajouté sur la plateforme par <strong>{{ $user->name }}</strong> ({{ $user->email }}) | ({{ $user->phone }}).</p>

            <div class="property-details">
                <table width="100%">
                    <tr>
                        <th width="30%">code :</th>
                        <td>{{ $property->id }}</td>
                    </tr>
                    <tr>
                        <th width="30%">Titre :</th>
                        <td>{{ $property->title }}</td>
                    </tr>
                    <tr>
                        <th>Description :</th>
                        <td>{{ Str::limit($property->description, 100) }}</td>
                    </tr>
                    <tr>
                        <th>Localisation :</th>
                        <td>{{ $property->location }}</td>
                    </tr>
                    <tr>
                        <th>Prix / nuit :</th>
                        <td>{{ $property->price_per_night }} DH</td>
                    </tr>
                    <tr>
                        <th>Chambres :</th>
                        <td>{{ $property->bedrooms }}</td>
                    </tr>
                    <tr>
                        <th>Salles de bain :</th>
                        <td>{{ $property->bathrooms }}</td>
                    </tr>
                    <tr>
                        <th>Capacité max :</th>
                        <td>{{ $property->max_guests }} personnes</td>
                    </tr>
                    <tr>
                        <th>Statut :</th>
                        <td>{{ $property->status }}</td>
                    </tr>
                </table>
            </div>

            <p style="margin-top: 20px;">
                <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/admin/properties" class="btn">Voir dans l'administration</a>
            </p>
            <p>Connectez-vous pour modérer cette annonce.</p>
        </div>
        <div class="footer">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            <p>&copy; {{ date('Y') }} Homeland. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>

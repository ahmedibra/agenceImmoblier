<?php
// app/Mail/NewPropertyNotification.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewPropertyNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $property;
    public $user;

    public function __construct($property, $user)
    {
        $this->property = $property;
        $this->user = $user;
    }

    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
                    ->subject('Nouvelle propriété ajoutée - ' . $this->property->title)
                    ->view('emails.new-property')
                    ->with([
                        'property' => $this->property,
                        'user' => $this->user,
                    ]);
    }
}

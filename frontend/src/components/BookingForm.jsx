import React, { useState } from 'react';
import { bookings } from '../services/api';

function BookingForm({ propertyId, pricePerNight }) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    const calculateTotal = () => {
        if (checkIn && checkOut) {
            const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
            setTotalPrice(nights * pricePerNight);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await bookings.create({
                property_id: propertyId,
                check_in: checkIn,
                check_out: checkOut,
                total_price: totalPrice
            });
            alert('Réservation confirmée !');
        } catch (error) {
            alert('Erreur lors de la réservation');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Réserver</h3>
            
            <div className="mb-4">
                <label className="block mb-2">Date d'arrivée</label>
                <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2">Date de départ</label>
                <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    onBlur={calculateTotal}
                    required
                />
            </div>

            {totalPrice > 0 && (
                <div className="mb-4 text-lg font-bold">
                    Total : {totalPrice} DH
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Réserver maintenant
            </button>
        </form>
    );
}

export default BookingForm;
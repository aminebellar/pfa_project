import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const Paiement = () => {
  const location = useLocation();
  const { flight, seats, passengers, totalPrice } = location.state || {};

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [success, setSuccess] = useState(false);

  if (!flight || !seats || !passengers || !totalPrice) {
    return (
      <div className="text-center mt-20 text-lg text-red-600">
        Les informations de réservation sont incomplètes.
      </div>
    );
  }

  const handlePayment = (e) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      alert("Veuillez remplir tous les champs de paiement.");
      return;
    }
    setSuccess(true);
  };

  const handleDownloadReceipt = async () => {
  try {
    for (let i = 0; i < passengers.length; i++) {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [450, 280]
      });

      const passenger = passengers[i];
      const seat = seats[i];

      const qrData = `Vol ${flight.id}|${flight.airline_name}|${passenger.firstName} ${passenger.lastName}|${flight.departure_city}>${flight.arrival_city}|Siège ${seat}`;
      const qrImage = await QRCode.toDataURL(qrData, { margin: 0, width: 100 });

      // En-tête
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255);
      doc.setFillColor(10, 50, 100);
      doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");
      doc.text("CARTE D'EMBARQUEMENT", 20, 25);
      doc.text(flight.airline_name.toUpperCase(), doc.internal.pageSize.width - 20, 25, {
        align: "right"
      });

      // Corps
      const startY = 60;
      const middleX = 180;

      doc.setFontSize(12);
      doc.setTextColor(80);
      doc.setFont("Helvetica", "normal");
      doc.text("NOM DU PASSAGER", 20, startY);
      doc.setFont("Helvetica", "bold");
      doc.text(`${passenger.firstName} ${passenger.lastName}`.toUpperCase(), 20, startY + 15);

      doc.setFont("Helvetica", "normal");
      doc.text("DEPART", 20, startY + 40);
      doc.setFont("Helvetica", "bold");
      doc.text(flight.departure_city.toUpperCase(), 20, startY + 55);

      doc.setFont("Helvetica", "normal");
      doc.text("DESTINATION", 20, startY + 80);
      doc.setFont("Helvetica", "bold");
      doc.text(flight.arrival_city.toUpperCase(), 20, startY + 95);

      doc.setFont("Helvetica", "normal");
      doc.text("DATE", middleX, startY);
      doc.setFont("Helvetica", "bold");
      doc.text(new Date(flight.departure_time).toLocaleDateString(), middleX, startY + 15);

      doc.setFont("Helvetica", "normal");
      doc.text("VOL", middleX, startY + 40);
      doc.setFont("Helvetica", "bold");
      doc.text(flight.id.toString().toUpperCase(), middleX, startY + 55);

      doc.setFont("Helvetica", "normal");
      doc.text("SIÈGE", middleX, startY + 80);
      doc.setFont("Helvetica", "bold");
      doc.text(seat, middleX, startY + 95);

      doc.addImage(qrImage, "PNG", 330, startY - 10, 100, 100);

      // Barre du bas
      doc.setFillColor(200, 200, 200);
      doc.rect(0, 220, doc.internal.pageSize.width, 60, "F");
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.text(`Heure d'embarquement: ${new Date(flight.departure_time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`, 20, 240);
      doc.text(`Porte: ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 30)}`, 20, 255);

      // Bas de ticket
      doc.setLineWidth(0.5);
      doc.setDrawColor(150);
      doc.setLineDash([5, 5], 0);
      doc.line(20, 200, doc.internal.pageSize.width - 20, 200);

      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text("NUMÉRO DE TICKET: " + flight.id.toString() + "-" + Math.random().toString(36).substr(2, 6).toUpperCase(), 330, 240);

      // Générer un fichier par passager
      doc.save(`ticket-${passenger.firstName}-${passenger.lastName}-${seat}.pdf`);
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement des tickets :", error);
    alert("Une erreur est survenue pendant la génération des tickets.");
  }
};


  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        💳 Paiement sécurisé
      </h2>

      {success ? (
        <div className="text-center">
          <p className="text-xl font-semibold text-green-600 mb-4">
            ✅ Paiement effectué avec succès !
          </p>
          <button
            onClick={handleDownloadReceipt}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Télécharger le ticket
          </button>
          <br />
          <Link
            to="/home"
            className="text-blue-600 underline hover:text-blue-800 mt-4 inline-block"
          >
            Retour à l’accueil
          </Link>
        </div>
      ) : (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Nom sur la carte</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="NOM COMPLET"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Numéro de carte</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(
                  e.target.value
                    .replace(/\D/g, "")
                    .replace(/(\d{4})(?=\d)/g, "$1 ")
                )
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-600 mb-1">Date d'expiration</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length > 2) {
                    value = value.slice(0, 2) + "/" + value.slice(2);
                  }
                  setExpiryDate(value.slice(0, 5));
                }}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/AA"
                maxLength={5}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-600 mb-1">CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-green-600 text-black px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              Payer {totalPrice} €
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Paiement;
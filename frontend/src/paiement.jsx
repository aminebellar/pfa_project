import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import jsPDF from "jspdf";

const Paiement = () => {
  const location = useLocation();
  const { flight, seats, passengers, totalPrice } = location.state || {};

  // Vérification des données
  if (!flight || !seats || !passengers || !totalPrice) {
    return (
      <div className="text-center mt-20 text-lg text-red-600">
        Les informations de réservation sont incomplètes.
      </div>
    );
  }

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      alert("Veuillez remplir tous les champs de paiement.");
      return;
    }
    setSuccess(true);
  };

  const handleDownloadReceipt = () => {
    if (!flight || !seats || !totalPrice || !passengers) {
      alert("Les informations de réservation sont incomplètes.");
      return;
    }

    const doc = new jsPDF();

    // Fond du ticket - forme rectangulaire
    doc.setFillColor(255, 255, 255); // Couleur de fond du ticket (blanc)
    doc.rect(10, 10, 190, 280, "F");

    // Titre du ticket
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("BILLET D'AVION", 105, 30, null, null, 'center');

    // Informations de vol
    doc.setFontSize(14);
    doc.text(`Compagnie : ${flight.airline_name}`, 20, 60);
    doc.text(`Numéro de vol : ${flight.id}`, 20, 70);
    doc.text(`Classe : ${flight.class}`, 20, 80);

    // Informations sur le vol
    doc.text(`Départ : ${flight.departure_city}`, 20, 100);
    doc.text(`Arrivée : ${flight.arrival_city}`, 20, 110);
    doc.text(`Date de départ : ${new Date(flight.departure_time).toLocaleString()}`, 20, 120);
    doc.text(`Date d'arrivée : ${new Date(flight.arrival_time).toLocaleString()}`, 20, 130);

    // Détails du passager
    doc.text("Passager", 20, 150);
    doc.text(`Nom : ${passengers[0].firstName} ${passengers[0].lastName}`, 20, 160);
    doc.text(`Siège : ${seats[0]}`, 20, 170);

    // Informations sur le paiement
    doc.text(`Total payé : ${totalPrice} €`, 20, 190);
    doc.text(`Mode de paiement : Carte bancaire`, 20, 200);
    doc.text(`Date du paiement : ${new Date().toLocaleString()}`, 20, 210);

    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 230, 200, 230);

    // Message de confirmation de paiement
    doc.setFontSize(12);
    doc.text("✅ Paiement effectué avec succès !", 105, 240, null, null, 'center');

    // Sauvegarder le PDF
    doc.save("ticket_avion.pdf");
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">💳 Paiement sécurisé</h2>

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
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Numéro de carte</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 "))} 
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
                onChange={(e) => setExpiryDate(e.target.value)}
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

import { useEffect, useState } from "react";

function Prescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPrescriptions = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first.");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/prescriptions",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setPrescriptions(data.prescriptions);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                console.error("Prescription error:", error);
                setError("Unable to connect to server.");
            }
        };

        fetchPrescriptions();
    }, []);

    const viewPrescription = async (prescriptionId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `http://localhost:5000/api/prescriptions/${prescriptionId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSelectedPrescription(data);
                setError("");
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error("Prescription details error:", error);
            setError("Unable to connect to server.");
        }
    };

    return (
        <div>
            <h2>My Prescriptions</h2>

            {error && <p>{error}</p>}

            {prescriptions.length === 0 && !error && (
                <p>No prescriptions found.</p>
            )}

            {prescriptions.map((prescription) => (
                <div key={prescription._id}>
                    <button
                        onClick={() => viewPrescription(prescription._id)}
                    >
                        {new Date(
                            prescription.prescriptionDate
                        ).toLocaleDateString()}
                    </button>

                    <p>
                        Doctor:{" "}
                        {prescription.doctorName || "Not provided"}
                    </p>

                    {prescription.notes && (
                        <p>
                            Notes: {prescription.notes}
                        </p>
                    )}

                    <hr />
                </div>
            ))}

            {selectedPrescription && (
                <div>
                    <h2>
                        Prescription Details
                    </h2>

                    <p>
                        Date:{" "}
                        {new Date(
                            selectedPrescription.prescription.prescriptionDate
                        ).toLocaleDateString()}
                    </p>

                    <p>
                        Doctor:{" "}
                        {selectedPrescription.prescription.doctorName ||
                            "Not provided"}
                    </p>

                    <h3>Medicines</h3>

                    {selectedPrescription.medicines.length === 0 ? (
                        <p>No medicines added yet.</p>
                    ) : (
                        selectedPrescription.medicines.map((item) => (
                            <div key={item._id}>
                                <h4>
                                    {item.medicineId.name}
                                </h4>

                                <p>
                                    Common uses:{" "}
                                    {item.medicineId.commonUses}
                                </p>

                                <p>
                                    Dosage: {item.dosage}
                                </p>

                                <p>
                                    Frequency: {item.frequency}
                                </p>

                                <p>
                                    Duration:{" "}
                                    {item.duration || "Not provided"}
                                </p>

                                <p>
                                    Quantity: {item.quantity}
                                </p>

                                {item.instructions && (
                                    <p>
                                        Instructions:{" "}
                                        {item.instructions}
                                    </p>
                                )}

                                <hr />
                            </div>
                        ))
                    )}

                    <button
                        onClick={() => setSelectedPrescription(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default Prescriptions;
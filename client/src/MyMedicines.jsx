import { useEffect, useState } from "react";

function MyMedicines() {
    const [medicines, setMedicines] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyMedicines = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login first.");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/my-medicines",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setMedicines(data.medicines);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                console.error("My medicines error:", error);
                setError("Unable to connect to server.");
            }
        };

        fetchMyMedicines();
    }, []);

    return (
        <div>
            <h2>My Medicines</h2>

            {error && <p>{error}</p>}

            {medicines.length === 0 && !error && (
                <p>No medicines found.</p>
            )}

            {medicines.map((item) => (
                <div key={item._id}>
                    <h3>{item.medicineId.name}</h3>

                    <p>
                        <strong>Common Uses:</strong>{" "}
                        {item.medicineId.commonUses}
                    </p>

                    <p>
                        <strong>Quantity:</strong>{" "}
                        {item.quantity}
                    </p>

                    <p>
                        <strong>Expiry Date:</strong>{" "}
                        {item.expiryDate
                            ? new Date(
                                  item.expiryDate
                              ).toLocaleDateString()
                            : "Not provided"}
                    </p>

                    <p>
                        <strong>Source:</strong>{" "}
                        {item.source}
                    </p>

                    {item.notes && (
                        <p>
                            <strong>Notes:</strong>{" "}
                            {item.notes}
                        </p>
                    )}

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default MyMedicines;

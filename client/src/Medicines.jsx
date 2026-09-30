import { useState } from "react";

function Medicines() {
    const [search, setSearch] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (event) => {
        event.preventDefault();

        if (!search.trim()) {
            setMedicines([]);
            setSelectedMedicine(null);
            setSearched(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/medicines/search?name=${encodeURIComponent(search)}`
            );

            const data = await response.json();

            if (response.ok) {
                setMedicines(data.medicines);
                setSelectedMedicine(null);
                setSearched(true);
                setError("");
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error("Medicine search error:", error);
            setError("Unable to connect to server.");
        }
    };

    return (
        <div>
            <h2>Medicine Search</h2>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search medicine..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <button type="submit">
                    Search
                </button>
            </form>

            {error && <p>{error}</p>}

            {searched && medicines.length === 0 && !error && (
                <p>No medicines found.</p>
            )}

            {medicines.map((medicine) => (
                <div key={medicine._id}>
                    <h3>{medicine.name}</h3>

                    <p>
                        {medicine.commonUses}
                    </p>

                    <button
                        onClick={() => setSelectedMedicine(medicine)}
                    >
                        View Details
                    </button>
                </div>
            ))}

            {selectedMedicine && (
                <div>
                    <h2>{selectedMedicine.name}</h2>

                    <p>
                        <strong>Common Uses:</strong>{" "}
                        {selectedMedicine.commonUses}
                    </p>

                    <p>
                        <strong>Description:</strong>{" "}
                        {selectedMedicine.description}
                    </p>

                    <button
                        onClick={() => setSelectedMedicine(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}

export default Medicines;
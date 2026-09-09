import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("No login token found.");
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/profile",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setUser(data.user);
                } else {
                    setError(data.message);
                }
            } catch (error) {
                console.error("Profile error:", error);
                setError("Unable to connect to server.");
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (error) {
        return (
            <div>
                <h2>{error}</h2>
                <button onClick={() => navigate("/login")}>
                    Go to Login
                </button>
            </div>
        );
    }

    if (!user) {
        return <h2>Loading profile...</h2>;
    }

    return (
        <div>
            <h2>My Profile</h2>

            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Profile;
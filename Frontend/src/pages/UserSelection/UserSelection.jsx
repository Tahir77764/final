import { useNavigate } from "react-router-dom";
import "./UserSelection.css";

const UserSelection = () => {
    const navigate = useNavigate();

    const handleSelection = (role) => {
        const token = localStorage.getItem("token");

        if (token) {
            // User is logged in -> Direct navigation
            if (role === "donor") {
                navigate("/donorform");
            } else if (role === "recipient") {
                navigate("/recipient");
            }
        } else {
            // User is NOT logged in -> Go to Login/Register flow
            navigate("/login", { state: { role: role } });
        }
    };

    return (
        <div className="selection-page">
            <h1 className="title">Join the Mission</h1>
            <p className="subtitle">Are you here to save a life, or find a lifesaver?</p>

            <div className="card-container">
                {/* Donor Card */}
                <div onClick={() => handleSelection("donor")} className="card donor-card" style={{ cursor: "pointer" }}>
                    <div className="icon">🩸</div>
                    <h2>Become a Donor</h2>
                    <p>Register to be a potential match and save someone's life.</p>
                    <button className="card-btn">Register as Donor</button>
                </div>

                {/* Recipient Card */}
                <div onClick={() => handleSelection("recipient")} className="card recipient-card" style={{ cursor: "pointer" }}>
                    <div className="icon">🏥</div>
                    <h2>Looking for a Match</h2>
                    <p>Find a compatible stem cell donor for yourself or a loved one.</p>
                    <button className="card-btn">Register as Recipient</button>
                </div>
            </div>
        </div>
    );
};

export default UserSelection;

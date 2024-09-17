import { useState } from 'react';

const UserProfileForm = ({ profile, session }) => {
    const [formData, setFormData] = useState(profile || {
        firstName: '',
        lastName: '',
        gender: '',
        DOB: '',
        height: '',
        weight: '',
        phoneNumber: '',
        profilePicture: '',
        uid: session?.user?.uid || '', // Ensure UID is pre-filled
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/profile/update-user-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: { uid: session.user.uid }, // Pass the UID
                    profileData: formData,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully');
            } else {
                console.error('Error updating profile:', data.error);
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Gender</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div>
                <label>Date of Birth</label>
                <input
                    type="date"
                    name="DOB"
                    value={formData.DOB ? new Date(formData.DOB).toISOString().substr(0, 10) : ''}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Height (in cm)</label>
                <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Weight (in kg)</label>
                <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Phone Number</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label>Profile Picture</label>
                <input
                    type="file"
                    name="profilePicture"
                    onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files[0] })}
                />
            </div>

            <button type="submit">Update Profile</button>
        </form>
    );
};
// Styles 
const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '300px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        color: '#000',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid lightgrey',
        width: '100%',
        backgroundColor: '#fff',
        color: '#000',
    },
    button: {
        padding: '10px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
};

export default UserProfileForm;
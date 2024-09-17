import { useState } from 'react';

const UserProfileForm = ({ profile, onSubmit, session }) => {
    const [formData, setFormData] = useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
        picture: profile.profilePicture || '',
        DOB: profile.DOB || '',  // Initialize DOB as empty if it's null
        gender: profile.gender || '',
        height: profile.height || '',  // Set to empty string if null
        weight: profile.weight || '',  // Set to empty string if null
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        // e.preventDefault();

        const data = new FormData();
        data.append('uid', session.user.uid);  // Use uid instead of email
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('phoneNumber', formData.phoneNumber);
        data.append('DOB', formData.DOB);
        data.append('gender', formData.gender);
        data.append('height', formData.height);
        data.append('weight', formData.weight);

        if (formData.picture) {
            data.append('picture', formData.picture);
        }

        // Call parent onSubmit function
        handleSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Input fields */}
            <label>
                First Name:
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                />
            </label>

            <label>
                Last Name:
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                />
            </label>

            <label>
                Phone Number:
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                />
            </label>

            <label>
                Date of Birth (MM/DD/YYYY):
                <input
                    type="text"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleInputChange}
                />
            </label>

            <label>
                Gender:
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </label>

            <label>
                Height (inches):
                <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                />
            </label>

            <label>
                Weight (lbs):
                <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                />
            </label>

            <label>
                Profile Picture:
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, picture: e.target.files[0] })}
                />
            </label>

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
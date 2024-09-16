import { useState } from 'react';

const UserProfileForm = ({ profile, onSubmit }) => {
    // Set form fields with initial profile data
    const [formData, setFormData] = useState({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
        picture: profile.profilePicture || '',  // Will hold the file object for profile picture
        DOB: profile.DOB ? new Date(profile.DOB) : '',  // Ensure DOB is a valid Date object
        gender: profile.gender || '',  // Gender field will be a select dropdown
        height: profile.height || '',
        weight: profile.weight || '',
    });

    // Handle input changes in the form
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle file input for profile picture
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            picture: e.target.files[0],  // Set the file object as the picture
        });
    };

    // Handle form submission and call the update function
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);  // Pass the file and form data to the submit handler
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            {/* Input fields */}
            <label>
                First Name:
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </label>

            <label>
                Last Name:
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </label>

            <label>
                Phone Number:
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </label>

            <label>
                Date of Birth:
                <input
                    type="date"
                    name="DOB"
                    value={formData.DOB ? formData.DOB.toISOString().substr(0, 10) : ''}  // Check if DOB is valid
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </label>

            {/* Gender select dropdown */}
            <label>
                Gender:
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={styles.input}
                >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </label>

            <label>
                Height (in):
                <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </label>

            <label>
                Weight (lbs):
                <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </label>

            {/* File input for profile picture */}
            <label>
                Profile Picture:
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.input}
                />
            </label>

            <button type="submit" style={styles.button}>Update Profile</button>
        </form>
    );
};

// Styles (without theme-based styling)
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

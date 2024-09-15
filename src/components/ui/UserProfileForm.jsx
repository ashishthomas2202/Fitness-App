import { useState } from 'react';

const UserProfileForm = ({ profile, onSubmit }) => {
    const [formData, setFormData] = useState(profile);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>First Name:</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />

            <label>Last Name:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />

            <label>Date of Birth:</label>
            <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} />

            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>

            <label>Height:</label>
            <input type="number" name="height" value={formData.height} onChange={handleChange} />

            <label>Weight:</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} />

            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

            <button type="submit">Update Profile</button>
        </form>
    );
};

export default UserProfileForm;

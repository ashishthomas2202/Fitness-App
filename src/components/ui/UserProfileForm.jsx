import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig"; // Import Firestore and Storage

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

    const [imagePreview, setImagePreview] = useState('/default-user-icon.png');
    const [profilePictureFile, setProfilePictureFile] = useState(null);

    useEffect(() => {
        if (formData.profilePicture && typeof formData.profilePicture === 'string') {
            setImagePreview(formData.profilePicture); // Display the current profile picture URL
        }
    }, [formData.profilePicture]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImagePreview(imageURL); // Preview the image before upload
            setProfilePictureFile(file); // Store the file for upload later
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!session || !session.user || !session.user.uid) {
            alert('You must be logged in to update your profile.');
            return;
        }

        let profilePictureURL = formData.profilePicture;

        if (profilePictureFile) {
            try {
                const storageRef = ref(storage, `profilePictures/${session.user.uid}/${profilePictureFile.name}`);
                const snapshot = await uploadBytes(storageRef, profilePictureFile);
                profilePictureURL = await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                return;
            }
        }

        const updatedProfileData = {
            ...formData,
            profilePicture: profilePictureURL,
            uid: session.user.uid // Ensure UID is included
        };

        try {
            const response = await fetch('/api/profile/update-user-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: { uid: session.user.uid }, // Send the user's UID for profile lookup
                    profileData: updatedProfileData,
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
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.imageContainer}>
                <img
                    src={imagePreview}
                    alt="Profile Picture"
                    style={styles.profileImage}
                />
            </div>

            {/* Other form fields */}
            <div>
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </div>

            <div>
                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </div>

            <div>
                <label>Gender</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={styles.input}
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
                    style={styles.input}
                />
            </div>

            <div>
                <label>Height (in cm)</label>
                <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </div>

            <div>
                <label>Weight (in kg)</label>
                <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </div>

            <div>
                <label>Phone Number</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    style={styles.input}
                />
            </div>

            <div>
                <label>Profile Picture</label>
                <input
                    type="file"
                    name="profilePicture"
                    onChange={handleFileChange}
                    style={styles.input}
                />
            </div>

            <button type="submit" style={styles.button}>Update Profile</button>
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
    imageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '150px',
        height: '150px',
        margin: '0 auto',
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        overflow: 'hidden',
        marginBottom: '20px',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
};

export default UserProfileForm;

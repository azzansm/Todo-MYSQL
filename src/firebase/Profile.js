import React, { useState, useEffect } from 'react';
import { updateUserProfile } from './AuthService';
import { auth, upload } from './FirebaseConfig';
import styles from '../styles/modules/profile.module.scss';
import defaultProfilePicture from '../app/profile.jpg'; // Import the default profile picture

const EditProfile = ({ onClose }) => {
  const [displayName, setDisplayName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    setCurrentUser(auth.currentUser);
    setDisplayName(auth.currentUser.displayName || '');
    setProfilePictureUrl(auth.currentUser.photoURL || defaultProfilePicture); // Set default profile picture if null
  }, []);

  const handlePhotoChange = (event) => {
    if (event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    if (photo) {
      await upload(photo, currentUser, (url) => setProfilePictureUrl(url));
    }
    if (displayName) {
      await updateUserProfile(currentUser, {
        displayName,
        photoURL: profilePictureUrl,
      });
    }
    onClose();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <form onSubmit={handleProfileUpdate} className={styles.form}>
          <h3 className={styles.formTitle}>Edit Profile</h3>
          <div className={styles.profilePictureContainer}>
            <img
              src={profilePictureUrl}
              alt="Profile"
              className={styles.profilePicture}
            />
          </div>
          <label htmlFor="displayName" className={styles.inputTitle}>
            Name
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={styles.input}
            />
          </label>
          <label htmlFor="email" className={styles.inputTitle}>
            Email
            <input
              type="email"
              id="email"
              value={currentUser ? currentUser.email : ''}
              disabled
              className={styles.input}
            />
          </label>
          <label htmlFor="profilePicture" className={styles.inputTitle}>
            Image
            <input
              type="file"
              id="profilePicture"
              onChange={handlePhotoChange}
              className={styles.input}
            />
          </label>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.primaryButton}>
              Save Changes
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

import React, { Component } from 'react';
import axios from 'axios';

import { SERVER_HOST } from '../config/global_constants';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
    };
  }

  componentDidMount() {
    // Retrieve userInfo from localStorage
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      // Parse userInfo back to an object
      const userInfo = JSON.parse(userInfoString);
      // Get the email from userInfo
      const email = userInfo.email;

      // Make Axios request to fetch user details using the retrieved email
      axios
        .get(`${SERVER_HOST}/users/${email}`)
        .then((res) => {
          if (res.data && !res.data.errorMessage) {
            // Set user details in state
            this.setState({ userDetails: res.data });
          } else {
            console.error(
              'Error fetching user details:',
              res.data.errorMessage
            );
          }
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
    } else {
      console.error('User info not found in localStorage');
    }
  }

  render() {
    const { userDetails } = this.state;
    console.log(userDetails);

    return (
      <div style={styles.container}>
        <h1>User Profile</h1>
        {userDetails ? (
          <div style={styles.profileContainer}>
            <div style={styles.imageContainer}>
              <img
                src={`data:image/jpeg:;base64,${userDetails.profilePhoto}`}
                alt="Profile"
                style={styles.profileImage}
                onError={(e) => console.error('Error loading image:', e)}
              />
            </div>
            <div style={styles.userInfo}>
              <p>
                <strong>Name:</strong> {userDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Access Level:</strong> {userDetails.accessLevel}
              </p>
              <p>
                <strong>Account Creation Date:</strong>{' '}
                {userDetails.accountCreationDate}
              </p>
              <p>
                <strong>Date of Birth:</strong> {userDetails.dateOfBirth}
              </p>
              <p>
                <strong>Gender:</strong> {userDetails.gender}
              </p>
              <p>
                <strong>Phone Number:</strong> {userDetails.phoneNumber}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  imageContainer: {
    width: '200px',
    height: '200px',
    overflow: 'hidden',
    borderRadius: '50%',
    border: '2px solid #ccc',
  },
  profileImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userInfo: {
    marginTop: '20px',
  },
};

export default UserProfile;

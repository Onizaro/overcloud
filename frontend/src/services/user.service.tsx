import axios from 'axios';

const API_URL = 'http://15.237.220.104:3000/api/users'; 

interface RegisterData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

interface LoginData {
  email: string;
  password: string;
  deviceId: string;
}

interface VerifyCodeData {
  email: string;
  code: number;
  deviceId: string;
}

interface PreferenceData {
  email: string;
  twoFactorFrequency: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUser = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`,);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    throw error;
  }
};

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await axios.post(`${API_URL}/createUser`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’inscription :', error);
    throw error;
  }
};

export const loginUser = async (data: LoginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    throw error;
  }
};

export const verifyCode = async (data: VerifyCodeData) => {
  try {
    const response = await fetch(`${API_URL}/verifyCode`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData;
  } catch (error) {
    console.error('Erreur lors de la vérification du code :', error);
    throw error;
  }
};

export const updatePreference = async (data: PreferenceData) => {
  try {
      const response = await fetch(`${API_URL}/updateFrequency`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(data),
    });
      return response.json();
  } catch (error) {
      console.log(localStorage.getItem('token'))
      console.error('Erreur lors de la mise à jour de la préférence :', error);
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};


export const logoutUser = async (session: { token: string, email: string }) => {
  try {
    const response = await axios.post(
      `${API_URL}/logout`,
      { email: session.email }, 
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders() ,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
    throw error;
  }
};
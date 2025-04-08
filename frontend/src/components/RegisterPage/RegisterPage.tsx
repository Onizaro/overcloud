import React, { useState, ChangeEvent, FormEvent } from 'react';
import { registerUser, verifyCode, updatePreference } from '../../services/user.service';
import { createUserSession } from '../../services/session.service';
import '../../formStyles.css';
import { useAuth } from '../../authContext';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import './RegisterPage.css'

const RegisterPage: React.FC = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        twoFactorFrequency: 'always',
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [twoFactorPreference, setTwoFactorPreference] = useState('');

    const getDeviceId = async (): Promise<string> => {
        const storedDeviceId = localStorage.getItem('deviceId');
        if (storedDeviceId) {
            return storedDeviceId; 
        }
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const newDeviceId = result.visitorId;
        localStorage.setItem('deviceId', newDeviceId);
        return newDeviceId;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            setMessage(response.message);

            if (response.user && response.token) {
                createUserSession({ id: response.user.id, email: response.user.name, token: response.token });
            }
            setTwoFactorPreference(response.twoFactorFrequency);
            setShowVerification(true);
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Erreur lors de la création du compte');
        }
    };

    const handleVerifyCode = async (e: FormEvent) => {
            e.preventDefault();
            try {                
                const deviceId = await getDeviceId();
                const response = await verifyCode({ email: formData.email, code: Number(verificationCode), deviceId: deviceId });
        
              if (response) {
                setMessage('Connexion réussie !');
                createUserSession({ id: response.userId, email: response.email || '', token: response.token });
                login(response.token, response.email || formData.email);
                updatePreference({email: formData.email, twoFactorFrequency: twoFactorPreference});
                setShowVerification(false);
                window.location.href = '/';
              } else {
                setMessage('Code de vérification incorrect.');
              }
            } catch (error) {
              setMessage('Erreur lors de la vérification.');
            }
          };
    

    return (
        <div>
            <div className="background-images">
                <img src="/images/family.png" alt="Background 1" className="background-img" />
                <img src="/images/birthday.png" alt="Background 2" className="background-img" />
                <img src="/images/journaling.png" alt="Background 3" className="background-img" />
                <img src="/images/baby.png" alt="Background 4" className="background-img" />
            </div>
            <div>
                <h1 className='white'>WELCOME TO YOUR OVERCLOUD</h1>
            </div>
        <div className="container">
            {!showVerification ? (
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstname"
                    placeholder="Prénom"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastname"
                    placeholder="Nom"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Adresse e-mail"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button className="turquoise-button" type="submit">Register</button>
            </form>
            ) : (
                <form onSubmit={handleVerifyCode}>
                    <p className="verification-info">
                        Un code de vérification a été envoyé à votre adresse e-mail.
                    </p>
                    <input
                        type="text"
                        placeholder="Code de vérification"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                    <label htmlFor="twoFactorPreference">Préférence de double authentification :</label>
                    <select
                        id="twoFactorPreference"
                        aria-placeholder='select frequency'
                        onChange={(e) => setTwoFactorPreference(e.target.value)}
                    >
                        <option value="always">Always</option>
                        <option value="monthly">Monthly</option>
                        <option value="new device">New Device</option>
                    </select>
                    <button type="submit">Vérifier</button>
                </form>
            )}
            {message && <p className="message">{message}</p>}
        </div>
        </div>
    );
};

export default RegisterPage;

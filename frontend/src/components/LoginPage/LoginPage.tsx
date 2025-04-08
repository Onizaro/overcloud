import React, { useState, ChangeEvent, FormEvent } from 'react';
import { createUserSession, getUserSession } from '../../services/session.service';
import { loginUser, verifyCode, getUser, updatePreference } from '../../services/user.service';
import { useAuth } from '../../authContext';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [twoFactorPreference, setTwoFactorPreference] = useState<string>('');

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


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const deviceId = await getDeviceId();
            const response = await loginUser({...formData, deviceId});
            if (response.twoFactorRequired) {
                setMessage(response.message || 'Code de vérification envoyé.');
                setTwoFactorPreference(response.twoFactorFrequency);
                setShowVerification(true);
            } else {
                setMessage(response.message || 'Connexion réussie.');
                createUserSession({ id: response.userId, email: response.email || '', token: response.token });
                login(response.token, response.email || formData.email);
                window.location.href = '/'; 
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Erreur lors de la connexion.');
        }
    };

    const handleVerifyCode = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const deviceId = await getDeviceId();
            const response = await verifyCode({ email: formData.email, code: Number(verificationCode), deviceId: deviceId });
    
          if (response.token) {
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
                <h1 className="white">WELCOME TO YOUR OVERCLOUD</h1>
            </div>
        <div className="container">
            {!showVerification ? (
                <form onSubmit={handleLogin}>
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
                    <button className="turquoise-button" type="submit">Log in</button>
                </form>
            ) : (
                <form onSubmit={handleVerifyCode}>
                    <p className="verification-info">
                        Un code de vérification a été envoyé à votre adresse e-mail. (Vérifiez vos spams !)
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
                        value={twoFactorPreference}
                        onChange={(e) => setTwoFactorPreference(e.target.value)}
                    >
                        <option value="monthly">Monthly</option>
                        <option value="always">Always</option>
                        <option value="newDevice">New Device</option>
                    </select>
                    <button type="submit">Vérifier</button>
                </form>
            )}
            {message && <p className="message">{message}</p>}
        </div>
        </div>
    );
};

export default LoginPage;

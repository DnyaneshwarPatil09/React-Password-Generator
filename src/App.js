import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { NUMBERS, UPPERCASE_LETTERS, LOWERCASE_LETTERS, SPECIAL_CHARACTERS } from './Character';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast.error('Please select at least one character type.');
      return;
    }

    let validChars = '';
    if (includeUppercase) validChars += UPPERCASE_LETTERS;
    if (includeLowercase) validChars += LOWERCASE_LETTERS;
    if (includeNumbers) validChars += NUMBERS;
    if (includeSymbols) validChars += SPECIAL_CHARACTERS;

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      generatedPassword += validChars.charAt(randomIndex);
    }

    setPassword(generatedPassword);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    if (!password) {
      toast.error('Nothing to copy!');
      return;
    }
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Password copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getPasswordStrength = () => {
    if (!password) return { label: 'None', score: 0, color: '#64748b' };
    let score = 0;
    if (length >= 8) score += 20;
    if (length >= 12) score += 20;
    if (length >= 16) score += 10;
    if (includeUppercase) score += 15;
    if (includeLowercase) score += 10;
    if (includeNumbers) score += 10;
    if (includeSymbols) score += 15;

    if (score < 40) return { label: 'Weak', score, color: '#ef4444' };
    if (score < 70) return { label: 'Medium', score, color: '#f59e0b' };
    if (score < 90) return { label: 'Strong', score, color: '#10b981' };
    return { label: 'Very Strong', score, color: '#06b6d4' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="app-container">
      <div className="card">
        <header className="card-header">
          <div className="badge">Security Tool</div>
          <h1>Password Generator</h1>
          <p>Generate strong, customizable, and secure passwords instantly.</p>
        </header>

        <div className="password-display">
          <input
            type="text"
            readOnly
            value={password}
            placeholder="Click generate to create password"
            aria-label="Generated Password"
          />
          <button
            type="button"
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={copyToClipboard}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <i className="fas fa-check"></i>
                <span>Copied</span>
              </>
            ) : (
              <>
                <i className="far fa-copy"></i>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="strength-meter">
          <div className="strength-header">
            <span>Strength</span>
            <span className="strength-label" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
          <div className="strength-bar-bg">
            <div
              className="strength-bar-fill"
              style={{
                width: `${strength.score}%`,
                backgroundColor: strength.color
              }}
            />
          </div>
        </div>

        <div className="controls">
          <div className="control-group">
            <div className="label-row">
              <label htmlFor="length-slider">Password Length</label>
              <span className="length-value">{length}</span>
            </div>
            <input
              id="length-slider"
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="options-grid">
            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="option-text">
                <span className="option-title">Uppercase</span>
                <span className="option-subtitle">A-Z</span>
              </div>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="option-text">
                <span className="option-title">Lowercase</span>
                <span className="option-subtitle">a-z</span>
              </div>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="option-text">
                <span className="option-title">Numbers</span>
                <span className="option-subtitle">0-9</span>
              </div>
            </label>

            <label className="checkbox-card">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              <span className="checkmark"></span>
              <div className="option-text">
                <span className="option-title">Symbols</span>
                <span className="option-subtitle">!@#$%^&*</span>
              </div>
            </label>
          </div>
        </div>

        <button type="button" className="generate-btn" onClick={generatePassword}>
          <i className="fas fa-arrows-rotate"></i> Generate Password
        </button>

        <ToastContainer position="bottom-center" autoClose={3000} theme="dark" hideProgressBar />
      </div>
    </div>
  );
}

export default App;

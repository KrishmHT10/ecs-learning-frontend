import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/submissions`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_BASE_URL}/api/submissions`, formData);
      setMessage('Form submitted successfully!');
      setFormData({ name: '', email: '', message: '' });
      fetchSubmissions();
    } catch (error) {
      setMessage('Error submitting form. Please try again.');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AWS ECS Learning Application</h1>
        <p>Simple form to test ECS deployment with ALB, Target Groups, and networking</p>
      </header>

      <main className="App-main">
        <div className="form-container">
          <h2>Submit Your Information</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit'}
            </button>

            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="submissions-container">
          <h2>Recent Submissions</h2>
          <div className="submissions-list">
            {submissions.length === 0 ? (
              <p>No submissions yet.</p>
            ) : (
              submissions.map((submission, index) => (
                <div key={index} className="submission-item">
                  <h3>{submission.name}</h3>
                  <p><strong>Email:</strong> {submission.email}</p>
                  <p><strong>Message:</strong> {submission.message}</p>
                  <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

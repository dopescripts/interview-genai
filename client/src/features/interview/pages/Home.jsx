import React, { useState } from 'react'
import "../styles/home.scss";

function Home() {
    const [resumeFile, setResumeFile] = useState(null);

    const handleResumeUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setResumeFile(file);
        }
    };

    const clearResume = () => {
        setResumeFile(null);
        document.getElementById('resume').value = '';
    };

    return (
        <main className='home'>
            <div className="form-container">
                <section className="panel left-panel">
                    <div className="panel-header">
                        <label htmlFor="jobDescription">Job Description</label>
                    </div>
                    <textarea
                        className='job-description'
                        name="jobDescription"
                        id="jobDescription"
                        placeholder='Paste job description here...'
                    ></textarea>
                </section>

                <section className="panel right-panel">
                    <div className="input-group resume-group">
                        <div className="group-header">
                            <p>Resume</p>
                            <small>(Use resume and self description to generate better interview report)</small>
                        </div>
                        {!resumeFile ? (
                            <>
                                <label htmlFor="resume" className='file-label'>Upload Resume</label>
                                <input 
                                    name='resume' 
                                    hidden 
                                    type='file' 
                                    id='resume' 
                                    accept='.pdf'
                                    onChange={handleResumeUpload}
                                />
                            </>
                        ) : (
                            <div className="file-preview">
                                <div className="file-info">
                                    <span className="file-icon">📄</span>
                                    <span className="file-name">{resumeFile.name}</span>
                                </div>
                                <button 
                                    type="button" 
                                    className="clear-btn"
                                    onClick={clearResume}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label htmlFor="selfDescription">Self Description</label>
                        <textarea
                            name="selfDescription"
                            id="selfDescription"
                            placeholder='Tell us about yourself...'
                        ></textarea>
                    </div>

                    <button type='submit' className='btn primary-btn'>Generate Interview Report</button>
                </section>
            </div>
        </main>
    )
}

export default Home
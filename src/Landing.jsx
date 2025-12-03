import React, { useState, useEffect } from "react";
import { Download, Upload, Edit3, ArrowRight } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import { useNavigate } from "react-router-dom";
const Landing = ({
  onFileUpload
}) => {
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {}, []);
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    setCookie('theme', newTheme, 365);
  };
  const frameworks = [{
    name: "Astro",
    color: "#FF5D01",
    logo: "🚀"
  }, {
    name: "Next.js",
    color: "#000000",
    logo: "▲"
  }, {
    name: "Hugo",
    color: "#FF4088",
    logo: "H"
  }, {
    name: "Jekyll",
    color: "#CC0000",
    logo: "♦"
  }, {
    name: "Eleventy",
    color: "#000000",
    logo: "11ty"
  }, {
    name: "Gatsby",
    color: "#663399",
    logo: "G"
  }, {
    name: "Hexo",
    color: "#0E83CD",
    logo: "H"
  }, {
    name: "VuePress",
    color: "#4FC08D",
    logo: "V"
  }];
  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".md")) {
      onFileUpload(droppedFile);
    } else {
      alert("Please upload a .md file");
    }
  };
  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  return <div className="landing">
    <div className="theme-toggle"><ThemeToggle size={22} /></div>

    <div className="landing-content">
      <div className="hero-section">
        <h1 className="hero-title">
          Simple CMS
        </h1>
        <p className="hero-subtitle">
          The simplest way to edit markdown files with YAML & TOML frontmatter.
          <br />
          No Sign-up - No Installation - 100% Free.
        </p>
      </div>

      <div className="landing-columns">
        <div className="left-column">
          <div className="workflow-section">
            <div className="workflow-steps">
              <div className="workflow-step">
                <div className="step-icon step-icon-1">
                  <Upload size={24} />
                </div>
                <h3 className="step-title">1. Upload</h3>
                <p className="step-description">
                  Drag & drop or select your .md file
                </p>
              </div>
              <ArrowRight className="workflow-arrow" size={20} />
              <div className="workflow-step">
                <div className="step-icon step-icon-2">
                  <Edit3 size={24} />
                </div>
                <h3 className="step-title">2. Edit</h3>
                <p className="step-description">
                  Modify frontmatter & content easily
                </p>
              </div>
              <ArrowRight className="workflow-arrow" size={20} />
              <div className="workflow-step">
                <div className="step-icon step-icon-3">
                  <Download size={24} />
                </div>
                <h3 className="step-title">3. Download</h3>
                <p className="step-description">
                  Get your updated markdown file
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`upload-zone ${isDragging ? "upload-zone-dragging" : ""}`}>

            <div className="upload-zone-content">
              <Upload className="upload-zone-icon" size={56} />

              <p className="upload-zone-text">Drag & drop your .md file here</p>

              {}
              <div className="upload-zone-divider">
                <span>or</span>
              </div>

              {}
              <div className="upload-buttons-row">
                <label className="upload-button">
                  <input type="file" accept=".md,.markdown" onChange={e => e.target.files?.[0] && onFileUpload(e.target.files[0])} style={{
                    display: "none"
                  }} />
                  Browse Files
                </label>

                <span className="upload-buttons-or"></span>

                <button type="button" className="upload-button fresh-button" onClick={() => {
                  const emptyFile = new File([""], "new-post.md", {
                    type: "text/markdown"
                  });
                  onFileUpload(emptyFile);
                }}>
                  Start Fresh
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Privacy First</h3>
          <p className="feature-description">
            All processing happens in your browser. Your files never leave
            your device.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Smart Parsing</h3>
          <p className="feature-description">
            Automatically detects field types and provides the right input
            controls.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💾</div>
          <h3 className="feature-title">Auto-Save</h3>
          <p className="feature-description">
            Your work is automatically saved locally. Never lose your
            progress.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3 className="feature-title">Rich Text Editor</h3>
          <p className="feature-description">
            Notion-style editor with smooth content editing and formatting.
          </p>
        </div>
      </div>
      <div className="frameworks-section">
        <div className="frameworks-grid">
          {frameworks.map(fw => <div key={fw.name} className="framework-badge" title={fw.name}>
            <span className="framework-logo" style={{
              color: fw.color
            }}>
              {fw.logo}
            </span>
            <span className="framework-name">{fw.name}</span>
          </div>)}
        </div>
      </div>
      <div className="footer">
        <p>
          Made with <span className="heart">🧡</span> by{" "}
          <a href="https://hsinghhira.me" target="_blank" rel="noopener noreferrer">
            Harman Singh Hira
          </a>{" "}
          in{" "}
          <a href="https://en.wikipedia.org/wiki/Aotearoa" target="_blank" rel="noopener noreferrer">
            Aotearoa
          </a>
        </p>
        <p className="footer-bottom">Open Source • No data collection • Works offline</p>
      </div>
    </div>
  </div>;
};
export default Landing;
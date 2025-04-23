import React, { useState } from 'react'
import './App.css'
import WaveBackground from './components/WaveBackground'
import AudioSelector from './components/AudioSelector'

function App() {
  const [showSelector, setShowSelector] = useState(false);

  const handleStart = () => {
    setShowSelector(true);
  };

  return (
    <div className="app">
      <WaveBackground />
      {!showSelector ? (
        <main className="main-content">
          <h1>SoundWave</h1>
          <p className="subtitle">特效的音乐转化为震撼视觉体验，让听觉不仅能听到，还能看到您的音乐</p>
          <div className="buttons">
            <button className="cta-button" onClick={handleStart}>免费开始创作</button>
            <button className="demo-button">观看演示</button>
          </div>
        </main>
      ) : (
        <AudioSelector />
      )}
    </div>
  )
}

export default App 
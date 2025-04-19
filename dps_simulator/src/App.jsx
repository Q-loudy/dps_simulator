import { useState } from 'react'

const initialSkills = [
  { id: 1, name: "Skill 1", cooldown: 3000 },
  { id: 2, name: "Skill 2", cooldown: 4000 },
  { id: 3, name: "Skill 3", cooldown: 5000 },
  { id: 4, name: "Skill 4", cooldown: 6000 },
]

export default function DpsSimulator() {
  const [cooldowns, setCooldowns] = useState({})
  const [log, setLog] = useState([])
  const [globalCooldown, setGlobalCooldown] = useState(1000)
  const [lastGlobalTime, setLastGlobalTime] = useState(0)

  const handleSkillUse = (skill) => {
    const now = Date.now()
    if ((cooldowns[skill.id] && now < cooldowns[skill.id]) || now - lastGlobalTime < globalCooldown) {
      return
    }
    setCooldowns((prev) => ({
      ...prev,
      [skill.id]: now + skill.cooldown,
    }))
    setLastGlobalTime(now)
    setLog((prev) => [\`\${skill.name} used at \${new Date().toLocaleTimeString()}\`, ...prev])
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1>DPS Simulator</h1>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {initialSkills.map((skill) => {
          const remaining = cooldowns[skill.id] ? cooldowns[skill.id] - Date.now() : 0
          return (
            <button
              key={skill.id}
              onClick={() => handleSkillUse(skill)}
              disabled={remaining > 0 || Date.now() - lastGlobalTime < globalCooldown}
              style={{ borderRadius: '12px' }}
            >
              {skill.name}
              <br />
              {remaining > 0 ? \`\${(remaining / 1000).toFixed(1)}s\` : 'Ready'}
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <label>Global Cooldown (ms):</label>
        <input
          type="number"
          value={globalCooldown}
          onChange={(e) => setGlobalCooldown(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: '2rem', maxHeight: 200, overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
        {log.map((entry, i) => (
          <div key={i}>{entry}</div>
        ))}
      </div>
    </div>
  )
}

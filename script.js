let globalCooldown = 1; // Default global cooldown (in seconds)
let lastUsed = {};

// Function to update global cooldown
document.getElementById('globalCooldown').addEventListener('input', (event) => {
    globalCooldown = parseFloat(event.target.value);
});

// Function to handle skill button clicks
const handleSkillClick = (skillId, damage) => {
    const now = Date.now();

    // Check if the skill is off cooldown
    if (!lastUsed[skillId] || now - lastUsed[skillId] >= globalCooldown * 1000) {
        // Log damage
        const logEntry = document.createElement('li');
        logEntry.textContent = `Used ${skillId} for ${damage} damage`;
        document.getElementById('damageLog').appendChild(logEntry);

        // Disable the button and re-enable after cooldown
        const button = document.getElementById(skillId);
        button.disabled = true;

        lastUsed[skillId] = now;
        setTimeout(() => {
            button.disabled = false;
        }, globalCooldown * 1000);
    } else {
        alert(`${skillId} is on cooldown!`);
    }
};

// Add event listeners to skill buttons
document.getElementById('skill1').addEventListener('click', () => handleSkillClick('Skill 1', 100));
document.getElementById('skill2').addEventListener('click', () => handleSkillClick('Skill 2', 200));
document.getElementById('skill3').addEventListener('click', () => handleSkillClick('Skill 3', 300));
document.getElementById('skill4').addEventListener('click', () => handleSkillClick('Skill 4', 400));

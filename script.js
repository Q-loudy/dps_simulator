let globalCooldown = 1; // Default global cooldown (in seconds)
let lastUsed = {}; // To track the last time each skill was used
let totalDamage = 0; // Running total for damage dealt

// Function to update global cooldown
document.getElementById('globalCooldown').addEventListener('input', (event) => {
    globalCooldown = parseFloat(event.target.value);
});

// Function to handle skill button clicks
const handleSkillClick = (skillId, damage) => {
    const now = Date.now();

    // Check if the skill is off cooldown
    if (!lastUsed[skillId] || now - lastUsed[skillId] >= globalCooldown * 1000) {
        // Log the damage and update the total
        totalDamage += damage;

        const logEntry = document.createElement('li');
        logEntry.textContent = `Used ${skillId} for ${damage} damage`;
        document.getElementById('damageLog').appendChild(logEntry);

        // Update the Total DPS
        document.getElementById('totalDps').textContent = totalDamage;

        // Disable the button and start the cooldown animation
        const button = document.getElementById(skillId);
        const cooldownProgress = document.createElement('div');
        cooldownProgress.classList.add('cooldown-progress');
        button.appendChild(cooldownProgress);

        button.disabled = true;
        lastUsed[skillId] = now;

        // Animation to show cooldown progress
        cooldownProgress.style.transform = `scaleX(1)`; // Start the scale animation
        setTimeout(() => {
            button.disabled = false;
            button.removeChild(cooldownProgress); // Remove the progress bar after cooldown
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

document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const GLOBAL_COOLDOWN = 1.5; // 1.5 second GCD
    
    // DOM Elements
    const abilities = document.querySelectorAll('.ability');
    const totalDamageDisplay = document.getElementById('total-damage');
    const damageLog = document.getElementById('damage-log');
    const gcdStatus = document.getElementById('gcd-status');
    const timerDisplay = document.getElementById('timer-display');
    const dpsDisplay = document.getElementById('dps-value');
    const startStopBtn = document.getElementById('start-stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // State variables
    let totalDamage = 0;
    let isGCDActive = false;
    let isTimerRunning = false;
    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval = null;
    
    // Map of hotkey to ability element
    const hotkeyMap = {};
    
    // Initialize hotkey mapping
    abilities.forEach(ability => {
        const hotkey = ability.dataset.hotkey;
        if (hotkey) {
            hotkeyMap[hotkey] = ability;
        }
        
        ability.addEventListener('click', () => {
            activateAbility(ability);
        });
    });
    
    // Timer control functions
    function startTimer() {
        if (isTimerRunning) return;
        
        isTimerRunning = true;
        startTime = Date.now() - elapsedTime;
        
        timerInterval = setInterval(updateTimer, 100);
        startStopBtn.style.backgroundColor = '#e44d4d';
    }
    
    function stopTimer() {
        if (!isTimerRunning) return;
        
        isTimerRunning = false;
        clearInterval(timerInterval);
        startStopBtn.style.backgroundColor = '#4a90e2';
    }
    
    function updateTimer() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        
        // Format time as MM:SS.d
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        const tenths = Math.floor((elapsedTime % 1000) / 100);
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
        
        // Update DPS
        if (elapsedTime > 0) {
            const dps = (totalDamage / (elapsedTime / 1000)).toFixed(1);
            dpsDisplay.textContent = dps;
        }
    }
    
    function resetAll() {
        // Reset timer
        stopTimer();
        elapsedTime = 0;
        timerDisplay.textContent = '00:00.0';
        
        // Reset damage and DPS
        totalDamage = 0;
        totalDamageDisplay.textContent = '0';
        dpsDisplay.textContent = '0.0';
        
        // Clear log
        damageLog.innerHTML = '';
        
        // Reset abilities (clear any active cooldowns)
        abilities.forEach(ability => {
            ability.classList.remove('cooling', 'gcd');
            const cooldownOverlay = ability.querySelector('.cooldown-overlay');
            if (cooldownOverlay) {
                cooldownOverlay.style.display = 'none';
            }
            
            // Remove any cooldown animations
            const animations = ability.querySelectorAll('.cooldown-animation, .gcd-animation');
            animations.forEach(anim => {
                if (anim && anim.parentNode === ability) {
                    ability.removeChild(anim);
                }
            });
        });
        
        // Reset GCD
        isGCDActive = false;
        gcdStatus.textContent = 'Ready';
    }
    
    // Button event listeners
    startStopBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });
    
    resetBtn.addEventListener('click', resetAll);
    
    // Keyboard event listeners
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        
        // Ability hotkeys (2-5)
        if (hotkeyMap[key]) {
            const ability = hotkeyMap[key];
            
            // Add visual feedback
            ability.style.transform = 'translateY(1px)';
            ability.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            
            // Activate the ability
            activateAbility(ability);
            
            // Reset visual feedback after a short delay
            setTimeout(() => {
                if (!ability.classList.contains('cooling') && !ability.classList.contains('gcd')) {
                    ability.style.transform = '';
                    ability.style.boxShadow = '';
                }
            }, 100);
        }
        
        // Start/Stop timer with 's' key
        if (key === 's') {
            if (isTimerRunning) {
                stopTimer();
            } else {
                startTimer();
            }
        }
        
        // Reset with 'r' key
        if (key === 'r') {
            resetAll();
        }
    });
    
    function activateAbility(ability) {
        // Don't do anything if this ability is on cooldown
        if (ability.classList.contains('cooling')) {
            return;
        }
        
        // Don't do anything if global cooldown is active
        if (isGCDActive) {
            return;
        }
        
        // Start the timer if it's not already running when an ability is used
        if (!isTimerRunning) {
            startTimer();
        }
        
        const damage = parseInt(ability.dataset.damage);
        const cooldown = parseInt(ability.dataset.cooldown);
        const abilityName = ability.id;
        
        // Add damage to total
        totalDamage += damage;
        totalDamageDisplay.textContent = totalDamage;
        
        // Update DPS
        if (elapsedTime > 0) {
            const dps = (totalDamage / (elapsedTime / 1000)).toFixed(1);
            dpsDisplay.textContent = dps;
        }
        
        // Log damage with timer timestamp instead of real time
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        const tenths = Math.floor((elapsedTime % 1000) / 100);
        const timerTimestamp = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;
        
        const logEntry = document.createElement('div');
        logEntry.classList.add('log-entry');
        logEntry.textContent = `[${timerTimestamp}] ${abilityName}: ${damage} damage`;
        damageLog.appendChild(logEntry);
        damageLog.scrollTop = damageLog.scrollHeight;
        
        // Start ability-specific cooldown
        ability.classList.add('cooling');
        
        // Create cooldown animation
        const cooldownAnimation = document.createElement('div');
        cooldownAnimation.classList.add('cooldown-animation');
        cooldownAnimation.style.animation = `cooldown-fill ${cooldown}s linear forwards`;
        ability.appendChild(cooldownAnimation);
        
        // Show and update cooldown timer
        const cooldownOverlay = ability.querySelector('.cooldown-overlay');
        cooldownOverlay.style.display = 'flex';
        
        let timeLeft = cooldown;
        cooldownOverlay.textContent = `${timeLeft}s`;
        
        const timer = setInterval(() => {
            timeLeft -= 1;
            cooldownOverlay.textContent = `${timeLeft}s`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                ability.classList.remove('cooling');
                cooldownOverlay.style.display = 'none';
                if (cooldownAnimation && cooldownAnimation.parentNode === ability) {
                    ability.removeChild(cooldownAnimation);
                }
            }
        }, 1000);
        
        // Start global cooldown (GCD)
        startGlobalCooldown();
    }
    
    function startGlobalCooldown() {
        // Set GCD flag
        isGCDActive = true;
        gcdStatus.textContent = `${GLOBAL_COOLDOWN}s`;
        
        // Add GCD class to all abilities
        abilities.forEach(ability => {
            ability.classList.add('gcd');
            
            // Create GCD animation
            const gcdAnimation = document.createElement('div');
            gcdAnimation.classList.add('gcd-animation');
            ability.appendChild(gcdAnimation);
        });
        
        // GCD timer
        let gcdTimeLeft = GLOBAL_COOLDOWN;
        const gcdTimer = setInterval(() => {
            gcdTimeLeft -= 0.1;
            gcdStatus.textContent = `${gcdTimeLeft.toFixed(1)}s`;
            
            if (gcdTimeLeft <= 0) {
                clearInterval(gcdTimer);
                isGCDActive = false;
                gcdStatus.textContent = 'Ready';
                
                // Remove GCD class and animation from all abilities
                abilities.forEach(ability => {
                    ability.classList.remove('gcd');
                    const gcdAnim = ability.querySelector('.gcd-animation');
                    if (gcdAnim && gcdAnim.parentNode === ability) {
                        ability.removeChild(gcdAnim);
                    }
                });
            }
        }, 100);
    }
});

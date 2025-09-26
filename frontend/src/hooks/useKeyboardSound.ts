const keyStrokeSounds = [
    new Audio('/sounds/keystroke1.mp3'),
    new Audio('/sounds/keystroke2.mp3'),
    new Audio('/sounds/keystroke3.mp3'),
    new Audio('/sounds/keystroke4.mp3'),
]

function useKeyboardSound() {
    const playRandomkeyStrokeSound = () => {
        const randSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
        randSound.currentTime = 0;
        randSound.play().catch(err => console.log("Audio play failed.", err));
    };

    return {playRandomkeyStrokeSound}
}

export default useKeyboardSound;


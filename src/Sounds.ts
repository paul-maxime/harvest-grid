const SOUNDS = new Map<string, string[]>();
SOUNDS.set('POP', ['pop-1.ogg', 'pop-2.ogg', 'pop-3.ogg']);
SOUNDS.set('WHISTLE', ['whistle-1.ogg']);
SOUNDS.set('SELL', ['sell-1.ogg', 'sell-2.ogg', 'sell-3.ogg']);
SOUNDS.set('FROUF', ['frouf-1.ogg', 'frouf-2.ogg']);
SOUNDS.set('POUF', ['pouf-1.ogg', 'pouf-2.ogg']);

export default function(name: string) {
    let sound = SOUNDS.get(name);
    if (sound) {
        const audio = new Audio(`./sounds/${sound[Math.floor(Math.random() * sound.length)]}`);
        audio.play();
    }
};
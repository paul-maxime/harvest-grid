const SOUNDS = new Map<string, HTMLAudioElement | HTMLAudioElement[]>();
SOUNDS.set('POP', [new Audio('sounds/pop-1.ogg'), new Audio('sounds/pop-2.ogg'), new Audio('sounds/pop-3.ogg')]);
SOUNDS.set('WHISTLE', new Audio('sounds/whistle-1.ogg'));

export default function(name: string) {
    let sound = SOUNDS.get(name);
    if (sound) {
        sound = sound instanceof Array ? sound[Math.floor(Math.random() * sound.length)] : sound;
        sound.play();
    }
};
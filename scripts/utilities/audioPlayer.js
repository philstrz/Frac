
let audioManager = null;
let sounds = {};

export default class AudioPlayer
{
	static Init(AudioManager)
	{
		audioManager = AudioManager;
	}
	
	static async LoadSounds(filenames=[])
	{
		const iterable = [];
		for (const filename of filenames)
		{
			iterable.push(audioManager.loadSound(filename));
		}
		const soundBuffers = await Promise.all(iterable);
		
		for (let i = 0; i < filenames.length; i++)
		{
			const name = filenames[i].replace(".webm", "");
			sounds[name] = soundBuffers[i];
		}
	}
	
	static PlaySound(name)
	{
		if (sounds[name]) audioManager.playSound(sounds[name]);
		else console.error("No sound named " + name);
	}
}
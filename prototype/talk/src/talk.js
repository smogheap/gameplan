var TALK = {
	speech: [],
	activeSpeech: null,
	line: [],
	activeLine: null,
	writeTimer: null,
	dialog: "",
	write: 0
};


function next() {
	if(TALK.writeTimer) {
		writeslow(true);
		return;
	}
	if(TALK.activeSpeech !== null) {
		if(TALK.activeLine !== null) {
			TALK.line.item(TALK.activeLine).classList.toggle("hidden", true);
			TALK.activeLine++;
			if(TALK.activeLine >= TALK.line.length) {
				TALK.activeLine = 0;
				TALK.speech.item(TALK.activeSpeech).classList.toggle("hidden", true);
				TALK.activeSpeech++;
				TALK.line = [];
				if(TALK.activeSpeech >= TALK.speech.length) {
					//done
					TALK.activeSpeech = TALK.activeLine = null;
					TALK.speech = [];
					TALK.line = [];
					return;
				}
			}
		}
	}
	if(!TALK.speech.length) {
		TALK.speech = document.querySelectorAll(".speech");
		TALK.activeSpeech = 0;
		TALK.line = [];
	}
	if(!TALK.line.length) {
		TALK.line = TALK.speech.item(TALK.activeSpeech).querySelectorAll(".dialog");
		TALK.activeLine = 0;
		TALK.word = 0;
	}
	TALK.speech.item(TALK.activeSpeech).classList.toggle("hidden", false);
	TALK.line.item(TALK.activeLine).classList.toggle("hidden", false);
	var rep = new RegExp("\n", "g");
	TALK.dialog = TALK.line.item(TALK.activeLine).textContent.replace(rep, " \n");
	writeslow();
}

function writeslow(hurry) {
	clearTimeout(TALK.writeTimer);
	TALK.writeTimer = null;
	if(hurry) {
		TALK.line.item(TALK.activeLine).textContent = TALK.dialog;
		TALK.write = 0;
		return;
	}

	TALK.write++;
/*
	var text = [];
	TALK.dialog.split(" ").every(function(word, idx) {
		text.push(word);
		return(idx < TALK.word);
	});
	text = text.join(" ");
*/
	var text = TALK.dialog.substring(0, TALK.write);
	TALK.line.item(TALK.activeLine).textContent = text;
	if(text.length < TALK.dialog.length) {
		TALK.writeTimer = setTimeout(writeslow, 10);
	} else {
		TALK.write = 0;
	}
}

(function init() {
})();

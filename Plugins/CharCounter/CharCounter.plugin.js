//META{"name":"CharCounter"}*//

class CharCounter {
	constructor () {
		this.switchFixObserver = new MutationObserver(() => {});
		
		this.selecting = false;
		
		this.css = `
			.character-counter {
				display: block;
				position: absolute;
				right: 0; 
				bottom: -1.3em;
				opacity: .5;
				z-index: 1000;
			}`;
			
		this.counterMarkup = `<div class="character-counter"></div>`;
	}

	getName () {return "CharCounter";}

	getDescription () {return "Adds a charcounter in the chat.";}

	getVersion () {return "1.0.4";}

	getAuthor () {return "DevilBro";}

	//legacy
	load () {}

	start () {
		if (typeof BDfunctionsDevilBro === "object") BDfunctionsDevilBro = "";
		$('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js"]').remove();
		$('head').append("<script src='https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js'></script>");
		if (typeof BDfunctionsDevilBro !== "object") {
			$('head script[src="https://cors-anywhere.herokuapp.com/https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js"]').remove();
			$('head').append("<script src='https://cors-anywhere.herokuapp.com/https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js'></script>");
		}
		if (typeof BDfunctionsDevilBro === "object") {
			BDfunctionsDevilBro.loadMessage(this.getName(), this.getVersion());
			
			this.switchFixObserver = BDfunctionsDevilBro.onSwitchFix(this);
			
			BDfunctionsDevilBro.appendLocalStyle(this.getName(), this.css);
			
			this.appendCounter();
		}
		else {
			console.error(this.getName() + ": Fatal Error: Could not load BD functions!");
		}
	}


	stop () {
		if (typeof BDfunctionsDevilBro === "object") {
			this.switchFixObserver.disconnect();
			
			$(".character-counter").remove();
			var textinput = document.querySelector(".channelTextArea-1HTP3C textarea");
			$(textinput).off("keydown." + this.getName()).off("click." + this.getName()).off("mousedown." + this.getName());
			$(document).off("mouseup." + this.getName()).off("mousemove." + this.getName());
			
			BDfunctionsDevilBro.removeLocalStyle(this.getName());
		}
	}
	
	onSwitch () {
		if (typeof BDfunctionsDevilBro === "object") {
			this.appendCounter();
		}
	}
	
	// begin of own functions
	
	appendCounter () {
		var textarea = document.querySelector(".channelTextArea-1HTP3C");
		if (textarea) {
			$(".character-counter").remove();
			var counter = $(this.counterMarkup);
			var textinput = textarea.querySelector("textarea");
			$(textinput)
				.off("keydown." + this.getName() + " click." + this.getName())
				.on("keydown." + this.getName() + " click." + this.getName(), e => {
					setTimeout(() => {
						updateCounter();
					},10);
				})
				.off("mousedown." + this.getName())
				.on("mousedown." + this.getName(), e => {
					this.selecting = true;
				});
			$(document)
				.off("mouseup." + this.getName())
				.on("mouseup." + this.getName(), e => {
					if (this.selecting) {
						this.selecting = false;
					}
				})
				.off("mousemove." + this.getName())
				.on("mousemove." + this.getName(), e => {
					if (this.selecting) {
						setTimeout(() => {
							updateCounter();
						},10);
					}
				});
			$(textarea).append(counter);
			
			updateCounter();
			
			function updateCounter () {
				var selection = textinput.selectionEnd - textinput.selectionStart == 0 ? "" : " (" + (textinput.selectionEnd - textinput.selectionStart) + ")";
				counter.text(textinput.value.length + "/2000" + selection);
			}
		}
	}
}

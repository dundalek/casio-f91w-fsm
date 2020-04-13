
/**
 * Casio
 *
 * Operating system class
 *
 */

 // A faire : faire function toString() toInt() addZero()
 // addZero()
 // (this.print_hour < 10) ? (this.print_hour = "0" + this.print_hour) : (this.print_hour = this.print_hour.toString());

class Casio
{
	constructor() {

		// Settings
		this.setting_alarm_mode = 0; // 0-1-2-3
		this.setting_hour_mode  = 1; // 1-2
		this.setting_lap        = 0; // 0-1

		// Display elements
		this.print_mode   = ""; // Jour lettres
		this.print_day    = "";
		this.print_hour   = "";
		this.print_minute = "";
		this.print_second = "";

		// Autorisations pour afficher ou non
		this.display_hour_mode = true;
		this.display_mode      = true;
		this.display_day       = true;
		this.display_second    = true;
		this.display_dots      = true;

		// Variables contenant l'heure de l'alarme
		this.variable_alarm = ["7", "00"];

		// Menus et menu actif
		this.mode        = ["clock", "alarm", "stopwatch"/*, "settime"*/];
		this.mode_active = "clock";

		this.btn_3_hover = false;
		this.interval; // L'intervale appelant une fonction mode (clock, alarm...)

		// Active l'écoute des boutons
		this.listener();
	}

	// Date dans un objet.
	formatedDate() {

		var d = new Date();
		var month = (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1);
		var day = (d.getDate() < 10 ? "0" + d.getDate() : d.getDate()).toString();
		var weekday = d.getDay();
		var hour = d.getHours().toString();
		var minute = (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()).toString();
		var second = (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()).toString();

		var letter_weekday = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

		return [month, day, letter_weekday[weekday], hour, minute, second];
	}


	// Ecoute des bouttons.
	listener() {
		// setInterval de la fonction router("launch")
		// var interval = setInterval(function() {this.router("launch")}.bind(this), 1000);
		this.intervalManager(true);

		// BOUTON 1
		document.querySelector("#btn1").addEventListener("click", (e) => {
			this.router(1);
		});
		
		// BOUTON 2
		document.querySelector("#btn2").addEventListener("click", (e) => {
			this.router(2);
		});

		// BOUTON 3
		document.querySelector("#btn3").addEventListener("click", (e) => {
			this.router(3);
		});

		// Pour afficher la lumière
		var mouse_down_2;
		var self = this;
		// Quand le bouton 1 est pressé
		document.querySelector("#btn1").addEventListener("mousedown", (e) => {
			mouse_down_2 = setTimeout(function() {
				// Afficher lumière
				self.lightManager(true);
			}, 1);

			// Quand le bouton est relaché
			document.querySelector("#btn1").addEventListener("mouseup", (e) => {
				if (mouse_down_2) {
					// Eteint la lumière
					clearTimeout(mouse_down_2);
					self.lightManager(false);
				}
			});
		});


		
		// Pour afficher "CASIo" quand le bouton 3 est pressé
		var mouse_down_1;
		document.querySelector("#btn3").addEventListener("mousedown", (e) => {

			// Peut afficher CASIo uniquement si le mode actif est "clock"
			if (this.mode_active == "clock") {

				mouse_down_1 = setTimeout(function() {
					// Changement des variables globales pour afficher "CA510"
					self.print_hour   = "CA";
					self.print_minute = "51";
					self.print_second = "0 ";
					self.display_alarm_mode = false;
					self.display_hour_mode  = false;
					self.display_mode       = false;
					self.display_day        = false;
					self.display_dots       = false;
					self.prepareOutput();
					// Stop l'intervale
					self.intervalManager(false);
				}, 3000);

				// Quand le bouton est relaché
				document.querySelector("#btn3").addEventListener("mouseup", (e) => {
					if (mouse_down_1) {
						// Stop Timeout du mousedown et re-lancement de l'intervale
						clearTimeout(mouse_down_1);
						self.intervalManager(true);
					}
				});
			}
		});

	}

	intervalManager(bool) {

		if (bool) {
			this.interval = setInterval(function() {
				this.router("launch");
			}.bind(this), 1000);
		}
		else {
			clearInterval(this.interval); 
		}
	}

	lightManager(bool) {

		var light = document.querySelector("#light");

		if (bool) {
			light.style.opacity = "0.23";
		}
		else {
			light.style.opacity = "0";
		}
	}

	router(btn) {

		// Change de mode
		if (btn == 2) {
			(this.mode_active == this.mode[this.mode.length - 1] ? this.mode_active = this.mode[0] : this.mode_active = this.mode[this.mode.indexOf(this.mode_active) + 1]);
		}

		// Appelle la fonction adéquate
		if (this.mode_active == "clock") {
			this.mode_Clock(btn);
		}
		else if (this.mode_active == "alarm") {
			this.mode_Alarm(btn);
		}
		else if (this.mode_active == "stopwatch") {
			this.mode_Stopwatch(btn);
		}
		else {
			// Mode inactif pour le moment
			// this.mode_Settime(btn);
		}
	}



	mode_Clock(btn) {

		var date = this.formatedDate();

		// Autorisations
		this.display_hour_mode = true; // Autorise l'affichage de mode de l'heure (24H / PM)
		this.display_mode      = true;
		this.display_day       = true;
		this.display_second    = true;
		this.display_dots      = true;
		
		// Affichage
		this.print_mode   = date[2]; // Jour lettres
		this.print_day    = date[1];
		this.print_hour   = date[3];
		this.print_minute = date[4];
		this.print_second = date[5];

		// this.print_hour = (parseInt(this.print_hour, 10) + 12).toString(); // Ajout d'heures pour les tests

		// Changement de mode 24H
		if (btn == 3) {
			this.setting_hour_mode == 1 ? this.setting_hour_mode = 2 : this.setting_hour_mode = 1;
		}

		// Passage de 24H à 12H (ex: 15 -> 3)
		if (this.setting_hour_mode == 2) {
			this.print_hour = parseInt(this.print_hour, 10);
			this.print_hour > 12 ? this.print_hour = (this.print_hour - 12).toString() : this.print_hour = this.print_hour.toString();
		}

		this.prepareOutput();
	}

	mode_Alarm(btn) {

		this.display_hour_mode = true;
		this.display_mode      = true;
		this.display_day       = false;
		this.display_second    = false;
		this.display_dots      = true;

		this.print_mode   = "AL";
		this.print_day    = "00";
		this.print_hour   = this.variable_alarm[0];
		this.print_minute = this.variable_alarm[1]; // Ajouter zéro
		this.print_second = "00";

		if(btn == 3) {
			(this.setting_alarm_mode == 3 ? this.setting_alarm_mode = 0 : this.setting_alarm_mode += 1);
		}

		this.prepareOutput();
	}

	mode_Stopwatch(btn) {

		this.display_hour_mode = false;
		this.display_mode      = true;
		this.display_day       = false;
		this.display_second    = true;
		this.display_dots      = true;

		if (btn == 3) {
			
		}
		
		this.print_mode   = "ST";
		this.print_day    = "0";
		this.print_hour   = "00";
		this.print_minute = "00";
		this.print_second = "00";

		this.prepareOutput();
	}

	// mode_Settime(btn) {

	// 	var date = this.formatedDate();

	// 	this.display_hour_mode = true;
	// 	this.display_mode      = true;
	// 	this.display_day       = false;
	// 	this.display_second    = true;
	// 	this.display_dots      = true;
		
	// 	this.print_mode   = date[0];
	// 	this.print_day    = "";
	// 	this.print_hour   = "";
	// 	this.print_minute = "";
	// 	this.print_second = "";

	// 	this.prepareOutput();
	// }


	// Prépare l'output du résultat sur l'écran dans un objet
	prepareOutput() {

		var output_data =
		{
			display_hour_mode: this.display_hour_mode,
			display_mode: this.display_mode,
			display_day: this.display_day,
			display_second: this.display_second,
			display_dots: this.display_dots,

			setting_alarm_mode: this.setting_alarm_mode,
			setting_hour_mode: this.setting_hour_mode,
			setting_lap: this.setting_lap,

			print_mode: this.print_mode,
			print_day: this.print_day,
			print_hour: this.print_hour,
			print_minute: this.print_minute,
			print_second: this.print_second
		}

		this.Output = new Output();
		this.Output.output(output_data);
	}
}


var casio = new Casio();
casio.router("launch");
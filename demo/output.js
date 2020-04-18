

class Output
{
	selector7seg(param) {
		var zero  = ["A", "B", "C", "D", "E", "F"];
		var one   = ["B", "C"];
		var two   = ["A", "B", "D", "E", "G"];
		var three = ["A", "B", "C", "D", "G"];
		var four  = ["B", "C", "F", "G"];
		var five  = ["A", "C", "D", "F", "G"];
		var six   = ["A", "C", "D", "E", "F", "G"];
		var seven = ["A", "B", "C"];
		var eight = ["A", "B", "C", "D", "E", "F", "G"];
		var nine  = ["A", "B", "C", "D", "F", "G"];

		var C     = ["A", "D", "E", "F"];
		var A     = ["A", "B" ,"C", "E", "F", "G"];
		var empty = [];

		switch (param) {
			case "0": return zero;  break;
			case "1": return one;   break;
			case "2": return two;   break;
			case "3": return three; break;
			case "4": return four;  break;
			case "5": return five;  break;
			case "6": return six;   break;
			case "7": return seven; break;
			case "8": return eight; break;
			case "9": return nine;  break;

			case "C": return C;     break; // C et A pour Casio ;)
			case "A": return A;     break;
			case " ": return empty;     break;
		}
	}


	selector8seg(param) {
		var A = ["A", "B", "C", "E", "F", "G"];
		var E = ["A", "D", "E", "F", "G"];
		var H = ["B", "C", "E", "F", "G"];
		var L = ["D", "E", "F"];
		var O = ["A", "B", "C", "D", "E", "F"];
		var R = ["A", "B", "C", "E", "F", "G", "dot"];
		var T = ["A", "E", "F", "dot"];
		var U = ["B", "C", "D", "E", "F"];

		switch (param) {
			case "A": return A; break;
			case "E": return E; break;
			case "H": return H; break;
			case "L": return L; break;
			case "O": return O; break;
			case "R": return R; break;
			case "T": return T; break;
			case "U": return U; break;
		}
	}


	selector9seg(param) {
		var A = ["A", "B", "C", "E", "F", "G"];
		var F = ["A", "E", "F", "G"];
		var M = ["A", "B", "C", "E", "F", "H", "I"];
		var S = ["A", "C", "D", "F", "G"];
		var T = ["A", "H", "I"];
		var W = ["B", "C", "D", "E", "F", "H", "I"];

		switch (param) {
			case "A": return A; break;
			case "F": return F; break;
			case "M": return M; break; // middle
			case "S": return S; break;
			case "T": return T; break; // middle
			case "W": return W; break; // middle
		}
	}


	/* id: ID à sélectionner
	 * display: 0 ou 1, afficher ou non
	 */
	display(id, display) {
		document.querySelector("#" + id).style.opacity = display.toString();
	}


	// Fonction d'affichage, traitement des données recues
	output(data) {
		
		// log(data);

		// "Mode alarme" ON / mode 1 / mode 2 / mode 3
		if (data.setting_alarm_mode == 0) {
			this.display("signal", 0);
			this.display("alarm", 0);
		} else if (data.setting_alarm_mode == 1) {
			this.display("signal", 1);
			this.display("alarm", 0);
		} else if (data.setting_alarm_mode == 2) {
			this.display("signal", 0);
			this.display("alarm", 1);
		} else {
			this.display("signal", 1);
			this.display("alarm", 1);
		}

		// Si l'affichage du mode de l'heure est autorisé
		if (data.display_hour_mode) {
			// "24H" et "PM" ON / OFF
			if (data.setting_hour_mode == 0) {
				this.display("timemode_PM", 0);
				this.display("timemode_24H", 0);
			} else if (data.setting_hour_mode == 1) {
				this.display("timemode_PM", 0);
				this.display("timemode_24H", 1);
			} else {
				this.display("timemode_24H", 0);
				this.display("timemode_PM", 1);
				// var temp_hour = parseInt(data.print_hour);

				// if (temp_hour > 12) {
				// 	this.display("timemode_PM", 1);
				// } else {
				// 	this.display("timemode_PM", 0);
				// }
			}
		} else {
			this.display("timemode_PM", 0);
			this.display("timemode_24H", 0);
		}
		
		// "LAP" ON / OFF
		if (data.setting_lap == 0) {
			this.display("lap", 0);
		} else {
			this.display("lap", 1);
		}

		// Array des données à afficher
		// [nombre de segments, type à afficher (pour le selecteur DOM), donnée à afficher]
		var display_data = [
			[undefined, "mode", data.print_mode],
			[7, "day", data.print_day],
			[7, "hour", data.print_hour],
			[7, "minute", data.print_minute],
			[7, "second", data.print_second]
		];

		// Pour chaques données (jours, heures, minutes...)
		for (var a = 0; a < display_data.length; a++) {

			var split_data;

			/* Séparation de la donnée
			   Echange des positions (car nous traitons d'abord les unités, puis les dixaines).
			   "17" -> ["1", "7"] -> ["7", "1"]
			*/

			// Si data à deux éléments ["3", "1"]
			if (display_data[a][2].length == 2) {
				split_data = display_data[a][2].split("");
				split_data = [split_data[1], split_data[0]];
			}
			// Si data n'a qu'un élément, on donne null au deuxième pour qu'il n'affiche rien à la place
			else {
				split_data = [display_data[a][2], null];
			}

			// Si l'affichage requiert un afficheur 7 segments
			if (display_data[a][0] == 7) {

				// Pour 1 et 6
				for (var i = 0; i < 2; i++) {

					var segments = ["A", "B", "C", "D", "E", "F", "G"];

					// Pour chaques segments d'un chiffre, on éteint puis on allume si la condition est bonne
					for (var x = 0; x < 7; x++) {

						// Cette variable contient l'ID du segment
						var current_element = display_data[a][1] + "_" + (i + 1) + "_" + segments[x];

						// "Eteint" l'élément courrant
						this.display(current_element, 0);

						// Si l'élément n'est pas null, on tente d'allumer l'élément
						if (split_data[i] !== null) {

							// Contient l'array des positions des segments à allumer en fonction du chiffre
							var segments_on = this.selector7seg(split_data[i]);

							// Vérification si la position courante matches la position
							for (var y = 0; y < segments_on.length; y++) {
								(segments[x] == segments_on[y]) ? this.display(current_element, 1) : false;
							}
						}
					}
				}
			}

			// Si l'affichage requiert un afficheur de 8 ou 9 segments (affichage mode)
			else {

				var segments_on_1 = this.selector8seg(split_data[0]);
				var segments_on_2 = this.selector9seg(split_data[1]);

				var segments_1 = ["A", "B", "C", "D", "E", "F", "G", "dot"];
				var segments_2 = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

				for (var x = 0; x < 8; x++) {

					var current_element = display_data[a][1] + "_1_" + segments_1[x];

					// "Eteint" l'élément courrant
					this.display(current_element, 0);

					for (var y = 0; y < segments_on_1.length; y++) {
						(segments_1[x] == segments_on_1[y]) ? this.display(current_element, 1) : false;
					}
				}

				for (var x = 0; x < 9; x++) {

					var current_element = display_data[a][1] + "_2_" + segments_2[x];

					// "Eteint" l'élément courrant
					this.display(current_element, 0);

					for (var y = 0; y < segments_on_2.length; y++) {
						(segments_2[x] == segments_on_2[y]) ? this.display(current_element, 1) : false;
					}
				}
			}
		}

		// Si l'affichage des jours est autorisé
		if (data.display_mode == false) {
			this.display("mode", 0);
		} else {
			this.display("mode", 1);
		}
		if (data.display_day == false) {
			this.display("days", 0);
		} else {
			this.display("days", 1);
		}
		if (data.display_minute == false) {
			this.display("minutes", 0);
		} else {
			this.display("minutes", 1);
		}
		if (data.display_dots == false) {
			this.display("dots", 0);
		} else {
			this.display("dots", 1);
		}
	}
}
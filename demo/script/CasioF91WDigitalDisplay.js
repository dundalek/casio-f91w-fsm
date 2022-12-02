/**
 * @file Class CasioF91WDigitalDisplay. Manages input data from the operating system and displays it.
 * @author Alexis Philip (alexisphilip.fr)
 */

/**
 * Casio F-91W's digital display system.
 * 
 * INPUT: operating system.
 * 
 * @author Alexis Philip (alexisphilip.fr)
 */
class CasioF91WDigitalDisplay {
    /**
     * The display HTML element.
     * @var {HTMLElement}
     */
    // TODO: move all interactive element of the SVG into a "#display" wrapper (<g></g>) so the querySelector is faster.
    displayEl;

    constructor() {
        this.displayEl = document.querySelector("#CasioF91WSVG");
    }

    /**
     * Displays a character on a segment display.
     * It will turn ON or OFF all segments of the display to print the given character.
     * @param {string} id Segment display's ID.
     * @param {string} char Character to display on the segment display.
     */
    charToSegments(id, char) {

        // Associates a type of display to an ID (7, 8 or 9 segments display).
        const displays = {
            "mode_2": 9,
            "mode_1": 8,
            "day_2": 7,
            "day_1": 7,
            "hour_2": 7,
            "hour_1": 7,
            "minute_2": 7,
            "minute_1": 7,
            "second_2": 7,
            "second_1": 7,
        };

        // If the given selector is not liked to a segment display.
        if (!(id in displays)) {
            throw new Error(`Given ID '${id}' is not supported.`);
        }

        // CHARACTERS FOR 7, 8 AND 9 SEGMENTS DISPLAYS.
        let segments = {
            0: ["A", "B", "C", "D", "E", "F"],
            1: ["B", "C"],
            2: ["A", "B", "D", "E", "G"],
            3: ["A", "B", "C", "D", "G"],
            4: ["B", "C", "F", "G"],
            5: ["A", "C", "D", "F", "G"],
            6: ["A", "C", "D", "E", "F", "G"],
            7: ["A", "B", "C"],
            8: ["A", "B", "C", "D", "E", "F", "G"],
            9: ["A", "B", "C", "D", "F", "G"],
            "A": ["A", "B" ,"C", "E", "F", "G"],
            "C": ["A", "D", "E", "F"],
            "E": ["A", "D", "E", "F", "G"],
            "F": ["A", "E", "F", "G"],
            "H": ["B", "C", "E", "F", "G"],
            "I": ["B", "C"],
            "L": ["D", "E", "F"],
            "O": ["A", "B", "C", "D", "E", "F"],
            "S": ["A", "C", "D", "F", "G"],
            "U": ["B", "C", "D", "E", "F"],
            " ": [], // Turn off all segments of the display.
        };

        // CHARACTERS FOR 8 SEGMENTS DISPLAYS.
        // Specific characters are displayed differently depending on on the type of display.
        if (displays[id] === 8) {
            segments["T"] = ["A", "E", "F", "H"];
            segments["R"] = ["A", "B", "C", "E", "F", "G", "H"];
        } // CHARACTERS FOR 9 SEGMENTS DISPLAYS.
        else if (displays[id] === 9) {
            segments["M"] = ["A", "B", "C", "E", "F", "H", "I"];
            segments["T"] = ["A", "H", "I"];
            segments["H"] = ["B", "C", "E", "F", "G"];
            segments["W"] = ["B", "C", "D", "E", "F", "H", "I"];
        }

        // If the given character is not supported.
        if (!(char in segments)) {
            throw new Error(`Given character '${char}' is not supported on '${id}' ${displays[id]} segments displays.`);
        }

        // For each segments of the display.
        for (const segment of ["A", "B", "C", "D", "E", "F", "G", "H", "I"]) {
            if (segments[char].includes(segment)) {
                this.displayScreen(id + "_" + segment, true);
            } else {
                this.displayScreen(id + "_" + segment, false);
            }
        }
    }

    /**
     * Displays or hides an element on the display.
     * Elements can be:
     * - unique element: "timeSignalOnMark" "lap", "dots"...
     * - element in a group: segments displays `segment`: "minute_2", "minute_1", "hour_2", "hour_1"...
     * @param {string} id Display element's ID.
     * @param {boolean} display Wether to display or not the element.
     */
    displayScreen(id, display) {
        const el = this.displayEl.querySelector("#" + id);
        if (!!el) {
            // TODO
            const opacity = id === "light" ? "0.4" : "1";
            el.style.opacity = display ? opacity : "0";
        }
    }
}

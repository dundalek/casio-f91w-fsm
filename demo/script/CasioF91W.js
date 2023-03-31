/**
 * @file Class CasioF91W. Manages the event listeners which will input the watch's operating system.
 * @author Alexis Philip (alexisphilip.fr)
 */

/**
 * Casio F-91W.
 * 
 * I like to to see this class as the "case" of the watch.
 * You can click its buttons that operate the watch.
 * 
 * OUTPUT: operating system.
 * 
 * BUTTONS:
 * 
 *     L  /-------\
 *        | watch |
 *     C  \-------/ A
 * 
 * @author Alexis Philip (alexisphilip.fr)
 */
class CasioF91W {
    /**
     * The watch's operating system object.
     * @var {CasioF91WOperatingSystem}
     */
    os;
    /**
     * Callback function executed on the watch's button click, after the operating system's operations.
     * @var {function}
     */
    onButtonClick;

    /**
     * Instantiates the watch's operating system and sets
     * up the event listeners which will input the OS.
     */
    constructor() {

        this.os = new CasioF91WOperatingSystem();

        const buttonL = document.querySelector("#buttonL"),
              buttonC = document.querySelector("#buttonC"),
              buttonA = document.querySelector("#buttonA");

        /**
         * BUTTON 1 (L)
         */
        buttonL.addEventListener("mousedown", e => {
            this.os.buttonL(true);
        });

        buttonL.addEventListener("mouseup", e => {
            this.os.buttonL(false);
            if (typeof this.onButtonClick === "function") this.onButtonClick();
        });
        
        /**
         * BUTTON 2 (C)
         */
        buttonC.addEventListener("mousedown", e => {
            this.os.buttonC(true);
        });

        buttonC.addEventListener("mouseup", e => {
            this.os.buttonC(false);
            if (typeof this.onButtonClick === "function") this.onButtonClick();
        });
        
        /**
         * BUTTON 3 (A)
         */
        buttonA.addEventListener("mousedown", e => {
            this.os.buttonA(true);
        });

        buttonA.addEventListener("mouseup", e => {
            this.os.buttonA(false);
            if (typeof this.onButtonClick === "function") this.onButtonClick();
        });
    }
}

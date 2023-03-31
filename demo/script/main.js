/**
 * @file Main script.
 * @author Alexis Philip (alexisphilip.fr)
 */

/**
 * TODO:
 * - NAMING: set new names for the different segments displays (no snake_case?)
 * - FIXES:
 *      - search all `TODO`s in the code
 *      - STOPWATCH: not accurate timing: instead of incrementing it an interval, increment it just like `dateTime` object (in the fake system clock + with an offset) OR just get the current date time milliseconds +- offset to just print milliseconds/seconds/minutes.
 *      - RESPONSIVE (phone view is horrible)
 *      - when incrementing values, do not increment the higher value after (ex: 59 minutes -> 00 should not increment the hour)
 *      - alarm get/set should take into account time mode 12h
 *      - alarm get/set seconds reset to 0 seconds
 *      - all button actions are executed on "down" state, not "up" state
 *      - switch between modes has exception if you set alarm, use stopwatch, etc (setDateTime does not show if a specific action has been done (stopwatch interaction, etc...))
 *      - 12h format (PM) not shown if time below 13h
 *      - stopwatch: when it's running, make dots blink
 * - FUNCTIONALITIES:
 *      - when a mode is triggered, display on the side it's current mode and instructions
 *      - display basic instructions on load?
 *      - displays instructions next to buttons dynamically
 *      - add click sound and alarms
 *      - store Casio data in cookies so the user has its settings saved
 */

// ###########
// CASIO F-91W
// ###########

// It all happens here: the holy F-91W is instantiated, here, at this right place.
const myCasioF91W = new CasioF91W();

// What's below now has nothing to do with the watch itself.


// ###############
// PAGE ANIMATIONS
// ###############

AnimateString.animationKeyframes = [
    {
        transform: "rotate(-7deg) scale(1.05)",
        color: "#8f43ab",
        offset: 0.5
    },
    {
        transform: "rotate(0deg) scale(1)",
        color: "unset",
        offset: 1,
    }
];

// TODO: fix AnimateString then implement it for all elements in the page.
// TODO: fix underline (it is removed during the process)

// Animates some strings in the page.
new AnimateString(document.querySelectorAll(".top-left h1"));
// new AnimateString(document.querySelectorAll(".top-left a"));


// ################
// SOUND MANAGEMENT
// ################

// Mutes all sound of the current document (for the watch's "bip" sound).

const soundOnOffBtn = document.querySelector("#SoundOnOff");

/**
 * - Mutes the "bip" sound.
 * - Shows/hides sound icons accordingly.
 * - Stores in localStorage the "mute" state.
 * @param {boolean} mute Mutes the "bip" sound or not.
 */
const muteBip = (mute) => {

    // Shows/hide sound icons.
    soundOnOffBtn.classList.remove(...["on", "off"]);
    mute ? soundOnOffBtn.classList.add("off") : soundOnOffBtn.classList.add("on");

    // Mutes the "bip" `Audio` instance.
    myCasioF91W.os.bip.muted = mute;

    // Sets button's state in local storage.
    localStorage.setItem("isBipMuted", mute);
};

// If "bip" mute state is stored in the local storage, get it.
if (localStorage.getItem("isBipMuted")) {
    muteBip(localStorage.getItem("isBipMuted") === "true");
}

// On sound ON/OFF click, toggles it's muted state.
document.querySelector("#SoundOnOff").addEventListener("click", (e) => {
    // If sound if "ON", we'll turn it off.
    muteBip(e.currentTarget.classList.contains("on"));
});


// ####################
// DYNAMIC INSTRUCTIONS
// ####################

// Manages the dynamic instructions.

const elementButtonL = document.querySelector("#descriptionButtonL"),
      elementButtonC = document.querySelector("#descriptionButtonC"),
      elementButtonA = document.querySelector("#descriptionButtonA");

/**
 * Adds instructions next to the watch's button related to the current operations of the watch.
 */
const setInstructions = () => {
    let menu,
        buttonL,
        buttonC,
        buttonA;

    if (myCasioF91W.os.activeMenu === "dateTime") {
        menu = "<b>Regular time keeping</b> mode";
        buttonL = "Backlight";
        buttonC = "Switch to <b>daily alarm</b> mode";

        if (myCasioF91W.os.timeMode === "24") {
            buttonA = "Switch to 12-hour format<br>Hold for a surprise...";
        } else {
            buttonA = "Switch to 24-hour format<br>Hold for a surprise...";
        }
    } else if (myCasioF91W.os.activeMenu === "dailyAlarm") {
        menu = "Daily alarm mode";
        buttonC = "Switch to <b>stopwatch</b> mode";

        if (myCasioF91W.os.activeAction === "default") {
            buttonL = "Set alarm hour";

            if (myCasioF91W.os.alarmOnMark && myCasioF91W.os.timeSignalOnMark) {
                buttonA = "Turn OFF <b>alarm-ON-mark</b> and <b>time-signal-ON-mark</b>";
            } else if (myCasioF91W.os.alarmOnMark) {
                buttonA = "Turn OFF <b>alarm-ON-mark</b> and turn ON <b>time-signal-ON-mark</b>";
            } else if (myCasioF91W.os.timeSignalOnMark) {
                buttonA = "Turn ON <b>alarm-ON-mark</b>";
            } else {
                buttonA = "Turn ON <b>time-signal-ON-mark</b>";
            }
        } else if (myCasioF91W.os.activeAction === "edit-hours") {
            buttonL = "Set alarm minutes<br>Backlight";
            buttonA = "Increment hours<br>Hold to increment faster";
        } else if (myCasioF91W.os.activeAction === "edit-minutes") {
            buttonL = "Exit alarm setting<br>Backlight";
            buttonA = "Increment minutes<br>Hold to increment faster";
        }
    } else if (myCasioF91W.os.activeMenu === "stopwatch") {
        menu = "Stopwatch mode";
        buttonC = "Switch to <b>time/calendar setting</b> mode";
        
        if (myCasioF91W.os.stopwatchInterval) {
            buttonA = "Stop stopwatch";

            if (myCasioF91W.os.stopwatchDateTimeSplit) {
                buttonL = "Reset split time<br>Backlight";
            } else {
                buttonL = "Record split time<br>Backlight";
            }
        } else {
            buttonA = "Start stopwatch";

            if (myCasioF91W.os.stopwatchDateTimeSplit) {
                buttonL = "Reset split time<br>Backlight";
            } else {
                buttonL = "Reset stopwatch<br>Backlight";
            }
        }
    } else if (myCasioF91W.os.activeMenu === "setDateTime") {
        menu = "Time/calendar setting mode";
        buttonL = "Backlight";
        buttonC = "Switch to <b>regular time keeping</b> mode";
        buttonA = "";
  
        if (myCasioF91W.os.activeAction === "default") {
            buttonL = "Set minutes<br>Backlight";
            buttonA = "Increment seconds<br>Hold to increment faster";
        } else if (myCasioF91W.os.activeAction === "edit-minutes") {
            buttonL = "Set hours<br>Backlight";
            buttonA = "Increment minutes<br>Hold to increment faster";
        } else if (myCasioF91W.os.activeAction === "edit-hours") {
            buttonL = "Set month<br>Backlight";
            buttonA = "Increment hours<br>Hold to increment faster";
        } else if (myCasioF91W.os.activeAction === "edit-month") {
            buttonL = "Set date<br>Backlight";
            buttonA = "Increment month<br>Hold to increment faster";
        } else if (myCasioF91W.os.activeAction === "edit-day-number") {
            buttonL = "Set seconds<br>Backlight";
            buttonA = "Increment date<br>Hold to increment faster";
        }
    }

    // For each buttons, updates the displayed instructions.
    for (const [buttonEl, value] of [[elementButtonL, buttonL], [elementButtonC, buttonC], [elementButtonA, buttonA]]) {
        // If the existing value is different the new one, updates the instructions with fadeOut/fadeIn transition.
        if (buttonEl.innerHTML !== value) {
            buttonEl.animate([
                {opacity: 1},
                {opacity: 0},
            ], 200);
            buttonEl.innerHTML = value;
            buttonEl.animate([
                {opacity: 0},
                {opacity: 1},
            ], 200);
        }
        // Once the string is appended, in the button element, let's animate it.
        new AnimateString([buttonEl]);
    }
};

// Updates the instructions on each button click.
myCasioF91W.onButtonClick = setInstructions;

// First display of the instructions.
setInstructions();

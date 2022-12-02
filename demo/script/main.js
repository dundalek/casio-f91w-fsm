/**
 * @file Main script.
 * @author Alexis Philip (alexisphilip.fr)
 */

// It all happens here: the holy F-91W is instantiated, here, at this right place.
const myCasioF91W = new CasioF91W();

// What's below now has nothing to do with the watch itself. It's the dynamic instructions.

// ####################
// DYNAMIC INSTRUCTIONS
// ####################

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
    }
};

// Updates the instructions on each button click.
myCasioF91W.onButtonClick = setInstructions;

// First display of the instructions.
setInstructions();

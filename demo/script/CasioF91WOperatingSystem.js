/**
 * @file Class CasioF91WOperatingSystem. Manages all operations of the watch, then output data to the display system.
 * @author Alexis Philip (alexisphilip.fr)
 */

/**
 * Casio F-91W's operating system.
 * 
 * INPUTS: buttons.
 * - `buttonL()`
 * - `buttonC()`
 * - `buttonA()`
 * 
 * OUTPUT: digital display.
 * 
 * @author Alexis Philip (alexisphilip.fr)
 */
class CasioF91WOperatingSystem {
    /**
     * Fake system clock frequency in milliseconds.
     * @var {number}
     */
    systemClock;
    /**
     * Fake display frame rate in milliseconds.
     * @var {number}
     */
    displayFrameRate;
    /**
     * The active menu displayed on the screen.
     * 
     * All cases:
     * - "dateTime"    Displays the time and date.
     * - "dailyAlarm"  Displays the daily alarm.
     * - "stopwatch"   Stopwatch with split times.
     * - "setDateTime" Sets the time and date.
     * 
     * @var {string}
     */
    activeMenu;
    /**
     * The current "action" being executed in the current "menu".
     * An "action" is executed in a "menu".
     * 
     * All "action" cases:
     * - 'dateTime' menu:
     *   - 'default'         Displays the time and date.
     *   - 'casio'           Displays "CA510".
     * - 'dailyAlarm' menu:
     *   - 'default'         Displays the daily alarm.
     *   - 'edit-hours'      Sets the hours.
     *   - 'edit-minutes'    Sets the minutes.
     * - 'stopwatch' menu:
     *   - 'default'         Displays the stopwatch.
     * - 'setDateTime' menu:
     *   - 'default'         Sets the seconds.
     *   - 'edit-minutes'    Sets the minutes.
     *   - 'edit-hours'      Sets the hours.
     *   - 'edit-month'      Sets the month.
     *   - 'edit-day-number' Sets the date.
     *
     * @var {string}
     */
    activeAction;
    /**
     * Watch's current date time object.
     * @var {Date}
     */
    dateTime;
    /**
     * Watch's current date time object offset in milliseconds.
     * When the user sets a new date & time on the watch, the `dateTime`
     * object is untouched but this `dateTimeOffset` variable contains the
     * difference in milliseconds between the `dateTime` and the date the user set.
     * @var {number}
     */
    dateTimeOffset;
    /**
     * Alarm's current date time object.
     * Only hours and minutes are used for the alarm.
     * @var {Date}
     */
    dailyAlarmDateTime;
    /**
     * Alarm on mark' state.
     * @var {boolean}
     */
    alarmOnMark;
    /**
     * Time signal on mark' state.
     * @var {boolean}
     */
    timeSignalOnMark;
    /**
     * Current time mode.
     * - "24": classic international 24H displayed time.
     * - "12": others who use AM/PM 12H displayed time.
     * @var {string}
     */
    timeMode;
    /**
     * Stopwatch split's state. True if a split time is currently saved, false if not.
     * @var {boolean}
     */
    lap;
    /**
     * Stopwatch current date time.
     * @var {Date}
     */
    stopwatchDateTime;
    /**
     * Stopwatch saved split date time.
     * @var {Date}
     */
    stopwatchDateTimeSplit;
    /**
     * Interval incrementing the stopwatch's time.
     * @var {intervalID}
     */
    stopwatchInterval;
    /**
     * Timeout assigned to a button action.
     * See use in code for details.
     * @var {timeoutID}
     */
    buttonTimeout;
    /**
     * Interval assigned to a button action.
     * See use in code for details.
     * @var {intervalID}
     */
    buttonInterval;
    /**
     * The Casio alarm/signal/switch mode "bip" sound `Audio` instance.
     * @var {Audio}
     */
    bip;
    /**
     * Contains all display variables.
     * @var {object}
     */
    display = {};
    /**
     * The watch's digital display object.
     * @var {CasioF91WDigitalDisplay}
     */
    digitalDisplay;

    /**
     * Initializes the whole ~~ CASIO F-91W ~~
     * operating system and makes it ready to use!
     */
    constructor() {

        // Fake system clock frequency in milliseconds.
        this.systemClock = 20;
        // Fake display frame rate in milliseconds.
        this.displayFrameRate = 20;

        // Sets the time and date object.
        this.dateTime = new Date();
        // Sets its default offset.
        this.dateTimeOffset = 0;

        // Sets the daily alarm's date time.
        this.dailyAlarmDateTime = new Date();
        this.dailyAlarmDateTime.setHours(7);
        this.dailyAlarmDateTime.setMinutes(0);
        this.dailyAlarmDateTime.setSeconds(0);

        // Sets the stopwatch's date time.
        this.stopwatchDateTime = new Date();
        this.stopwatchDateTime.setMinutes(0);
        this.stopwatchDateTime.setSeconds(0);
        this.stopwatchDateTime.setMilliseconds(0);

        // Sets default menu and action.
        this.activeMenu = "dateTime";
        this.activeAction = "default";

        // Sets default time mode.
        this.timeMode = "24";

        // Sets alarm variables.
        this.alarmOnMark = false;
        this.timeSignalOnMark = false;

        // Sets stopwatch variables.
        this.lap = false;

        // Casio's "bip" sound.
        this.bip = new Audio("sound/bip.mp3");

        // Instantiates the watch's digital display system.
        this.digitalDisplay = new CasioF91WDigitalDisplay();

        // FAKE "SYSTEM CLOCK" (simulates the hardware's system clock).
        setInterval(() => {
            /**
             * /!\ IMPORTANT /!\
             * 
             * Here, on every fake system's clock loop, the JS "Date()"
             * object is updated to the current true system's clock "Date()" (+ an offset).
             * 
             * We do not set the date once then iterate it on the rate of the fake system's clock
             * since JS intervals are VERY inaccurate because of the execution/interpretation operations.
             * 
             * To solve this problem, we are using the JS current Date() object once at initialisation.
             * This object is using the computer's OS, itself using the system's clock (computer, phone),
             * therefore it is very precise.
             * 
             * Then, on every fake system's clock loop, we update the fixed saved
             * JS "Date()" object with the current running one (using: "new Date()").
             * We are also adding an offset so it allows the user to "set" a new date time for its watch.
             * 
             * By relying on the system's JS "Date()" object, we are using the true system's internal
             * clock and the displayed date/alarm/stopwatch dates & times will always be very accurate.
             */
            this.dateTime = new Date(new Date().getTime() + this.dateTimeOffset);
        }, this.systemClock);
        
        // FAKE "DIGITAL DISPLAY CLOCK" LOOP (frame rate).
        setInterval(() => {

            this.display.light = this.light;

            if (this.activeMenu === "dateTime") {
                this.display.lap = false;
                this.display.dots = true;
                if (this.activeAction === "default") {
                    // Sets the default screen of the current menu.
                    let dayLetters = this.dateTime.toLocaleDateString("en-US", {weekday: 'long'}).slice(0, 2).toUpperCase();
                    const day = this.dateTime.getDate();
                    let hours = this.dateTime.getHours();
                    hours = this.timeMode === "12" && hours > 12 ? hours - 12 : hours;
                    const minutes = this.dateTime.getMinutes();
                    const seconds = this.dateTime.getSeconds();
                    
                    this.display.alarmOnMark = this.alarmOnMark;
                    this.display.timeSignalOnMark = this.timeSignalOnMark;
                    this.display.timeMode24 = this.timeMode === "24";
                    this.display.timeMode12 = this.timeMode === "12";
                    this.display.mode_2 = dayLetters[0];
                    this.display.mode_1 = dayLetters[1];
                    this.display.day_2 = day > 9 ? day.toString().charAt(0) : " ";
                    this.display.day_1 = day.toString().slice(-1);
                    this.display.hour_2 = hours > 9 ? hours.toString().charAt(0) : " ";
                    this.display.hour_1 = hours.toString().slice(-1);
                    this.display.minute_2 = minutes > 9 ? minutes.toString().charAt(0) : 0;
                    this.display.minute_1 = minutes.toString().slice(-1);
                    this.display.second_2 = seconds > 9 ? seconds.toString().charAt(0) : 0;
                    this.display.second_1 = seconds.toString().slice(-1);
                } else if (this.activeAction === "casio") {
                    this.display.alarmOnMark = false;
                    this.display.timeSignalOnMark = false;
                    this.display.timeMode24 = false;
                    this.display.timeMode12 = false;
                    this.display.lap = false;
                    this.display.dots = false;
                    this.display.mode_2 = " ";
                    this.display.mode_1 = " ";
                    this.display.day_2 = " ";
                    this.display.day_1 = " ";
                    this.display.hour_2 = "C";
                    this.display.hour_1 = "A";
                    this.display.minute_2 = "S";
                    this.display.minute_1 = "I";
                    this.display.second_2 = "O";
                    this.display.second_1 = " ";
                }
            } else if (this.activeMenu === "dailyAlarm") {
                const hours = this.dailyAlarmDateTime.getHours();
                const minutes = this.dailyAlarmDateTime.getMinutes();

                this.display.alarmOnMark = this.alarmOnMark;
                this.display.timeSignalOnMark = this.timeSignalOnMark;
                this.display.timeMode24 = false;
                this.display.timeMode12 = false;
                this.display.lap = false;
                this.display.dots = true;
                this.display.mode_2 = "A";
                this.display.mode_1 = "L";
                this.display.day_2 = " ";
                this.display.day_1 = " ";
                this.display.hour_2 = hours > 9 ? hours.toString().charAt(0) : " ";
                this.display.hour_1 = hours.toString().slice(-1);
                this.display.minute_2 = minutes > 9 ? minutes.toString().charAt(0) : 0;
                this.display.minute_1 = minutes.toString().slice(-1);
                this.display.second_2 = " ";
                this.display.second_1 = " ";
                
                if (this.activeAction === "edit-hours" && this.getBlinkingState()) {
                    this.display.hour_2 = " ";
                    this.display.hour_1 = " ";
                } else if (this.activeAction === "edit-minutes" && this.getBlinkingState()) {
                    this.display.minute_2 = " ";
                    this.display.minute_1 = " ";
                }

            } else if (this.activeMenu === "stopwatch") {
                let currentStopwatchDateTime = null;
                // If the stopwatch already has a saved lap time (the stopwatch is already running).
                if (this.stopwatchDateTimeSplit) {
                    // Gets the saved lap date time.
                    currentStopwatchDateTime = this.stopwatchDateTimeSplit;
                } // If the stopwatch is running or not.
                else {
                    // Gets the stopwatch date time.
                    currentStopwatchDateTime = this.stopwatchDateTime;
                }
                const minutes = currentStopwatchDateTime.getMinutes();
                const seconds = currentStopwatchDateTime.getSeconds();
                let milliseconds = currentStopwatchDateTime.getMilliseconds();
                milliseconds = ("00" + milliseconds.toString()).slice(-3);

                this.display.alarmOnMark = this.alarmOnMark;
                this.display.timeSignalOnMark = this.timeSignalOnMark;
                this.display.timeMode24 = false;
                this.display.timeMode12 = false;
                this.display.lap = this.lap;
                this.display.dots = true;
                this.display.mode_2 = "S";
                this.display.mode_1 = "T";
                this.display.day_2 = " ";
                this.display.day_1 = " ";
                this.display.hour_2 = minutes > 9 ? minutes.toString().charAt(0) : " ";
                this.display.hour_1 = minutes.toString().slice(-1);
                this.display.minute_2 = seconds > 9 ? seconds.toString().charAt(0) : 0;
                this.display.minute_1 = seconds.toString().slice(-1);
                this.display.second_2 = milliseconds.charAt(0);
                this.display.second_1 = milliseconds.charAt(1);
            } else if (this.activeMenu === "setDateTime") {
                // Sets the default screen of the current menu.
                let dayLetters = this.dateTime.toLocaleDateString("en-US", {weekday: 'long'}).slice(0, 2).toUpperCase();
                const day = this.dateTime.getDate();
                let hours = this.dateTime.getHours();
                hours = this.timeMode === "12" && hours > 12 ? hours - 12 : hours;
                const minutes = this.dateTime.getMinutes();
                const seconds = this.dateTime.getSeconds();

                this.display.alarmOnMark = this.alarmOnMark;
                this.display.timeSignalOnMark = this.timeSignalOnMark;
                this.display.timeMode24 = this.timeMode === "24";
                this.display.timeMode12 = this.timeMode === "12";
                this.display.lap = false;
                this.display.mode_2 = dayLetters[0];
                this.display.mode_1 = dayLetters[1];
                this.display.day_2 = day > 9 ? day.toString().charAt(0) : " ";
                this.display.day_1 = day.toString().slice(-1);
                
                if (["edit-month", "edit-day-number", "edit-day-letter"].includes(this.activeAction)) {
                    const month = this.dateTime.getMonth() + 1;
                    this.display.dots = false;
                    this.display.hour_2 = month > 9 ? month.toString().charAt(0) : " ";
                    this.display.hour_1 = month.toString().slice(-1);
                    this.display.minute_2 = " ";
                    this.display.minute_1 = " ";
                    this.display.second_2 = " ";
                    this.display.second_1 = " ";
                } // For all other actions.
                else {
                    this.display.dots = true;
                    this.display.hour_2 = hours > 9 ? hours.toString().charAt(0) : " ";
                    this.display.hour_1 = hours.toString().slice(-1);
                    this.display.minute_2 = minutes > 9 ? minutes.toString().charAt(0) : 0;
                    this.display.minute_1 = minutes.toString().slice(-1);
                    this.display.second_2 = seconds > 9 ? seconds.toString().charAt(0) : 0;
                    this.display.second_1 = seconds.toString().slice(-1);
                }
                
                if (this.getBlinkingState()) {
                    if (this.activeAction === "default") {
                        this.display.second_2 = " ";
                        this.display.second_1 = " ";
                    } else if (this.activeAction === "edit-minutes") {
                        this.display.minute_2 = " ";
                        this.display.minute_1 = " ";
                    } else if (this.activeAction === "edit-hours") {
                        this.display.hour_2 = " ";
                        this.display.hour_1 = " ";
                    } else if (this.activeAction === "edit-month") {
                        this.display.hour_2 = " ";
                        this.display.hour_1 = " ";
                    } else if (this.activeAction === "edit-day-number") {
                        this.display.day_2 = " ";
                        this.display.day_1 = " ";
                    } else if (this.activeAction === "edit-day-letter") {
                        this.display.mode_2 = " ";
                        this.display.mode_1 = " ";
                    }
                }
            }

            // ######################
            // DIGITAL DISPLAY OUTPUT
            // ######################

            // Various display elements.
            this.digitalDisplay.displayScreen("alarmOnMark", this.display.alarmOnMark);
            this.digitalDisplay.displayScreen("timeSignalOnMark", this.display.timeSignalOnMark);
            this.digitalDisplay.displayScreen("timeMode24", this.display.timeMode24);
            this.digitalDisplay.displayScreen("timeMode12", this.display.timeMode12);
            this.digitalDisplay.displayScreen("lap", this.display.lap);
            this.digitalDisplay.displayScreen("dots", this.display.dots);
            this.digitalDisplay.displayScreen("light", this.display.light);
    
            // "mode" 9 and 8 segments displays.
            this.digitalDisplay.charToSegments("mode_2", this.display.mode_2);
            this.digitalDisplay.charToSegments("mode_1", this.display.mode_1);
    
            // "days" 7 segments displays.
            this.digitalDisplay.charToSegments("day_2", this.display.day_2);
            this.digitalDisplay.charToSegments("day_1", this.display.day_1);
    
            // "hours", "minutes" and "seconds" 7 segments displays.
            this.digitalDisplay.charToSegments("hour_2", this.display.hour_2);
            this.digitalDisplay.charToSegments("hour_1", this.display.hour_1);
            this.digitalDisplay.charToSegments("minute_2", this.display.minute_2);
            this.digitalDisplay.charToSegments("minute_1", this.display.minute_1);
            this.digitalDisplay.charToSegments("second_2", this.display.second_2);
            this.digitalDisplay.charToSegments("second_1", this.display.second_1);

        }, this.displayFrameRate);
    }

    /**
     * Operating system INPUT 1/3: button "L".
     * @param {boolean} isDown If the button's state is DOWN or UP.
     */
    buttonL(isDown) {

        if (this.activeMenu === "dateTime") {
            // No action here.
        } else if (this.activeMenu === "dailyAlarm") {
            if (isDown) {
                // If in default mode.
                if (this.activeAction === "default") {
                    this.alarmOnMark = true;
                    this.activeAction = "edit-hours";
                } // If in hour editing mode.
                else if (this.activeAction === "edit-hours") {
                    this.activeAction = "edit-minutes";
                } // If in minute editing mode.
                else if (this.activeAction === "edit-minutes") {
                    this.activeAction = "default";
                } else {
                    console.warn(`'activeAction': '${this.activeAction}' not supported.`);
                }
            }
        } else if (this.activeMenu === "stopwatch") {
            if (isDown) {
                // If the stopwatch is running.
                if (this.stopwatchInterval) {
                    // If the stopwatch has a saved split date time.
                    if (this.stopwatchDateTimeSplit) {
                        // Resets the saved split date time.
                        this.stopwatchDateTimeSplit = null;
                        this.lap = false;
                    } // If the stopwatch is running but doesn't have a saved split date time.
                    else {
                        // Saves the current stopwatch date time by cloning its Date object.
                        this.stopwatchDateTimeSplit = new Date(this.stopwatchDateTime);
                        this.lap = true;
                    }
                } // If the stopwatch is stopped.
                else {
                    // If the stopwatch already has a saved split date time.
                    if (this.stopwatchDateTimeSplit) {
                        // Clears the stopwatch saved split and it will display the current time where the stopwatch has stopped.
                        this.stopwatchDateTimeSplit = null;
                        this.lap = false;
                    } // If the stopwatch is stopped but doesn't have a saved split date time.
                    else {
                        // Resets the stopwatch date time.
                        this.stopwatchDateTime = new Date();
                        this.stopwatchDateTime.setMinutes(0);
                        this.stopwatchDateTime.setSeconds(0);
                        this.stopwatchDateTime.setMilliseconds(0);
                    }
                }
            }
        } else if (this.activeMenu === "setDateTime") {
            if (isDown) {
                // If in default mode (edit second).
                if (this.activeAction === "default") {
                    this.activeAction = "edit-minutes";
                } // If in minute editing mode.
                else if (this.activeAction === "edit-minutes") {
                    this.activeAction = "edit-hours";
                } // If in hour editing mode.
                else if (this.activeAction === "edit-hours") {
                    this.activeAction = "edit-month";
                } // If in month editing mode.
                else if (this.activeAction === "edit-month") {
                    this.activeAction = "edit-day-number";
                } // If in day number editing mode.
                else if (this.activeAction === "edit-day-number") {
                    this.activeAction = "default";
                    // this.activeAction = "edit-day-letter";
                } // If in day letter editing mode.
                // else if (this.activeAction === "edit-day-letter") {
                //     this.activeAction = "default";
                // }
                else {
                    console.warn(`'activeAction': '${this.activeAction}' not supported.`);
                }
            }
        }

        if (isDown) {
            this.light = true;
        } else {
            this.light = false;
        }
    }

    /**
     * Operating system INPUT 2/3: button "C".
     * @param {boolean} isDown If the button's state is DOWN or UP.
     */
    buttonC(isDown) {

        if (this.activeMenu === "dateTime") {
            if (isDown) {
                this.activeMenu = "dailyAlarm";
                this.activeAction = "default"; 
            }
        } else if (this.activeMenu === "dailyAlarm") {
            if (isDown) {
                this.activeMenu = "stopwatch";
                this.activeAction = "default";
            }
        } else if (this.activeMenu === "stopwatch") {
            if (isDown) {
                this.activeMenu = "setDateTime";
                this.activeAction = "default";
            }
        } else if (this.activeMenu === "setDateTime") {
            if (isDown) {
                this.activeMenu = "dateTime";
                this.activeAction = "default";
            }
        }

        if (isDown) {
            this.playBip();
        }
    }

    /**
     * Operating system INPUT 3/3: button "A".
     * @param {boolean} isDown If the button's state is DOWN or UP.
     */
    buttonA(isDown) {

        if (this.activeMenu === "dateTime") {
            if (isDown) {
                // If button pressed for 3 seconds, display "CA510" on the screen.
                this.buttonInterval = setTimeout(() => {
                    // Sets the new active screen.
                    this.activeAction = "casio";
                    // When the button is clicked, it changes the time mode.
                    // Here, we do not want to change it since we only wanted to display "CA510".
                    // So we'll change the time mode here, so it'll be changed again on button release.
                    this.timeMode = this.timeMode === "24" ? "12" : "24";  
                }, 3000);
            } else {
                // If button is released, clears the timeout.
                clearTimeout(this.buttonInterval);
                // Returns to the default screen.
                this.activeAction = "default";
                // Sets the new time mode.
                this.timeMode = this.timeMode === "24" ? "12" : "24";  
            }
        } else if (this.activeMenu === "dailyAlarm") {
            // If in default mode.
            if (this.activeAction === "default") {
                if (isDown) {
                    if (this.alarmOnMark && this.timeSignalOnMark) {
                        this.alarmOnMark = false;
                        this.timeSignalOnMark = false;
                    } else if (this.alarmOnMark) {
                        this.alarmOnMark = false;
                        this.timeSignalOnMark = true;
                    } else if (this.timeSignalOnMark) {
                        this.alarmOnMark = true;
                        this.timeSignalOnMark = true;
                    } else {
                        this.alarmOnMark = true;
                        this.timeSignalOnMark = false;
                    }
                    this.playBip();
                }
            } // If in editing mode.
            else if (["edit-hours", "edit-minutes"].includes(this.activeAction)) {
                /**
                 * Increments the hours or minutes.
                 */
                const increment = () => {
                    if (this.activeAction === "edit-hours") {
                        this.dailyAlarmDateTime.setHours(this.dailyAlarmDateTime.getHours() + 1);
                    } else if (this.activeAction === "edit-minutes") {
                        this.dailyAlarmDateTime.setMinutes(this.dailyAlarmDateTime.getMinutes() + 1);
                    }
                }
                
                // When button is down, increment the hours/minutes.
                if (isDown) {
                    increment();
                    this.buttonTimeout = setTimeout(() => {
                        increment();
                        this.buttonInterval = setInterval(() => {
                            increment();
                        }, 100);
                    }, 1000);
                } // When button is up, stop incrementing the hours/minutes.
                else {
                    clearTimeout(this.buttonTimeout);
                    clearInterval(this.buttonInterval);
                }
            }
        } else if (this.activeMenu === "stopwatch") {
            if (isDown) {
                // If the stopwatch is running.
                if (this.stopwatchInterval) {
                    // Stops the stopwatch and resets its interval object.
                    clearInterval(this.stopwatchInterval);
                    this.stopwatchInterval = null;
                } // If the stopwatch is stopped.
                else {
                    // Starts the stopwatch.
                    // TODO: instead of incrementing it an interval, increment it just like `dateTime` object (in the fake system clock + with an offset).
                    this.stopwatchInterval = setInterval(() => {
                        this.stopwatchDateTime.setMilliseconds(this.stopwatchDateTime.getMilliseconds() + 10);
                    }, 10);
                }
                this.playBip();
            }
        } else if (this.activeMenu === "setDateTime") {
            /**
             * Increments the seconds, minutes, hours, month, date, day.
             */
            const increment = () => {
                // Creates a copy of the dateTime object.
                let dateCopy = new Date(this.dateTime);
                if (this.activeAction === "default") {
                    dateCopy.setSeconds(dateCopy.getSeconds() + 1);
                } else if (this.activeAction === "edit-minutes") {
                    dateCopy.setMinutes(dateCopy.getMinutes() + 1);
                } else if (this.activeAction === "edit-hours") {
                    dateCopy.setHours(dateCopy.getHours() + 1);
                } else if (this.activeAction === "edit-month") {
                    dateCopy.setMonth(dateCopy.getMonth() + 1);
                } else if (this.activeAction === "edit-day-number") {
                    dateCopy.setDate(dateCopy.getDate() + 1);
                }
                // else if (this.activeAction === "edit-day-letter") {
                //     // TODO: solve the day letter problem (since date is related to the system, we cannot set a date AND a day...)
                // }
                // Once the new dateTime object is updated, compares the timestamp difference
                // with the original dateTime object, then updates the dateTimeOffset.
                this.dateTimeOffset -= this.dateTime.getTime() - dateCopy.getTime();
            }
            
            // When button is down, increment the hours/minutes.
            if (isDown) {
                increment();
                this.buttonTimeout = setTimeout(() => {
                    increment();
                    this.buttonInterval = setInterval(() => {
                        increment();
                    }, 100);
                }, 1000);
            } // When button is up, stop incrementing the hours/minutes.
            else {
                clearTimeout(this.buttonTimeout);
                clearInterval(this.buttonInterval);
            }
        }
    }

    /**
     * This method is quite particular. It returns a boolean depending on the date time of the watch.
     * This boolean is used to make display elements blink when needed. Ex: hours and minutes when setting the alarm.
     * Every fourth of a second, the element will hide, then reappear. So, it blinks every half a second.
     * @returns {boolean}
     */
    getBlinkingState() {
        let isDisplayed;
        const milliseconds = this.dateTime.getMilliseconds();

        if (milliseconds < 250) {
            isDisplayed = false;
        } else if (milliseconds < 500) {
            isDisplayed = true;
        } else if (milliseconds < 750) {
            isDisplayed = false;
        } else {
            isDisplayed = true;
        }

        return isDisplayed;
    }

    /**
     * Plays the "bip" sound.
     */
    playBip() {
        this.bip.pause(); // Pauses the current sound if it is currently playing.
        this.bip.currentTime = 0; // Resets it's time to 0.
        this.bip.play(); // Plays the sound.
    }
}


Global structure

```javascript
// System clock
while (true) {
    Increment current dateTime
}

// Screen refresh rate
while (true) {

    if (menu === "dateTime") {
        this.display.lap = false;
        if (screen === "default") {
            this.display.alarm = this.alarm;
            this.display.signal = this.signal;
            this.display.timeMode24 = this.timeMode24;
            this.display.timeMode12 = this.timeMode12;
            this.display.dayLetters
            this.display.day
            this.display.hours
            this.display.minutes
            this.display.seconds
        } else if (screen === "casio") {
            this.display.alarm = false;
            this.display.signal = false;
            this.display.timeMode24 = false;
            this.display.timeMode12 = false;
            this.display.dayLetters = " ";
            this.display.day = " ";
            this.display.hours = "CA";
            this.display.minutes = 51;
            this.display.seconds = 0;
        }
    } else if (menu === "alarm") {
        if (screen === "default") {

        }
    }


    // Output all display variables
    output(lap)
    output(day_2)
    output(day_1)
    output(hour_2)
    output(hour_1)
    output(minute_2)
    output(minute_1)
    output(second_2)
    output(second_1)
}
```

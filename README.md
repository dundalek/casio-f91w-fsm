# Casio F-91W

> [Try it here! alexisphilip.fr/demo/Casio-F-91W](https://alexisphilip.fr/demo/Casio-F-91W)

The legendary F-91W now has its online version, and it's fully functional. Have fun 🙂

## Why?

I love my Casio F-91W. Its simplicity, toughness, long-lasting battery life. It makes it special to me.

I have been wearing it for years now. But when **I realized no one bothered to make an online version of it** (*in case you forgot yours at home*), I decided to go on with this project and make it myself.

## How I made it

First, I took a close-up photo of my F-91W.

![](images/casio-original.JPG)

Then, I contoured and created all the shapes in Adobe Illustrator.

By this, I mean all the elements of the watch, e.i.:

- the 7, 8 and 9 segments displays
- the case, the outlines
- the texts
- etc...

> Thanks to other close-up photos online, I managed to draw the rest of the element which weren't on my close-up photo.

![](images/casio-svg-on-original.PNG)

Then, I colored all the elements. You can see below all of the elements which make up the digital display.

![](images/casio-svg-final.PNG)

The next step is to make **identifiable** all of the elements you want to interact with. **The goal is to manually display/hide each segments/elements on the display with JavaScript** to simulate the watch display's behavior.

Below is an example of a tree structure of SVG elements. I assigned them IDs so I can select them in JavaScript.

```text
seconds            - The "seconds" group of elements.
    second_1       - The "unit" 7 segment display.
        second_1_A - The A segment of the 7 segment display.
        second_1_B - The B segment of the 7 segment display.
        ...
    second_2       - The "tenth" 7 segment display.
        ...
minutes            - The "minutes" group of...
    ...
```

Here is how the "**second**" **unit** display (not **tenth** display) looks in Adobe Illustrator.

![](images/casio-unique-id.PNG)

Then I exported the SVG to interact with it in JS.

> The whole code is available for you in the `demo` repository.

## Code philosophy

I coded it with the same approach as you would in C/C++ microcontroller programming. Back in 1989 and still to this day, the Casio F-91W operating system is programmed on a small microcontroller, which has an internal clock, 3 inputs (3 buttons) and 1 output (the digital display). I programmed it with the same straightforward approach.

There are 3 JavaScript classes:

- `CasioF91W` manages the Casio F-91W inputs. I see this as the *case* of the watch: you can touch it, press the buttons, etc. This class is used to instantiate the watch.
- `CasioF91WOperatingSystem` is the Casio's operating system. Programmed with a simple straightforward approach: 3 inputs (3 button) triggered by the `Casio91W` class, and 1 output (digital display) given to the `CasioF91WDigitalDisplay` class to display the elements.
- `CasioF91WDigitalDisplay` is the Casio's digital display. It is given a boolean to display or not each single elements of the display: segments of the 7, 8 or 9 segments displays, icons, backlight, etc.

The whole JavaScript operating system instructions are running in a `setInterval` function, which simulates the original C/C++ program's main loop.

The problem with JavaScript's `setInterval` function, is that its frequency (execution rate) varies because of the program's interpretation time. On the original watch, the **internal date time is calculated on the system's clock**, which has a constant frequency. Therefore, I couldn't use `setInterval` function to simulate the watch's date time, alarm and stopwatch since it's not accurate.

To solve this problem, I used JavaScript's `Date()` class, which itself is based of the operating system's clock, so it is very precise. On every execution loop, I get the current machine's time with `Date()`, so it's always precise. To allow the user to set a custom date time, I store their wished date time into as offset variable, which I add to the `Date()` object.

With this approach, I programmed the Casio F-91W with multiples layers (watch case, operating system, digital display) so it *looks* like the orignal program inside the watch.

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/) - see the LICENSE.md file for details.

## Author

Alexis Philip ([Website](https://alexisphilip.fr)).

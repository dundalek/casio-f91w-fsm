# Casio F-91W using Statecharts

> Online demo here: **[casio-f91w.pages.dev](https://casio-f91w.pages.dev)**

Interactive model of the Casio F-91W watch using statecharts.

## Intro

[Statecharts](https://statecharts.dev) are an extension of state machines, introduced by David Harel in 1987.
In the [paper](https://www.wisdom.weizmann.ac.il/~harel/papers/Statecharts.pdf), Harel used a digital wristwatch as an example model.

I always thought it would be great to have an interactive demo that allows to see statecharts in action.
Unfortunately, that particular wristwatch (Citizen Quartz Multi-Alarm III) is now a rarity.

However, there is the iconic [Casio F-91W](https://en.wikipedia.org/wiki/Casio_F-91W), which despite being introduced only two years after the paper was published, remains widely popular and is still manufactured and sold today.
Alexis Philip created an [online version](https://github.com/alexisphilip/Casio-F-91W) digitizing the graphical elements.

This [demo](https://casio-f91w.pages.dev) builds on Alexis' work, demonstrates using statecharts by replacing the logic using the [XState](https://xstate.js.org/) library, and uses the Stately visualizer to show states and transitions side by side for educational purposes. You can also check out the official manual [official manual](https://support.casio.com/storage/en/manual/pdf/EN/009/qw593.pdf) for the watch.

[![Casio F-91W Statecharts Demo](images/statecharts-demo.png)](https://casio-f91w.pages.dev)

## Differences & limitations

- Setting date and time is slightly different since it is represented using the builtin JavaScript Date object. Setting the day of week is therefore not used in the demo.
- You can set daily alarm time, but actual triggering the alarm is not implemented.

## Implementation

File structure:

- [demo/script](demo/script) the original implementation, only the code for rendering is used
- [src/casio/machine.js](src/casio/machine.js) the XState machine definition
- [src/casio/app.cljs](src/casio/app.cljs) code that runs the machine

import { createMachine } from "xstate";

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwLYEMBOAXA7mrAxgBYB0E+YAKgJYpgDEBAtBAPY4B2A2gAwC6iUAAdWsalmqsOgkAA9EADgDMCkgBYATAEYFATh57dmgGwKANCACeiNQHYArCS33jGhRqXOvugL4+LqJi4+MRkFDR0ZGAAZmgArgA2WPRoLOzc-DIiYhJSMvIIGjy6JDxlPPb2ajxKSrq69koW1gj2biQK9jy2PMYqrsZavv4ggdh4hKTkWFS0YCQAEqwJENQcUClMcUK8Akgg2eKS0vsFHjwkLhpV1xq2urbu9s02jyRKXaZGSmrGPBpGPwBdDjEJTcJzRbLVbreiyWBYCgkNDRGYYAAUSnKAEp6GNgpMwjMIvMlis1lBdllREc8qdEJVbCRbD81GobkoHGoXgg1A1mcYWV17nZbIMgaMQQTQtNZpECGgxKxNtsqftDrkTqACvYFGp3lpbt1dB4+TyPhd7FoWbYtJ5qg4tBL8RMZWhqAlLABBBKYFCMNKcNXCGma-KIWwaHn6C4KdwPK56YyNZ1S13gj3e30Yf2pNhBzLq0PHcOFLTWkiC60qSOaBTGHlaTSlcqGv5VVwKWypoLpsKZn1+qKxRLJBKBjJ7EM5Ev0hDlptOap-MX1obmKwMmqV+6RhRlNRxx490GE8gD7MoEiQcRMIisOIYWD0cf5yfUmd07WIZwGDpqTlqncf5yyjTdWlqSsXCxZQ+W0FwT2lDNPUHHNr1WLA7wfJ9NjfYMDmLL85B-LEmQA2w7EGXRTCxBtwIApQSCKTwrSUIp6gURC+3PFDL3Q28UDWOIZmfV90nwjVZ2-eculUPVAIMIptENc1DXURpDR4ao3DaaiuLBfteKHG9MMEjhhLgXDxMLadaS1Yj50GJkFENNlNMeO1bB5ADHB6TxqKKK4Gn0wkEVYIR0wDPCbIIz97IKTkNGZHRbUFetbFtJpwJjDp3DjXV7Aef5jBC0JYDALAABEIToKLrKnWK7NLZRVE0HR9EMEwNxaFz1HqeoXEafdqjUUrSHKqqavmCAYniJIXwnCTCPixA3AuNj9xc4w-mcSNGz5fUDCcuM6muKoxpICbquJSEZpHea83qj8mrnB5GxURwqiK3o7QeDQLquqb+NMoSRIW6KGskoidWokhdEAtihjZSpnnA38tHeJRBj0JtGhqbsRhdAzAZuyITKYMyLOfR6C0h5bSxUEoATSopRUK1GWibMpcqxKpKiMf4AYq665Xmcn70fUTFpiqGVoQfQMZNa1dJch5up-WTLjXep2TtNohcm0mxYwrDJas2nnrDOcekcfRBjY3VAvufa-ztWjD2TdkagNkWSWBimpCwIhwaeos4tLTTVFcOxqO6DRXC0RsrUcZRXGKBwKIPH2gfJlBA+Dmn3zDl7pK0Hgy46fR2VqYwGmG-bnHeZRuitW0+XrbOjf98hLCYcyUAAIzADAQ4t4urdLooo40GOV3j7RGzWpxan+LG1ENFxOMJtNieFnOTZ7vu4kH4fzaL2yJ4cu0iiY+wMt1rE2yyzn1+c5vHTb3QO4lDhWBm+B9hE0mJbKSDkmAzx5EwYwLZyiwNgU2C6soSQgOhqtbk4F46MXLkKZQPRnApm3r2AySDbqzVHCguWe1wJYwuMYTQKhyyuE3gTYERCzxAzJDCKAFCGZ3B3EjHoZRdBDDAi0OwGN442lfvDM6o1CGnjdF3BUSoeFzlMBjNqJo2jJjcPUc0hUnBlFSu4NeCZEHuiMjmVR0l4YlC5nQwKRR7Y8g0DPOGGkZ4USrnocxF4hx3TmlgaxDkv5MnsZoCoTi7Q8itHJVx1F4bJjYiaXxlirzi2wgAi+oCCh2mbF-ACX9CqGDoTEn4Tgrh9F+OyPU-15FIUMlmYyJtKYiWCbk5MFxHgxhqOWOMXYynQOTH0AwPwlaVABlgcK6Z2k-kjMlLsVpnCYLZF5cCyhGJ9DcNUJseoWTDFYQo8aUyIrELIUkWZhQb62kWeWbRrI1ktCVsvAELEejwztJ3UWlyzRoxEZWZJ8MHSuIQfUvsJNRbDkCZcw0TJto7M8G4TkJ19r1kuP8ZQVoOI2i+X7XOoM4A-KGJcR4vRTp2A+I8jW5cOhY3arjLEnJcWQgyZLS5LJVAZxZG4WsQKk7FFKNrIwrF9Zgt3obSFud84wq0klcuVRPDbWtPuKlMktDQJruxDO1QtLMrJgfNAvd+5DwwDCtiSVCpYwcNiw8qqvBySxlqu+Oq5F+CAA */
  id: "smartwatch",
  initial: "dateTime",
  states: {
    dateTime: {
      initial: "default",
      states: {
        default: {
          on: {
            "a-down": {
              target: "Holding",
            },
          },
        },
        Holding: {
          entry: "toggleTimeMode",
          after: {
            "3000": "casio",
          },
          on: {
            "a-up": {
              target: "default",
            },
          },
        },
        casio: {
          on: {
            "a-up": {
              target: "default",
            },
          },
        },
      },
      on: {
        "c-down": {
          target: "dailyAlarm",
          actions: "playBip",
        },
      },
    },
    dailyAlarm: {
      initial: "default",
      states: {
        default: {
          on: {
            "l-down": {
              target: "edit-hours",
              actions: "enableAlarmOnMark",
            },
          },
        },
        "edit-hours": {
          on: {
            "l-down": {
              target: "edit-minutes",
            },
            "a-down": {
              actions: "incrementAlarmHours",
            },
          },
        },
        "edit-minutes": {
          on: {
            "l-down": {
              target: "default",
            },
            "a-down": {
              actions: "incrementAlarmMinutes",
            },
          },
        },
      },
      on: {
        "c-down": {
          target: "stopwatch",
          actions: "playBip",
        },
        "a-down": {
          actions: ["toggleAlarmMode", "playBip"],
        },
      },
    },
    stopwatch: {
      initial: "default",
      states: {
        default: {
          on: {
            "a-down": { actions: ["toggleStopwatch", "playBip"] },
            "l-down": { actions: "toggleSplitOrClearStopwatch" },
          }
        },
      },
      on: {
        "c-down": {
          target: "setDateTime",
          actions: "playBip",
        },
      },
    },
    setDateTime: {
      initial: "default",
      states: {
        default: {
          on: {
            "l-down": {
              target: "edit-minutes",
            },
            "a-down": { actions: "resetTimeSeconds" },
          },
        },
        "edit-minutes": {
          on: {
            "l-down": {
              target: "edit-hours",
            },
            "a-down": { actions: "incrementTimeMinutes" },
          },
        },
        "edit-hours": {
          on: {
            "l-down": {
              target: "edit-month",
            },
            "a-down": { actions: "incrementTimeHours" },
          },
        },
        "edit-month": {
          on: {
            "l-down": {
              target: "edit-day-number",
            },
            "a-down": { actions: "incrementDateMonth" },
          },
        },
        "edit-day-number": {
          on: {
            "l-down": {
              target: "default",
            },
            "a-down": { actions: "incrementDateDay" },
          },
        },
      },
      on: {
        "c-down": {
          target: "dateTime",
          actions: "playBip",
        },
      },
    },
  },
});

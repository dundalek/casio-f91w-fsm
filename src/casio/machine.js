import { createMachine } from "xstate";

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwLYEMBOAXA7mrAxgBYB0E+YAKgJYpgDEBAtBAPY4B2A2gAwC6iUAAdWsalmqsOgkAA9EADgCcAJhIB2JQDYV6lQGYeCgKxKANCACeidQEYlJACyPjt4yu1L1jnkoC+fhaomLj4xGQUNHRkYABmaACuADZY9Ggs7Nz8MiJiElIy8ggqtrZO3r48Ppr6CipaFtYIxvqOTnVaqsZVdsYBQejYeISk5FhUtGAkABKsSRDUHFBpTAlCvAJIILniktJbRQb6JMamWjzGCo6t+kpK+o2IjgrHVQpXjlrGn6ZKjv0gYJDMKjSKTGZzBZLeiyWBYCgkNCxcYYAAUhh4PAAlPQgaERhFxlEprN5osoBscqJdgUDohjFp1Cd1MZ1HVSrZ9AzbI9mpiSFcWbclAo9JcVP9AoDBvjwmMJtEAMJoMSsFZrSlbHb5fagIqmNqaEwKN6uNwKXlctruRwqEpWnz1SUDELDOVoahJSwAQSSmBQjAynE1wmpOsKii0ZUuRkZHnUWh06l5thcDnUPHqXOU3ij+gBeLdoM9Pr9GAD6TYweyWrDewjCFsRmMJH0Uajzy0+gTSmMvMTxxZTZ4XO+3btBZlRYiJd9-pi8WSqSSQaym1DeXrdMbopId066k0SlsUZZjhTPFsTNs73e3ZcwoUk9dIJnXrn5ZIkHETCIrASGCwPQK5VmuVKbrSer0serYjhmnQXFGXgXo4TKikcdS2nU6j5lKhavuQs5ligX4LFgv7-oBKygSG2x1pBcj0vUe7dl4bEuPUKgpjexzXCopz2BKbJaE+eFTgRHrvsRpE-igiwJOMQEgZktHaluUHNDBhjdjwCHcshViILYHg8CQBhuPoTYKMZeiiS6wIEoRUnzt+5FyRwClwNRKk1huNK6oxCBKLpe4tKodRVL4mgXhmJyeLajj3EezrSi+BJwqwQhFoGNG+XREEBUUChRicJrFXoXiJroKZaD4ZnXBxfz6LUKjPg54SwGAWAACJgnQOU+eu+X+Q2xmciQnI2YyPjOAZTT1FoJCMt0tS3PUxlcm1sqkJ1PV9VMEBxIkKTAauqn0YViAlAoE2crVdy6KmXwPIZO4lZyLycs8tS1X0YlpR1XW9US4KuUw7meUpZ15WpDFFM8bQ+L4Y3hayyavTe72rV9LzFS4W3TrtwMKlMYN-gBUO5UNsOXQgOHHK4lzFZiCaWejTSY2UH2Wa0uO-QTr5E-tMluVIWBEKdVPgSN24iky4U3rouiXCyKbFVz2O8z9+P-e1O1A8LYPkJYTAeSgABGYAYJLg3S+G26lIY5Tfb2nwmJ0Kb3A4nYZseFzWdcARShwrCHfAWz4SMdvqYFTDduUdjGY4J76CoulfCmmgTSycH2D97wC45+3R3DV3nq99RMpmtpp24DKmDw6iF+6IPRIdi4pCXtN6JatUCh0LyWZ0J4pZHLckxCZJLF3DbNWoycmt0rJ3pyvKoS23ilBxmjXJmzegq3UzKqqM-bp0xxfBm-F2hcjdca9bbHFm9i-OcbJ-fZ21vqW-qnxpTYnDtO8FkLxGT3C5LyVQDgRK3n4p8L4tV97fw-CRdux0sB-0CpcQBKhgGXDbDUCBGMRxqD0IeO0HhcFGCbrrL+Tkf6fjJpRcOfl7YaVtGUYKXYvBsntJcPsxDnitj0M1TCuDdC4U-tOehKCRbg3kopTBRQcKLTTiJO4yNbjsyMrfAUIiWpYQkUgjKWUQRKMQL2DQx5lAkO0Bcb4KZbSmUPFeNswUqiMmMVgTK0ijpLnMY2a4VibzBVTnY045cOauBunYIwuDnDfBPFoYxBtD4BLqtw04vZBJxIaBjFkLZPjVwqiI-wtDCapInmg-xtYCoNneEtW4WTXCqFyWrForY7iiKuNdYqKS9qHzkRDRRtSZYaWam0CUkVfZtg8KhNWJUuyfS1njD+qU9YkCFoMphFMAnnFMu4BM59TCtAuAssoSyebfVWf04mxIhliyIAEq40DbS1TZsnVMAiObq0acs65-NymC0qfco2aATZm0thgAJpQqgkAuIlW4yhqhnIxiYFsyhwHvA4e8ZJQcgA */
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
        },
        "a-down": {
          actions: "toggleAlarmMode",
        },
      },
    },
    stopwatch: {
      initial: "default",
      states: {
        default: {},
      },
      on: {
        "c-down": {
          target: "setDateTime",
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
          },
        },
        "edit-minutes": {
          on: {
            "l-down": {
              target: "edit-hours",
            },
          },
        },
        "edit-hours": {
          on: {
            "l-down": {
              target: "edit-month",
            },
          },
        },
        "edit-month": {
          on: {
            "l-down": {
              target: "edit-day-number",
            },
          },
        },
        "edit-day-number": {
          on: {
            "l-down": {
              target: "default",
            },
          },
        },
      },
      on: {
        "c-down": {
          target: "dateTime",
        },
      },
    },
  },
});

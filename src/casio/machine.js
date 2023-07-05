import { createMachine } from "xstate";

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCcBGA7gOkwQwBcBjAC2wkLABUBLAWzAGIiBaCAe0wDsBtABgC6iUAAd2sGgRrsuwkAA9EADgBsS7ABYATFvQB2JXyUBmVKiV6ANCACeiFcfTZjAVlTG9GvRj6o+egF8A6zQsXEJSckpaBnIwZDwAVwAbAkY8Nk5eQTkxCSkZOUUELVNsPgq+FQ0qlxd9dGs7BD1-bAM+YyV0dFQa81QgkIwcfGIyCgJqejBsAAl2ZIgaLih0lkSRfiEkEDzJaVld4q0VPmwXFS0Ncy09PRU3FSb7Fz1sLUMPFRU9N7+VEMQKFRhEJtEZvNFstVox5LACJRsHhkFMAE4ACmMlQAlIwQeFxlEpjFZgslisoNtcuIDoVjogXBZ2sYNHU+qgtBUbi8EL8NNgVKhWto+F50EpzECCWNIpNprEiHgJOx1ptqbt9gUjqBiip0ALHKcNEpDD9flpeS4tKhNF4+C5TL0rr5pSNCXK8DRkjYAILJPBoujMTLcDWiWnaoqICWoFzYdCXPRc7zGH51K2-doaM6cpl9VqDYLA92y8Hev0BoPrDhhnKayOHaMIdA-LTZn5pzo9Yy8m0CryPH5x3zWpRusJlqIV-2BuhxBIpNLJUPZHYR-JNhktg3qNmshym3fmXlqdu5771JRvLQuCegokUGdV+eQSQsEjsRJo2CMFe1tcaU3eldRjFwNGMBNLjca4-BcMVeT0dB2yZNxHE5E14MCYsZTBacfVnINsDfAgPy-H8ayycM9kbECFBjVknD+Tp-n0AwTFPZCE2MT5SlUVl4PHHDSzwp8CJfYjllIugVkSKZf3-Kj6w3OkdXoltwMgxNHgwuCENsRAbicLpeNbMVPgwe8PXLcS50k98ZK4OS4Eout1xo4C1OKVtrQTW8NG0dAHQqW9OIFBxeK6Bw2SMKypwRdgRDLEMAOorUt1AhBTHOCx4PtALXE6KwDJbPjnFNB0dCUU5PA0OK8ISpLRPiJJUlcwCG085tEycJQIL0HjJQeILE15ZDHkFLp-Gq6rTCZeqiUaqcIBapc-1XNLaK8mN9DG1tbTUG5rXcIwhOGScGrAAgABEIQYFKlPc9K6OKbReW6TQzC+4UHGMbEtAWyJYCu26SUhFbFzaxS3KA1Tm2Td5Sn6g99TjYrmnQRwBT4bTsQNE0LDq4SLsWkG7tmCHWrSDJUuUjy4e3TTsD8K41HuCKczGrl4y8DBB0dG5fkBshgZu8n7Ok2T5PW2mnq27qxUgvquiZBxc06MaeKcU5LlvTG2SFYxhewUXQYVWYSJYRznN-GnHthqNtxMFQPk6HRsTNPpLRK5CuWwbo9daAb9sBYmHyBsmwdiS3P2-BSNrp57tpbVl1BmiDqqC1AIs1z4Lm0rlkO0eoAbD6yTcj82JbIuP2s2rrtx6XyA9aar4KZCwubzqo9a5K5r0TY3TfFy26BkAgSBl+3OoZzKfPjR155tbFtGeH2-vjB5Lh6zH3D+ofK9Jaux64Ce68T+XG7Zd5vGTCw25zCUudcZxkKwyrHVZA+xaji2pLYPANgWBOToAAIzAGiKeMMZ6Ozno8Bejh4HL3MmvDGQVzg93qCaA0FR7jfzNkfS2FAgEgPAZAu20CVKwPUvoLMrY2QaB6P4Cou0falHeAHfqkoUx8FLudHAyQaBQBIAQbAMh1rqgvg3OeH1s5eE8D0bwcYfhjV+C7B0AUjD6k+I6KygjhGiPYMgZAUCOpUIyjQs4mheGFyZDcO4+kMbJhdnUAKmN3G0KNkCLg7AVrwF2CCB2FjigsCuBcYUqhriGDcLg3kLB3CfW+h4dxNxhZBJeogUJcT4zfWzpKHqnJQ78PLvKUk6Tk7gV5G45m+U2RwTZKcY2pTwarVSOUhW3tmiOltDeMU1QxQGg8E08W5IYRQHaduVw7xfjOlTgWRhp54IJmFA6fUBgDC3mGb-bASoVQTMykhJw2hdA4IlNg1BjIujlGxKYOMPE-h8JLCTT0z45z7PUsKSC+5bndDcHfKpnR-YzV9g8zGdRhmvKIpTJc7zvK8KOZ-MwvzhSfFPMKdo1o3jCjjMvbCxTlpelskRGO5F-HmIySne4HxhT6A7svDQiFMblGvByXQgtqgQqJa+f+1t5KwpjGoeMI1zBGBTKYXsJUkILxZfYg02cOVl3igQRKZZ+V8lQGNUVCY+ruCRUKM4jzcKLWVU1R8rSCBqrYszDwRkTR9FbA4TWCSxQQV6GYCUvt8HkzVUdZmPc2YPB4pzH2OMUJXEdGKfwHhJReu2dCtpMDgmMk8BcVoFlTrwVbJrKomgeJ3GxMFZCXj8WXR-lXUeUs4BqtUC7E0AUag6GxQNXOTEhzaHbYKw1IlSZlsIf-WOP5LUSnjD8bQngKjKIZevG05RcYKIgjM2N5aeXjxIJagmzMdCnG3aYAwms0wfCHEGyNqTFWloIZCIhgDgGJDARAy1DwekVDyn4P4Cz15XK3pcINrhrxnSeQIoRIi1UsANOEgwVwTQOj8FUdGYFTQXHAu2vuOgibFP0SIsRakk7NjuIaJCDoehmGLhmH2h1Jr3FXmYa4nQ9FAcMcYtVf1rG6A8PUPovh3CqOqtxe4jh9CwQVUEIAA */
  id: "f91w",
  type: "parallel",
  states: {
    watch: {
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
    },
    light: {
      initial: "off",
      states: {
        on: { on: { "l-up": "off" } },
        off: { on: { "l-down": "on" } }
      },
    },
  },
});

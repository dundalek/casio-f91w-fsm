import { createMachine } from "xstate";

// Note: State names need to be string keys wrapped in quotes otherwise advanced closure compiler optimizations will mangle them.
export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCcBGA7gOkwQwBcBjAC2wkLABUBLAWzAGIiBaCAe0wDsBtABgC6iUAAd2sGgRrsuwkAA9EAZgBMADj7Z1qVQBYMSvgDYA7AFYANCACeiE0qPZ0Zo+lQmTrtSZVGAvn5WaFi4hKTklLQM5GDIeACuADYEjHhsnLyCcmISUjJyigi+Zppqpir6JqhGKuhqVrYIaugq2GYe6Ca6hu6oqLoBQRg4+MRkFATU9GDYABLsiRA0XFCpLPEi-EJIIDmS0rI7hb4+2Loq1WXofGrdZroNdjXYfB1GN-q6fEpqgyDBIzC40i0zmCyWK0Y8lgBEo2DwyEmACcABSGPh8ACUjABoTGEUmURm80WyygW2y4n2+SOiAufWw73QRjMvn0OiUDxsdiqZx0ahcRgwKhK6D+uNG4QmU2iRDwEnYaw2FJ2ezyh1AhUMvicVXMIuqGGqjwQRk5Wm6Gma3RUKgc4uGeKleBoiWsAEFEngkXRmOluCrRFT1QVlOpNNo9AZjOYTc5NH0+jVOV0TK9-IF-o7JcDXR6vT6YnEkilEv7Mtsg7kDqGEEozA3sKpvmZvBclFUTWZUJpTKhu5z698yg6QjmInnPd66EWEsk1hwA1lVcGa7S6w2zE2VC22zpO9yELo6ozup0TC0+LauqPAfiKJOCzOILE5ylWIuK5TqzTNYg1CoJr9L2GKuF0V72LoJi3k6uZulOhZ0OwSzIDQkCMGWn6Brsq6-goyioCoJgvAKHg6KY9hKEoJq6FBWjfHwPaoGUqhmGKmYSkCE7wU+2BIShaEQAuGTYWqa5-nWXRqIynS1GYSidD2domlRujYMBxh8IpHauEoMHjg+PHTtgkCSCwJDsPESKwBh5aibhGr4UeqjoNgJhqGofSMbophlCaulnMYzhpj4hjoOxQxjlxhn5sZpkEOZlnWcJS6VjhP6OYUx47k2AFmt2LgikYXYtOp8laWaHY-Fe+nRS6RmFvFLB0Ms8STDZmEicuVbUpliA2q57meUxPnucVh6qI4ujlbcRUtD4tX3vVsWNUsCUtVwbVwClX4rhlta0YYbntCy-TucxgGHmxW7TaoO6MQ4tQDBx2ZcTC7AiDmfpYd16W9bWHRuey7y2p0+gmvYW53Wohg+RgLK-C9UX4u9n3Ra+JY7fZ+3rhU0mJtURhlHwwPUVd9zYJ5CmGEY+j1q4i3hKjBkY-OnWpd+-247o+OJkYRPvKTNGtupSh9MN6CHXTjNkMz6PFvOH5dWlYl4YUgNdEmV61JrNE+epF4XOF9bXTL2By-i-E0Kh6FpD9KsObWrLERe3ivDchMXjRZrqV8fAuF05xphUZsW+EVs20J7O7T1IbrvorTePo+XHi03QqaY6llPDGI6HTelI3eTNgAQAAiIIMN9yuc3HEl2u8lMODcWnnNleuOO4LQYOgJuS6gocl+XhKgi+CulnZv2q31CDhTcTiMeerY992Xa3G0nyGyTDhuAPZcVzMo9vljk+O+uhFqe54VmlpJQNmTjRQY4Wl3S0HnyW4Zi70PMozE1G1bR1CeDscYSUlhUNydRVBplcAHLkjRuyDT6NNZuzQhpf33iZNazVWrtWPsArmoCdYvA8LcVwy97ioBohgJsPkOxVEIhiW+6Dh7RCahZKygD7Y13Ek5WSqA3IQXMD5FwacuwMhJv2Hc7hvgigLpFIustB4YLYUlGydtq57QIbw+SShGRtnKETcwksqHSW7GaFoCl+YuGqMwn+mCzJIS4AQEgtkuGaNrk5HcDhApkOcDuTyLJ-LGC0EghsFxKjmFsUSex60ZDOLwdwtWiBIHSVMJ0Zw5Qqi0y7P7SmtDJYuEYSyKJoImoUGsCwTadAABGYAkSuI0bHHhxxvhTSCuFVkHtAkTTTG0aoHYWheFeBFLMyNi57xYb-LB5TKnxBqXUhJ7jml0kltJb4RotLuUsXAxAJRpKchZJA5kFxPCf0LtgRINAoAkAINgGQtllQnxAZ4nKhUvgKR8BeEwcZJZP3kmksWbJnryIuVcm5dzkDIAaRzJZSSZ7MXUnzAWEj+zfMPOFaobR-m3AFIYMWGZMxcGQnAOQAJEnTxYERE0lK1IYjpfS+lksZbktrLUfyuj2TMXCvYSGHYzbSiJCy7mLJKblAAjodokCuz6y6D8XwhoeYw35Rgw+JYhV1zYrosoPhxX1ldvfRAtM1IOA8h0m4d0MwgoMhgkkEIoDqs8Z4fh8kMANh8AjHQEMKZ9B+KsyCtRLWjIUQSOxcoFQOq1BYrQnlbSgxKPYcajRaaJyIpLAZfQXByKDbBbiK06ARuUD8KGO5nbQI7DsooPwyp4rYmaI1nhlWPmMqq5IBa6zdF0c2Utxhy3+R7upIK7RXh2i0ioRtDUZwR0Em2uhjgBTOGaDDHuzhvatAOVRVp-MfJEXHXmmJiUOFtuPI2Qi-Zzjtg7JYQ8AUewwJCiOlou6EIzj-jgklsLp60R9pBcKRsxbfD7W0moFQ+jXB5mO8544w4kDbUKE04YzhuwgvcbeocCAfRZmPNt3KIZVtbv+roPcLhnKtW9dDaNLbIWttOj9Tt5KUzTu5aa4VvBiNcuu+VCl7gkxKQwNt3hHCX2ZGFW+8l4MwxeP00GQo9CBs4ijJRkzZxqto2fRstE2JlG1aig1CATrqX5raLwBVvC8amQ4t98BVOELovWHsGLPI90TbswiIT+x1HdYROTr0FMTLsSow91ntH8zaD8cwV5GItjRfAhkFDbr+2Cs0Mz+7HHOOw9nNy1Q0xfBqMyWM17gn0Omqyfo7gbyQbeop-z0y8AVKqbUpEba5KaEvQlnVzcr1JsYm51kLkOwVBI9my51yCBNYrdcEWd9zDNB0m6mCw3wV4SnrWBSrRLj5UBUKe4PyKZmjTMYQ0OloLnIW7c9gkK20+B260Hu+2hQyc8M9AIQA */
  id: "f91w",
  type: "parallel",
  states: {
    "watch": {
      initial: "dateTime",
      states: {
        "dateTime": {
          initial: "default",
          states: {
            "default": {
              on: {
                "a-down": {
                  target: "Holding",
                },
              },
            },
            "Holding": {
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
            "casio": {
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
        "dailyAlarm": {
          initial: "default",
          states: {
            "default": {
              on: {
                "l-down": {
                  target: "edit-hours",
                  actions: "enableAlarmOnMark",
                },
                "a-down": {
                  target: "modified",
                  actions: ["toggleAlarmMode", "playBip"],
                },
                "c-down": {
                  target: "#f91w.watch.stopwatch",
                  actions: "playBip",
                },
              },
            },
            "modified": {
              on: {
                "l-down": {
                  target: "edit-hours",
                  actions: "enableAlarmOnMark",
                },
                "a-down": {
                  target: "modified",
                  actions: ["toggleAlarmMode", "playBip"],
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
                  target: "modified",
                },
                "a-down": {
                  actions: "incrementAlarmMinutes",
                },
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
        "stopwatch": {
          initial: "default",
          states: {
            "default": {
              on: {
                "a-down": { target: "modified", actions: ["toggleStopwatch", "playBip"] },
                "l-down": { target: "modified", actions: "toggleSplitOrClearStopwatch" },
                "c-down": {
                  target: "#f91w.watch.setDateTime",
                  actions: "playBip",
                },
              },
            },
            "modified": {
              on: {
                "a-down": { actions: ["toggleStopwatch", "playBip"] },
                "l-down": { actions: "toggleSplitOrClearStopwatch" },
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
        "setDateTime": {
          initial: "default",
          states: {
            "default": {
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
    "light": {
      initial: "off",
      states: {
        "on": { on: { "l-up": "off" } },
        "off": { on: { "l-down": "on" } }
      },
    },
  },
});

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xs": "375px",
        "1xs": "480px",
        xs: "560px",
        sm1: "600px",
        md1: "769px",
        preferencemd: "820px",
        "2md": "860px",
        lg1: "1000px",
        xl1: "1281px",
        "2xl1": "1640px",
        "3xl1": "1920px",
        "5xl": "3420px",
      },
      backgroundColor: {
        app: {
          black: {
            DEFAULT: "#29313C",
            light: "#C4C4C4",
            button: "#37404C",
            modal: "#1F2630",
            select: "#48515F",
            duration: "#717A8B",
          },
          blue: {
            DEFAULT: "#0095C8",
            second: "#0095C8",
            fifth: "rgba(0, 149, 200, 0.7)",
          },
          red: {
            DEFAULT: "#F6465D",
            close: "#5F303D",
            unlocked: "rgba(246, 70, 93, 0.15)",
          },
          purple: {
            DEFAULT: "#7B61FF",
          },
          green: {
            DEFAULT: "#2EBD85",
          },
        },
      },
      borderColor: {
        app: {
          black: {
            DEFAULT: "#37404C",
          },
          gray: {
            DEFAULT: "rgba(255, 255, 255, 0.1)",
          },
          blue: {
            DEFAULT: "#0095C8",
          },
        },
      },
      textColor: {
        app: {
          blue: {
            DEFAULT: "#0095C8",
          },
          red: {
            DEFAULT: "#F6465D",
          },
          green: {
            DEFAULT: "#2EBD85",
          },
        },
      },
      bottom: {
        34: "136px",
      },
      gap: {
        value: "3px",
        time: "106px",
        intervaly: "35px",
        intervalx: "17px",
      },
      width: {
        13: "53px",
        15: "60px",
        21: "85px",
        26: "105px",
        33: "133px",
        39: "156px",
        41: "165px",
        47: "189px",
        49: "194px",
        58: "230px",
        66: "264px",
        70: "280px",
        75: "300px",
        81: "323px",
        93: "372px",
        105: "420px",
        110: "440px",
        125: "500px",
        133: "530px",
        155: "619px",
        158: "630px",
        184: "734px",
        227: "1307px",
      },
      height: {
        13: "53px",
        14: "56px",
        15: "60px",
        21: "86px",
        31: "122px",
        50: "200px",
        75: "300px",
        86: "340px",
        88: "350px",
        90: "360px",
        137: "553px",
        165: "659px",
      },
      padding: {
        "50px": "50px",
        "60px": "60px",
      },
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer"), require("tailwindcss-text-fill")],
};

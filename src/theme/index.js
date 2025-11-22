  const colors = {
    primary: "#547792",
    secondary: "#ECEFCA",
    card: "#F6FAFD",
    error: "#EB6969",
    black: "#0B0B0B",
    neutral1: "#E2E2E2",
    neutral2: "#807979",
    light: "#FFFFFF",
  };

  // Formas/Bordes
  const shapes = {
    cardRadius: "25px",
    inputLarge: "50px",
    inputMedium: "25px",
    buttonRadius: "25px",
    chipRadius: "50px",
    buttonNormal: "10px",
  };

  // Tipografía
  const typography = {
    fontFamily: "'Albert Sans', sans-serif",
    display: {
      extrabold128: {
        fontSize: "128px",
        fontWeight: 800,
        lineHeight: "140px",
      },
      large: {
        fontSize: "64px",
        fontWeight: 700,
        lineHeight: "72px",
      },
      medium: {
        fontSize: "36px",
        fontWeight: 700,
        lineHeight: "56px",
      },
    },
    text: {
      large: { fontSize: "20px", fontWeight: 400, lineHeight: "28px" },
      medium: { fontSize: "16px", fontWeight: 400, lineHeight: "24px" },
      small: { fontSize: "14px", fontWeight: 400, lineHeight: "20px" },
    },
    input: {
      medium: { fontSize: "16px", fontWeight: 400, lineHeight: "24px" },
    },
    button: {
      boldMedium: { fontSize: "16px", fontWeight: 700, lineHeight: "24px" },
      semibold: { fontSize: "16px", fontWeight: 600, lineHeight: "24px" },
    },
  };

export const theme = { colors, shapes, typography };

export const getTailwindConfig = (themeObj) => ({
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: themeObj.colors.primary,
        secondary: themeObj.colors.secondary,
        card: themeObj.colors.card,
        error: themeObj.colors.error,
        black: themeObj.colors.black,
        light: themeObj.colors.light,
        neutral: {
          1: themeObj.colors.neutral1,
          2: themeObj.colors.neutral2,
        },
      },
      borderRadius: {
        card: themeObj.shapes.cardRadius,
        input: themeObj.shapes.inputMedium,
        button: themeObj.shapes.buttonRadius,
        chip: themeObj.shapes.chipRadius,
      },
      fontFamily: {
        sans: themeObj.typography.fontFamily,
      },
      fontSize: {
        "display-xl": [
          themeObj.typography.display.extrabold128.fontSize,
          {
            lineHeight: themeObj.typography.display.extrabold128.lineHeight,
            fontWeight: themeObj.typography.display.extrabold128.fontWeight,
          },
        ],
        "display-lg": [
          themeObj.typography.display.large.fontSize,
          {
            lineHeight: themeObj.typography.display.large.lineHeight,
            fontWeight: themeObj.typography.display.large.fontWeight,
          },
        ],
        "display-md": [
          themeObj.typography.display.medium.fontSize,
          {
            lineHeight: themeObj.typography.display.medium.lineHeight,
            fontWeight: themeObj.typography.display.medium.fontWeight,
          },
        ],
        "text-lg": [
          themeObj.typography.text.large.fontSize,
          {
            lineHeight: themeObj.typography.text.large.lineHeight,
            fontWeight: themeObj.typography.text.large.fontWeight,
          },
        ],
        "text-base": [
          themeObj.typography.text.medium.fontSize,
          {
            lineHeight: themeObj.typography.text.medium.lineHeight,
            fontWeight: themeObj.typography.text.medium.fontWeight,
          },
        ],
        "text-sm": [
          themeObj.typography.text.small.fontSize,
          {
            lineHeight: themeObj.typography.text.small.lineHeight,
            fontWeight: themeObj.typography.text.small.fontWeight,
          },
        ],
      },
    },
  },
  plugins: [],
});

export default theme;


//ejemplos
/*
// Colores primarios
<div className="bg-primary text-light p-4 rounded-card">Primario</div>
<button className="bg-secondary text-black">Secundario</button>
<div className="bg-error text-light">Error</div>
<div className="bg-card text-black">Card</div>

// Neutrales
<p className="text-black">Texto negro</p>
<p className="text-neutral-2">Texto neutral</p>
<div className="border-2 border-neutral-1">Borde gris claro</div>
<div className="bg-light">Fondo blanco</div>
-----------------------------------------
***Tipografias****
h1 className="text-display-xl font-bold text-black">
  Título Extra Grande (128px)
</h1>

<h2 className="text-display-lg text-primary">
  Título Grande (64px)
</h2>

<h3 className="text-display-md font-bold text-black">
  Título Medio (48px)
</h3>
--------------------------------------------
***Borde***
<h1 className="text-display-xl font-bold text-black">
  Título Extra Grande (128px)
</h1>

<h2 className="text-display-lg text-primary">
  Título Grande (64px)
</h2>

<h3 className="text-display-md font-bold text-black">
  Título Medio (48px)
</h3>

***COMBINACIONES
<input
  className="w-full px-4 py-2 border-2 border-neutral-1 rounded-input text-text-base text-black bg-light placeholder-neutral-2 focus:outline-none focus:border-primary"
  placeholder="Tu nombre"
/>

<select className="px-3 py-2 border-2 border-neutral-1 rounded-input text-text-base text-black bg-card focus:outline-none focus:border-primary">
  <option>Opción 1</option>
  <option>Opción 2</option>
</select>
*/
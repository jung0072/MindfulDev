/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      desktop: { max: "1440px" },
      // => @media (max-width: 1440px) { ... }
      tablet: { max: "834px" },
      // => @media (max-width: 834px) { ... }
      mobile: { max: "640px" },
      // => @media (max-width: 360px) { ... }
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "dark-primary": "#1A2128",
        "dark-secondary": "#434D56",
        "dark-tertiary": "#A9B2B9",
        "light-primary": "#FFFFFF",
        "light-secondary": "#EEF1F3",
        "primary-100": "#14532D",
        "primary-80": "#166534",
        "primary-60": "#15803D",
        "primary-40": "#16A34A",
        "primary-20": "#81C895",
        "blue-40": "#A5C8FD",
        "error-100": "#FF4242",
        "success-20": "#E0F7D8",
        "grey-100": "#1C2731",
        "grey-20": "#AAAAAA",
        "grey-500": "#9E9E9E",
        "warning-60": "#FFDF8E",
        "warning-100": "#FFC225",
        "error-80": "#FF7E7E",
        "error-60": "#FF9D9D",
        "error-20": "#FFD9D9",
        "grey-60": "#898F94",
      },
      boxShadow: {
        "input-hover": "0px 6px 12px rgba(28, 39, 49, 0.08)",
        "input-focus": "0px 2px 6px rgba(28, 39, 49, 0.08)",
        "profile-info": "0px 6px 12px rgba(28, 39, 49, 0.08)",
        "profile-edit-form": "0px 2px 6px rgba(28, 39, 49, 0.08)",
        "dropdown-list-done": "0px 6px 12px rgba(28, 39, 49, 0.08)",
        "modal-shadow": " 0px 25px 40px -10px rgba(28, 39, 49, 0.08)",
        "table-column": "3px 2px 6px -2px rgba(28, 39, 49, 0.08)",
      },
      borderColor: {
        "primary-80": "#166534",
        "primary-60": "#15803D",
        "primary-20": "#81C895",
        "input-disabled": "#ADB1B5",
        "error-100": "#FF4242",
      },
      outlineColor: {
        "primary-20": "#81C895",
        "error-100": "#FF4242",
      },
      backgroundColor: {
        "grey-20": "#AAAAAA",
        "grey-100": "#1C2731",
        "success-20": "#E0F7D8",
        "primary-80": "#166534",
        "primary-60": "#15803D",
        "warning-20": "#FFF3D3",
        "error-20": "#FFD9D9",
        "blue-20": "#D9EBFF",
        "purple-20": "#E8E9FE",
        "grey-50": "#FAFAFA",
        "form-image-hover": "rgba(28, 39, 49, 0.5)",
        "light-primary": "#1A2128",
        "modal-backdrop": "rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        "main-bg": "url('/src/assets/main-bg.svg')",
      },
    },
  },
  plugins: [],
};

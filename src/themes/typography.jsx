const pxToRem = (px) => `${px / 14}rem`;

const typography = {
  fontFamily: '"Inter", "Plus Jakarta Sans", "Helvetica", "Arial", sans-serif',
  fontFamilySerif: '"Playfair Display", Georgia, serif',
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  fontSize: 14,
  fontSizeXXS: pxToRem(10.4),
  fontSizeXS: pxToRem(12),
  fontSizeSM: pxToRem(14),
  fontSizeRegular: pxToRem(16),
  fontSizeLG: pxToRem(18),
  fontSizeXL: pxToRem(20),

  h1: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 800,
    fontSize: pxToRem(42),
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    "@media (min-width:900px)": {
      fontSize: pxToRem(56),
    },
  },
  h2: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 700,
    fontSize: pxToRem(32),
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    "@media (min-width:900px)": {
      fontSize: pxToRem(42),
    },
  },
  h3: {
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 700,
    fontSize: pxToRem(26),
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    "@media (min-width:900px)": {
      fontSize: pxToRem(32),
    },
  },
  h4: {
    fontWeight: 500,
    fontSize: pxToRem(22),
    lineHeight: 1.35,
    "@media (min-width:900px)": {
      fontSize: pxToRem(24),
    },
  },
  h5: {
    fontWeight: 500,
    fontSize: pxToRem(18),
    lineHeight: 1.4,
    "@media (min-width:900px)": {
      fontSize: pxToRem(20),
    },
  },
  h6: {
    fontWeight: 400,
    fontSize: pxToRem(16),
    lineHeight: 1.5,
    "@media (min-width:900px)": {
      fontSize: pxToRem(18),
    },
  },
  body1: {
    fontSize: pxToRem(14),
    lineHeight: 1.5,
  },
  body2: {
    fontSize: pxToRem(12),
    lineHeight: 1.6,
  },
  subTitle1: {
    fontSize: pxToRem(14),
    fontWeight: 500,
    "@media (min-width:900px)": {
      fontSize: pxToRem(16),
    },
  },
  subTitle2: {
    fontSize: pxToRem(14),
    fontWeight: 500,
  },
};

export default typography;

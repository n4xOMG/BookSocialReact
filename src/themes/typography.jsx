const pxToRem = (px) => `${px / 14}rem`;

const typography = {
    fontFamily: '"Plus Jakarta Sans", "Helvetica", "Arial", sans-serif',
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
        fontWeight: 700,
        fontSize: pxToRem(48),
        lineHeight: 1.2,
    },
    h2: {
        fontWeight: 600,
        fontSize: pxToRem(36),
        lineHeight: 1.25,
    },
    h3: {
        fontWeight: 600,
        fontSize: pxToRem(30),
        lineHeight: 1.3,
    },
    h4: {
        fontWeight: 500,
        fontSize: pxToRem(24),
        lineHeight: 1.35,
    },
    h5: {
        fontWeight: 500,
        fontSize: pxToRem(20),
        lineHeight: 1.4,
    },
    h6: {
        fontWeight: 400,
        fontSize: pxToRem(18),
        lineHeight: 1.5,
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
        fontSize: pxToRem(16),
        fontWeight: 500,
    },
    subTitle2: {
        fontSize: pxToRem(14),
        fontWeight: 500,
    },
};

export default typography;

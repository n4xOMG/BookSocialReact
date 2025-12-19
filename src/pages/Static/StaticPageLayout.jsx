import { Box, Container, Typography, useMediaQuery, useTheme } from "@mui/material";

export default function StaticPageLayout({ title, subtitle, children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          className="font-serif"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "3rem", lg: "3.5rem" },
            color: theme.palette.primary.main,
            lineHeight: 1.1,
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="h6"
            component="p"
            sx={{
              mt: 1,
              fontStyle: "italic",
              fontWeight: 500,
              color: theme.palette.secondary.main,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>


      <Box sx={{ lineHeight: 1.8 }}>
        {children}
      </Box>
    </Container>
  );
}

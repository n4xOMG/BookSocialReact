import { Box, Typography, Stack, Link as MuiLink, useTheme, Avatar } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        py: 3,
        px: 2,
        mt: "auto", //luôn nằm dưới/xuất hiện sau khi scroll
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        textAlign="center"
      >
        <Stack
          direction="row"
          spacing={3}
          alignItems="flex-start"
          textAlign="left"
          sx={{ mb: 3, }}
        >
          {/* LEFT: Logo + Name */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ minWidth: 160 }}
          >
            <Avatar
              src="/logo512.png"
              alt="TailVerse"
              sx={{
                width: 40,
                height: 40,
                border: "2px solid",
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(157, 80, 187, 0.2)",
                boxShadow: "0 4px 12px rgba(157, 80, 187, 0.3)",
              }}
            />
            <Typography variant="h6" fontWeight="bold">
              TailVerse
            </Typography>
          </Stack>

          {/* RIGHT: Description */}
          <Typography
            variant="subtitle2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              maxWidth: 700,
            }}
          >
            Read, write, connect. The fusion of Tale and Verse represents the vision of a boundless universe. It is a unified platform where every story resides and every narrative voice is connected.
          </Typography>
        </Stack>


        {/* Links */}
        <Stack
          direction="row"
          spacing={3}
          flexWrap="wrap"
          justifyContent="center"
        >
          {[
            { label: "FAQ", to: "/faq" },
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms of Use", to: "/terms" },
            { label: "About Us", to: "/about" },
            { label: "Contact Us", to: "/contact" },
          ].map((item) => (
            <MuiLink
              key={item.label}
              component={Link}
              to={item.to}
              underline="hover"
              color="text.secondary"
              sx={{ fontSize: "0.9rem" }}
            >
              {item.label}
            </MuiLink>
          ))}
        </Stack>

        {/* Copyright */}
        <Typography variant="caption" color="text.secondary">
          © 2025 TailVerse
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;

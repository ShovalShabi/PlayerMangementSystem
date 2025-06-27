import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          py: 2,
          textAlign: "center",
          bgcolor: "transparent",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} PlayerDashboard Inc. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Footer;

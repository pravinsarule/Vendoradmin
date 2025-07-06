

import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Drawer,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SitemarkIcon from "./SiteMarkIcon";
import { useNavigate } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export function Navbar({ setIsSidebarOpen }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Left side with logo and nav buttons */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}>
            <SitemarkIcon />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 2 }}>
              <Button variant="text" color="info" size="small" onClick={() => navigate("/Home")}>
                Home
              </Button>
              <Button variant="text" color="info" size="small" onClick={() => navigate("/Dashboard")}>
                Dashboard
              </Button>
            </Box>
          </Box>

          {/* Right side Sign In button */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <Button color="primary" variant="contained" size="small" onClick={() => navigate("/Login")}>
              Sign in
            </Button>
          </Box>

          {/* Hamburger menu icon for mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </StyledToolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            top: "var(--template-frame-height, 0px)",
          },
        }}
      >
        <Box sx={{ p: 2, backgroundColor: "background.default" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <MenuItem onClick={() => { setIsSidebarOpen(true); toggleDrawer(false)(); }}>
            Dashboard
          </MenuItem>

          <Divider sx={{ my: 2 }} />

          <MenuItem>
            <Button
              color="primary"
              variant="contained"
              fullWidth
              onClick={() => {
                toggleDrawer(false)();
                navigate("/Login");
              }}
            >
              Sign in
            </Button>
          </MenuItem>
        </Box>
      </Drawer>
    </AppBar>
  );
}


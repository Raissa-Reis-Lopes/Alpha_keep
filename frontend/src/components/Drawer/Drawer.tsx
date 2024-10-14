import React from 'react';
import { Drawer as MuiDrawer, List, ListItem, ListItemText, ListItemIcon, useTheme, useMediaQuery } from '@mui/material';
import { Home, Mail, DescriptionOutlined, ArchiveOutlined, DeleteOutlined } from '@mui/icons-material';


interface DrawerProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

const drawerWidth = 240;
const miniDrawerWidth = 60;

const Drawer: React.FC<DrawerProps> = ({ drawerOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Verifica se é mobile
  const calculatedWidth = drawerOpen ? drawerWidth : miniDrawerWidth;
  return (
    <MuiDrawer
      variant="permanent"
      open={drawerOpen}
      sx={{
        width: `${calculatedWidth}px`,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: `${calculatedWidth}px`,
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
      PaperProps={{
        sx: {
          top: isMobile ? '0px' : '64px',
          height: isMobile ? '100%' : 'calc(100% - 64px)',
          paddingTop: isMobile ? '64px' : '0px',
        },
      }}
    >
      <List>
        <ListItem component="li">
          <ListItemIcon><DescriptionOutlined /></ListItemIcon>
          {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Notas" />}
        </ListItem>
        <ListItem component="li">
          <ListItemIcon><ArchiveOutlined /></ListItemIcon>
          {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Arquivo" />}
        </ListItem>
        <ListItem component="li">
          <ListItemIcon><DeleteOutlined /></ListItemIcon>
          {drawerOpen && <ListItemText sx={{ margin: 0, padding: 0 }} primary="Lixeira" />}
        </ListItem>
      </List>
    </MuiDrawer>
  );
};

export default Drawer;
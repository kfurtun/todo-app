import React, { useState } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListDivider from '@mui/joy/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import Typography from '@mui/material/Typography';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Drawer, DrawerHeader } from './Sidebar.styles';
import { linkList, favoritesList, projectsList } from './utils';
import ListItem from './ListItem';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const handleDrawer = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ px: open ? 2.5 : 0 }}
            >
              {open && 'Menu'}
            </Typography>
            <IconButton onClick={handleDrawer}>
              {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <ListDivider />
          <List>
            {linkList.map((item) => (
              <Link href={item.href} key={item.text}>
                <ListItem open={open} text={item.text}>
                  {item.icon}
                </ListItem>
              </Link>
            ))}
          </List>
          <ListDivider />
          <List>
            {favoritesList.map((item) => (
              <Link href={item.href} key={item.text}>
                <ListItem open={open} text={item.text}>
                  {item.icon}
                </ListItem>
              </Link>
            ))}
          </List>
          <List sx={{ marginTop: 'auto' }}>
            <Link href="/settings">
              <ListItem open={open} text="Settings">
                <SettingsApplicationsIcon />
              </ListItem>
            </Link>
            <ListItem
              open={open}
              text="Sign out"
              isRoleDisabled={false}
              onClick={() => signOut()}
            >
              <LogoutIcon />
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;

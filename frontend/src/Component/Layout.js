import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Header from './Header';
import { LuLayoutDashboard } from "react-icons/lu";
import { TbShoppingBagCheck } from "react-icons/tb";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { FaAngleUp, FaBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../Redux/Slice/user.slice';
import { FiPlusSquare, FiUser } from 'react-icons/fi';
import { IoMdLogOut } from 'react-icons/io';
import { logoutUser } from '../Redux/Slice/auth.slice';

const drawerWidth = 250;

function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const userId = sessionStorage.getItem('userId')

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleSubmenuToggle = (title) => {
        setOpenSubmenu(openSubmenu === title ? null : title);
    };

    const handleLogout = () => {
        console.log(userId);
        try {
            if (userId) {
                dispatch(logoutUser(userId));
                navigate('/');
            }
        } catch (error) {
            console.log(error)
        }
    }

    const pages = [
        { title: 'Dashboard', icon: <LuLayoutDashboard />, path: '/dashboard' },
        { title: 'My Profile', icon: <FiUser />, path: '/profile' },
        { title: 'Order', icon: <TbShoppingBagCheck />, path: '/order' },
        { title: 'Design', icon: <FiPlusSquare />, path: '/design' },
        { title: 'Wishlist', icon: <FaBookmark />, path: '/wishlist' },
        { title: 'Logout', icon: <IoMdLogOut />, onclick: handleLogout },
    ]

    const drawer = (
        <div>
            <List>
                {pages.map((v) => (
                    <div key={v.title}>
                        <ListItem disablePadding sx={{ paddingLeft: '20px', paddingRight: '20px' }}>
                            <ListItemButton
                                onClick={() => {
                                    if (v.subItems) {
                                        handleSubmenuToggle(v.title);
                                    } else if (v.onclick) {
                                        // Handle logout or other onclick functions
                                        v.onclick();
                                        if (window && window.innerWidth < 900) {
                                            setMobileOpen(false);
                                        }
                                    } else if (v.path) {
                                        // Handle navigation
                                        navigate(v.path);
                                        if (window && window.innerWidth < 900) {
                                            setMobileOpen(false);
                                        }
                                    }
                                }}
                                sx={{
                                    gap: '4px',
                                    backgroundColor: 'transparent',
                                    boxShadow: (v.path && location.pathname.includes(v.path)) ? '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)' : 'none',
                                    color: '#000',
                                    borderRadius: '10px',
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        color: '#000',
                                        '& .MuiSvgIcon-root': {
                                            color: '#000',
                                        },
                                        '& .icon': {
                                            color: '#000',
                                        }
                                    }
                                }}
                            >
                                <ListItemIcon className="icon" sx={{ color: '#000', fontSize: '20px', minWidth: '35px' }}>
                                    {v.icon}
                                </ListItemIcon>
                                <ListItemText primary={v.title} sx={{ fontSize: '18px', fontWeight: 500, whiteSpace: 'nowrap' }} />
                                {v.dot && <span style={{ color: 'red', marginLeft: '5px' }}>•</span>}
                                {v.subItems && openSubmenu === v.title ? <FaAngleUp /> : v.dropdownIcon}
                            </ListItemButton>
                        </ListItem>
                        {v.subItems && openSubmenu === v.title && v.subItems.map(subItem => (
                            <ListItem key={subItem.title} disablePadding sx={{ paddingLeft: '40px' }}>
                                <ListItemButton
                                    sx={{
                                        backgroundColor: 'transparent',
                                        color: 'black',
                                        borderRadius: '10px',
                                        fontSize: '10px',
                                        paddingTop: '5px',
                                        paddingBottom: '5px',
                                        marginTop: '7px',
                                        '&:hover': {
                                            backgroundColor: '#FFF9F6',
                                            color: '#523C34',
                                        }
                                    }}
                                    onClick={() => {
                                        navigate(subItem.path);
                                        if (window && window.innerWidth < 900) {
                                            setMobileOpen(false);
                                        }
                                    }}
                                >
                                    <span style={{ margin: '5px' }}>•</span>
                                    <ListItemText primary={subItem.title} sx={{ fontSize: '14px', fontWeight: 400 }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </div>
                ))}
            </List>
        </div>
    );

    // Remove this const when copying and pasting into your project.
    const container = typeof window !== 'undefined' ? () => window.document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }} className='j_bg_color'>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: '#bac095',
                    color: '#523C34',
                    // zIndex: 9999
                }}
            >
                <Header handleDrawerToggle={handleDrawerToggle} />
            </AppBar>
            <Box
                className='j_shadow'
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            background: '#bac095',
                            // background: 'transparent',
                            // marginTop: '65px'
                            border: 'none',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            background: '#bac095b3',
                            // background: 'transparent',
                            border: 'none',
                            marginTop: '65px',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                className='sp_css'
                sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, flex: 1, p: 4, px: { xs: 2, md: 4 } }}
            // sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, flex: 1, p: 4, md: { p: 6 }, lg: { p: 8 }, background: 'linear-gradient(to right, #6B46C1, #D946EF, #6B46C1)' }}
            >
                <Toolbar />
                {children}
            </Box>

        </Box >
    );
}

Layout.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window: PropTypes.func,
};

export default Layout;
import React, { PropsWithChildren, useContext } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Banner from '@/Components/Jetstream/Banner';
import ResponsiveNavLink from '@/Components/Jetstream/ResponsiveNavLink';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Box,
  CSSObject,
  Divider,
  IconButton,
  Theme,
  styled,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Dropdown from '@/Components/Jetstream/Dropdown';
import DropdownLink from '@/Components/Jetstream/DropdownLink';
import route from 'ziggy-js';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import StorageIcon from '@mui/icons-material/Storage';
import TableRowsIcon from '@mui/icons-material/TableRows';
import BackupIcon from '@mui/icons-material/Backup';
import { asset } from '@/Models/Helper';
import { User } from '@/types';
import { VersionContext } from '@/Context/VersionContext';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
interface Props {
  title: string;
  renderHeader?(): JSX.Element;
}

const drawerWidth = 270;
const navHeight = 70;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  height: navHeight,
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function logout(e: React.FormEvent) {
  e.preventDefault();
  router.post(route('logout'));
  // router.post(route('logout'));
}

export default function DashboardAdminLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<Props>) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const { props } = usePage();
  const user = props.user as unknown as User;

  const version = useContext(VersionContext);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setIsSidebarOpen(open);
    };

  const sideBar = () => (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <ul className="">
        <li>
          <ResponsiveNavLink
            href={route('profile.show')}
            active={route().current('profile.show')}
          >
            <div className="flex gap-3">
              <img
                src={
                  user.profile_photo_path
                    ? asset('public', user.profile_photo_path)
                    : asset('root', 'assets/image/default-profile.png')
                }
                alt={user.name}
                className="rounded-full h-10 w-10 object-cover"
              />
              <div className="my-auto flex-col text-lg">
                <p>{user.name}</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          </ResponsiveNavLink>
        </li>
        <li>
          <ResponsiveNavLink
            href={route('dashboard')}
            active={route().current('dashboard')}
          >
            <span className={'mr-4'}>
              <DashboardIcon fontSize="large" />
            </span>
            Dashboard
          </ResponsiveNavLink>
        </li>
        <li>
          <ResponsiveNavLink
            href={route('quest.index')}
            active={route().current('quest.index')}
          >
            <span className={'mr-4'}>
              <PlaylistAddCheckIcon fontSize="large" />
            </span>
            Quest
          </ResponsiveNavLink>
        </li>
        <li>
          <ResponsiveNavLink
            href={route('quest-category.index')}
            active={route().current('quest-category.index')}
          >
            <span className={'mr-4'}>
              <FormatListBulletedIcon fontSize="large" />
            </span>
            Kategori Quest
          </ResponsiveNavLink>
        </li>
        {user.roles.some(role => role.name === 'super-admin') && (
          <>
            <Divider >
              User Management
            </Divider>
            <li>
              <ResponsiveNavLink
                href={route('user.index')}
                active={route().current('user.index')}
              >
                <span className={'mr-4'}>
                  <ManageAccountsIcon fontSize="large" />
                </span>
                Pengguna
              </ResponsiveNavLink>
            </li>
            <li>
              <ResponsiveNavLink
                href={route('user-activity')}
                active={route().current('user-activity')}
              >
                <span className={'mr-4'}>
                  <ManageHistoryIcon fontSize="large" />
                </span>
                Log Aktivitas
              </ResponsiveNavLink>
            </li>
            <Divider >
              DEV
            </Divider>
            <li>
              <a
                href={route('dev.dump-db')}
                target='_blank'
                className='block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition'
              >
                <span className={'mr-4'}>
                  <BackupIcon fontSize="large" />
                </span>
                dumpDB
              </a>
            </li>
            <li>
              <a
                href={route('dev.dump-redis')}
                className='block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition'
              >
                <span className={'mr-4'}>
                  <TableRowsIcon fontSize="large" />
                </span>
                dumpRedis
              </a>
            </li>
            <li>
              <a
                href={route('dev.dump-storage-logs')}
                className='block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition'
              >
                <span className={'mr-4'}>
                  <StorageIcon fontSize="large" />
                </span>
                dumpStorageLogs
              </a>
            </li>
          </>
        )}

      </ul>
    </Box>
  );

  return (
    <div
      className="min-h-screen min-w-full w-full"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgb(255, 255, 255) 85%), radial-gradient(ellipse at center left, rgba(4, 159, 249, 0.384), transparent 50%), radial-gradient(ellipse at center right, rgba(35, 18, 190, 0.13), transparent 50%), radial-gradient(ellipse at bottom right, rgba(20, 4, 249, 0.363), transparent 50%), radial-gradient(ellipse at bottom left, rgba(252, 202, 38, 0.342), transparent 50%)',
      }}
    >
      <Head>
        <title>{title || 'ABC CAT'}</title>
        <meta name="description" content="ABC CAT" />
        <link rel="icon" href={asset('root', 'assets/image/icon.png')} />
      </Head>
      <Box sx={{ display: 'flex' }}>
        <AppBar open={isSidebarOpen}>
          <Banner />
          <nav
            className="flex justify-between w-full sticky bg-main-blue my-auto px-7 shadow shadow-sky-400/50"
            style={{ height: navHeight }}
          >
            <div className="flex gap-3 max-w-6xl mr-30">
              <button
                className="text-3xl md:ml-20 text-white px-3 py-2"
                onClick={toggleDrawer(!isSidebarOpen)}
              >
                <MenuIcon fontSize="large" />
              </button>
            </div>
            <div className="mr-3 relative my-auto">
              <Dropdown
                align="right"
                width="48"
                renderTrigger={() => (
                  <button className="flex text-sm text-white border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
                    <SettingsIcon fontSize="large" />
                  </button>
                )}
              >
                {/* <!-- Account Management --> */}
                <div className="block px-4 py-2 text-xs text-gray-400">
                  Manage Account
                </div>

                <DropdownLink href={route('profile.show')}>
                  Profile
                </DropdownLink>

                <div className="border-t border-gray-100"></div>

                {/* <!-- Authentication --> */}
                <form onSubmit={logout}>
                  <DropdownLink as="button">
                    {' '}
                    <div className="text-red-700 font-bold">Log Out</div>{' '}
                  </DropdownLink>
                </form>
              </Dropdown>
            </div>
          </nav>
        </AppBar>
        <Drawer variant="permanent" open={isSidebarOpen}>
          <DrawerHeader>
            <IconButton onClick={toggleDrawer(!isSidebarOpen)}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          {sideBar()}
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, marginTop: `${navHeight}px` }}
        >
          <div className="mx-auto px-8">
            <div className="">{children}</div>
          </div>
        </Box>
      </Box>
      <div className="w-full bg-blue-50 fixed bottom-0 text-center shadow shadow-sky-400/50 py-1">
        Ruxtech @2023 Ver. {version}
      </div>
    </div>
  );
}

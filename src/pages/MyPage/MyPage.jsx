import { Box } from '@chakra-ui/react';
import MyHeader from './components/MyHeader';
import MyProfile from './components/MyProfile';
import MySummary from './components/MySummary';
import MyMenu from './components/MyMenu';
import FollowInfo from './components/FollowInfo';
import MySnap from './components/MySnap';
import BottomNavigation from './components/BottomNavigation';
import './MyPage.css';
import './MyPage.css';

export default function MyPage() {
    return (
        <Box className="my-page">

            <MyHeader />

            <MyProfile />

            <MySummary />

            <MyMenu />

            <FollowInfo />

            <MySnap />

            <BottomNavigation />

        </Box>
    );
}
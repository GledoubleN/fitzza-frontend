import { Container } from '@chakra-ui/react';
import MyHeader from './components/MyHeader';
import MyProfile from './components/MyProfile';
import MySummary from './components/MySummary';
import MyMenu from './components/MyMenu';
import FollowInfo from './components/FollowInfo';
import MySnap from './components/MySnap';
import BottomNavigation from './components/BottomNavigation';

export default function MyPage() {
    return (
        <Container
            width="100%"
            maxWidth="390px"
            minHeight="100vh"
            mx="auto"
            pb="70px"
            bg="white"
        >

            <MyHeader />

            <MyProfile />

            <MySummary />

            <MyMenu />

            <FollowInfo />

            <MySnap />

            <BottomNavigation />

        </Container>
    );
}
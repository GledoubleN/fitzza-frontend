import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react';
import {
    Package,
    PartyPopper,
    Users,
    Settings,
    Menu,
    Camera,
    House,
    Heart,
    User
} from 'lucide-react';
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
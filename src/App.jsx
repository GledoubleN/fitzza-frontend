import { MainPage } from "./pages/MainPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ShoppingCartPage } from "./pages/ShoppingCartPage.jsx";
import { SignInPage } from "./pages/SignInPage.jsx";
import { SignUpPage } from "./pages/SignUpPage.jsx";
import { SearchResultPage } from './pages/SearchResultPage.jsx'
import { CheckoutPage } from './pages/CheckoutPage.jsx'
import { CommunityMainPage } from "./pages/community/CommunityMainPage.jsx";
import { CommunityWritePage } from "./pages/community/CommunityWritePage.jsx";
import { CommunityArticlePage } from "./pages/community/CommunityArticlePage.jsx";
import { ProductPage } from './pages/ProductPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { VtonGalleryPage } from './pages/profile/VtonGalleryPage.jsx'
import WorldCupPage from './pages/WorldCupPage.jsx'
import { ShortcutPage } from './pages/ShortcutPage.jsx'
import { WishlistPage } from './pages/WishlistPage.jsx'
import { CategoryPage } from './pages/CategoryPage.jsx'
import { OrderDetail } from './pages/OrderDetailPage';
import { OrderListPage } from './pages/OrderListPage.jsx'
import { ThemePreviewPage } from './pages/ThemePreviewPage.jsx'
import { AIStylistPage } from './pages/ai/AIStylistPage.jsx'
import { AIHistoryPage } from './pages/ai/AIHistoryPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage/> }/>
        <Route path="/shopping-cart" element={ <ShoppingCartPage/> }/>
        <Route path="/signin" element={ <SignInPage/> }/>
        <Route path="/signup" element={ <SignUpPage/> }/>
        <Route path="/search" element={ <SearchResultPage/> }/>
        <Route path="/products/:id" element={ <ProductPage/> }/>
        <Route path="/checkout" element={ <CheckoutPage/> }/>
        <Route path="/community/main" element={ <CommunityMainPage/> }/>
        <Route path="/community/articles/:id" element={ <CommunityArticlePage/> }/>
        <Route path="/community/write" element={ <CommunityWritePage/> }/>
        <Route path="/profile" element={ <ProfilePage/> }/>
        <Route path="/profile/fittings" element={ <VtonGalleryPage/> }/>
        <Route path="/worldcup" element={ <WorldCupPage/> }/>
        <Route path="/shortcuts" element={ <ShortcutPage/> }/>
        <Route path="/wishlist" element={ <WishlistPage/> }/>
        <Route path="/categories" element={ <CategoryPage/> }/>
        <Route path="/orders" element={ <OrderListPage/> }/>
        <Route path="/orders/:orderId" element={ <OrderDetail/> }/>
        <Route path="/theme-preview" element={<ThemePreviewPage />} />
        <Route path="/ai/history" element={ <AIHistoryPage/> }/>
        <Route path="/ai/:requestId?" element={ <AIStylistPage/> }/>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
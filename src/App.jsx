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
import WorldCupPage from './pages/worldcup/WorldCupPage.jsx'
import { ShortcutPage } from './pages/ShortcutPage.jsx'
import { WishlistPage } from './pages/WishlistPage.jsx'
import { WorldCupSetupPage } from './pages/worldcup/WorldCupSetupPage.jsx'
import { WorldCupHistoryPage } from './pages/worldcup/WorldCupHistoryPage.jsx'
import { CategoryPage } from './pages/CategoryPage.jsx'
import { OrderDetail } from './pages/OrderDetailPage';
import { OrderListPage } from './pages/OrderListPage.jsx'
import { ThemePreviewPage } from './pages/ThemePreviewPage.jsx'
import { AIStylistResultPage } from './pages/ai-stylist/AIStylistResultPage.jsx'
import { AIStylistHistoryPage } from './pages/ai-stylist/AIStylistHistoryPage.jsx'
import { AIStylistFittingRedirectPage } from './pages/ai-stylist/AIStylistFittingRedirectPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx';
import { RequireSignIn } from './components/RequireSignIn.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage/> }/>
        <Route path="/shopping-cart" element={ <RequireSignIn><ShoppingCartPage/></RequireSignIn> }/>
        <Route path="/signin" element={ <SignInPage/> }/>
        <Route path="/signup" element={ <SignUpPage/> }/>
        <Route path="/search" element={ <SearchResultPage/> }/>
        <Route path="/products/:id" element={ <ProductPage/> }/>
        <Route path="/checkout" element={ <RequireSignIn><CheckoutPage/></RequireSignIn> }/>
        <Route path="/community/main" element={ <CommunityMainPage/> }/>
        <Route path="/community/articles/:id" element={ <CommunityArticlePage/> }/>
        <Route path="/community/write" element={ <RequireSignIn><CommunityWritePage/></RequireSignIn> }/>
        <Route path="/profile" element={ <RequireSignIn><ProfilePage/></RequireSignIn> }/>
        <Route path="/profile/fittings" element={ <RequireSignIn><VtonGalleryPage/></RequireSignIn> }/>
        <Route path="/shortcuts" element={ <ShortcutPage/> }/>
        <Route path="/wishlist" element={ <RequireSignIn><WishlistPage/></RequireSignIn> }/>
        <Route path="/worldcup" element={ <RequireSignIn><WorldCupPage/></RequireSignIn> }/>
        <Route path="/worldcup/setup" element={ <RequireSignIn><WorldCupSetupPage/></RequireSignIn> }/>
        <Route path="/worldcup/history" element={ <RequireSignIn><WorldCupHistoryPage/></RequireSignIn> }/>
        <Route path="/categories" element={ <CategoryPage/> }/>
        <Route path="/orders" element={ <RequireSignIn><OrderListPage/></RequireSignIn> }/>
        <Route path="/orders/:orderId" element={ <RequireSignIn><OrderDetail/></RequireSignIn> }/>
        <Route path="/theme-preview" element={<ThemePreviewPage />} />
        <Route path="/ai-stylist/history" element={ <RequireSignIn><AIStylistHistoryPage/></RequireSignIn> }/>
        <Route path="/ai-stylist/fittings/:fittingId" element={ <RequireSignIn><AIStylistFittingRedirectPage/></RequireSignIn> }/>
        <Route path="/ai-stylist/:requestId?" element={ <RequireSignIn><AIStylistResultPage/></RequireSignIn> }/>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
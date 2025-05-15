import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Dashboard from '../pages/Dashboard';

import Products from '../pages/Products';
import Orders from '../pages/Orders';
import { PaidOrders } from '../pages/PaidOrders';
import { UnpaidOrders } from '../pages/UnpaidOrders';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import SocialMedia from '../pages/SocialMedia';
import ApplicationName from '../pages/ApplicationName';
import Logos from '../pages/Logos';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import TermsEditor from '../pages/TermsEditor';
import PrivacyPolicyEditor from '../pages/PrivacyPolicyEditor';
import ShippingPolicyEditor from '../pages/ShippingPolicyEditor';
import RefundPolicyEditor from '../pages/RefundPolicyEditor';
import AboutUsEditor from '../pages/AboutUsEditor';
import Businesses from '../pages/Businesses';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:ml-64 transition-all duration-300">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Header title="Dashboard" subtitle="Overview of your business" />
                <Dashboard />
              </>
            } 
          />
          <Route 
            path="/businesses" 
            element={
              <>
                <Header title="Businesses" subtitle="Manage your businesses" />
                <Businesses />
              </>
            } 
          />

          <Route 
            path="/products" 
            element={
              <>
                <Header title="Products" subtitle="Manage your product catalog" />
                <Products />
              </>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <>
                <Header title="Orders" subtitle="Manage orders" />
                <Orders />
              </>
            } 
          />
          <Route 
            path="/paid-orders" 
            element={
              <>
                <Header title="Paid Orders" subtitle="View all paid orders" />
                <PaidOrders />
              </>
            } 
          />
          <Route 
            path="/unpaid-orders" 
            element={
              <>
                <Header title="Unpaid Orders" subtitle="View pending and failed orders" />
                <UnpaidOrders />
              </>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <>
                <Header title="Reports & Analytics" subtitle="Business insights and performance" />
                <Reports />
              </>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <>
                <Header title="Settings" subtitle="Configure your store" />
                <Settings />
              </>
            } 
          />
          <Route 
            path="/settings/social-media" 
            element={
              <>
                <Header title="Settings" subtitle="Configure your store" />
                <SocialMedia />
              </>
            } 
          />
          <Route 
            path="/settings/application-name" 
            element={
              <>
                <Header title="Settings" subtitle="Configure your store" />
                <ApplicationName />
              </>
            } 
          />
          <Route 
            path="/settings/logos" 
            element={
              <>
                <Header title="Logo Settings" subtitle="Manage your website logos" />
                <Logos />
              </>
            } 
          />
          <Route 
            path="/settings/terms-editor" 
            element={
              <>
                <Header title="Terms & Conditions" subtitle="Edit terms and conditions" />
                <TermsEditor />
              </>
            }
          />
          <Route 
            path="/settings/privacy-policy-editor" 
            element={
              <>
                <Header title="Privacy Policy" subtitle="Edit privacy policy" />
                <PrivacyPolicyEditor />
              </>
            }
          />
          <Route 
            path="/settings/shipping-policy-editor" 
            element={
              <>
                <Header title="Shipping Policy" subtitle="Edit shipping policy" />
                <ShippingPolicyEditor />
              </>
            }
          />
          <Route 
            path="/settings/refund-policy-editor" 
            element={
              <>
                <Header title="Refund Policy" subtitle="Edit refund policy" />
                <RefundPolicyEditor />
              </>
            }
          />
          <Route 
            path="/settings/about-editor" 
            element={
              <>
                <Header title="About Us" subtitle="Edit about us content" />
                <AboutUsEditor />
              </>
            }
          />
          <Route 
            path="/profile" 
            element={
              <>
                <Header title="Profile" subtitle="Manage your profile" />
                <Profile />
              </>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppLayout;
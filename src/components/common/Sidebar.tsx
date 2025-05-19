import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  CreditCard,
  Package, 
  ShoppingBag, 
  BarChart2, 
  Settings as SettingsIcon, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  ChevronLeft,
  LogOut,
  FileText,
  Share2,
  Type, // Added for Application Name icon
  Image, // Add Image icon for Logos
  MapPin, // For Address
  Copyright as CopyrightIcon, // For Copyright Message
  MessageSquare // For Contact Requests
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../contexts/AppContext';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
  depth?: number;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  exact = false, 
  depth = 0, 
  collapsed = false,
  onClick 
}) => {
  return (
    <NavLink
      to={to}
      end={exact}
      onClick={onClick}
      className={({ isActive }) => 
        cn(
          'flex items-center py-2.5 px-4 rounded-md transition-colors duration-200',
          depth > 0 && 'pl-8',
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-blue-700/50 hover:text-white',
          collapsed && 'justify-center p-2'
        )
      }
    >
      <span className="w-5 h-5">{icon}</span>
      {!collapsed && <span className={cn('ml-3 text-sm font-medium')}>{label}</span>}
    </NavLink>
  );
};

interface NavGroupProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  collapsed?: boolean;
}

const NavGroup: React.FC<NavGroupProps> = ({ icon, label, children, collapsed = false }) => {
  const [isOpen, setIsOpen] = useState(false); // Initialize as closed
  
  return (
    <div>
      <button
        className={cn(
          'flex items-center w-full py-2.5 px-4 rounded-md transition-colors duration-200 text-gray-300 hover:bg-blue-700/50 hover:text-white',
          collapsed && 'justify-center p-2'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-5 h-5">{icon}</span>
        {!collapsed && (
          <>
            <span className="ml-3 text-sm font-medium">{label}</span>
            <span className="ml-auto">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          </>
        )}
      </button>
      {isOpen && !collapsed && <div className="mt-1">{children}</div>}
    </div>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useApp();

  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const toggleCollapse = () => setCollapsed(!collapsed);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-md"
        onClick={toggleMobile}
      >
        <Menu size={20} />
      </button>
      
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900/50 z-40"
          onClick={closeMobile}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-40 transition-all duration-300 bg-blue-800 flex flex-col',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
          {!collapsed && (
            <h1 className="text-xl font-bold text-white">Cloud Telephony</h1>
          )}
          
          <button
            onClick={collapsed ? toggleCollapse : toggleMobile}
            className={cn(
              'p-1.5 rounded-md text-gray-300 hover:bg-blue-700 hover:text-white',
              collapsed && 'mx-auto'
            )}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} className="lg:hidden" />}
          </button>
          
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-md text-gray-300 hover:bg-blue-700 hover:text-white hidden lg:block"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex-grow overflow-y-auto py-4 px-2 space-y-1">
          <NavItem 
            to="/" 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            exact
            collapsed={collapsed}
            onClick={closeMobile}
          />
          <NavItem 
            to="/businesses" 
            icon={<Users />} 
            label="Businesses" 
            collapsed={collapsed}
            onClick={closeMobile}
          />
          <NavItem 
            to="/contact-requests" 
            icon={<MessageSquare />} 
            label="Contact Requests" 
            collapsed={collapsed}
            onClick={closeMobile}
          />
          <NavItem 
            to="/products" 
            icon={<Package />} 
            label="Products" 
            collapsed={collapsed}
            onClick={closeMobile}
          />
          <NavGroup 
            icon={<ShoppingBag />} 
            label="Orders" 
            collapsed={collapsed}
          >
            <NavItem 
              to="/orders" 
              icon={<ShoppingBag />}
              label="New Orders" 
              depth={1}
              onClick={closeMobile}
              collapsed={collapsed}
            />
            <NavItem 
              to="/paid-orders" 
              icon={<CreditCard />}
              label="Paid Orders" 
              depth={1}
              onClick={closeMobile}
              collapsed={collapsed}
            />
            <NavItem 
              to="/unpaid-orders" 
              icon={<ShoppingBag />}
              label="Unpaid Orders" 
              depth={1}
              onClick={closeMobile}
              collapsed={collapsed}
            />
          </NavGroup>
          <NavItem
            to="/reports"
            icon={<BarChart2 />}
            label="Reports"
            collapsed={collapsed}
            onClick={closeMobile}
          />
          <NavGroup
            icon={<SettingsIcon />}
            label="Settings"
            collapsed={collapsed}
          >
            <NavItem
              to="/settings"
              icon={<FileText />} 
              label="Content"
              depth={1}
              collapsed={collapsed}
              onClick={closeMobile}
            />
            <NavItem
              to="/settings/social-media" 
              icon={<Share2 />} 
              label="Social Media"
              depth={1}
              collapsed={collapsed}
              onClick={closeMobile}
            />
            <NavItem
              to="/settings/application-name"
              icon={<Type />}
              label="Application Name"
              depth={1}
              collapsed={collapsed}
              onClick={closeMobile}
            />
            <NavItem
              to="/settings/address"
              icon={<MapPin />}
              label="Address"
              depth={1}
              collapsed={collapsed}
              onClick={closeMobile}
            />
            <NavItem
              to="/settings/logos"
              icon={<Image />}
              label="Logos"
              depth={1}
              collapsed={collapsed}
              onClick={closeMobile}
            />
            <NavItem
              to="/settings/copyright-message"
              icon={<CopyrightIcon />}
              label="Copyright Message"
              depth={1}
              collapsed={collapsed}
              onClick={closeMobile}
            />
          </NavGroup>
        </div>
        
        {/* Sidebar footer */}
        <div className="mt-auto p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center w-full py-2.5 px-4 rounded-md transition-colors duration-200',
              'text-gray-300 hover:bg-blue-700 hover:text-white',
              collapsed && 'justify-center p-2'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
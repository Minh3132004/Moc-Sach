import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from '../../../../components/layout/navbar/BrandLogo';
import { useAuth } from '../../../../app/providers/AuthProvider';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import './AdminSidebar.css';

const NAV_ITEMS = [
    { to: '/admin/books',    icon: <MenuBookIcon fontSize="small" />, label: 'Sách'       },
    { to: '/admin/genres',   icon: <CategoryIcon fontSize="small" />, label: 'Thể loại'  },
    { to: '/admin/users',    icon: <GroupIcon fontSize="small" />, label: 'Tài khoản'  },
    { to: '/admin/orders',   icon: <ReceiptLongIcon fontSize="small" />, label: 'Đơn hàng'  },
    { to: '/admin/feedback', icon: <ForumIcon fontSize="small" />, label: 'Feedback'   },
    { to: '/admin/coupon',   icon: <LocalOfferIcon fontSize="small" />, label: 'Mã giảm giá'},
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener('mousedown', handler);
        }
        return () => document.removeEventListener('mousedown', handler);
    }, [showDropdown]);

    return (
        <div className='admin-sidebar'>
                {/* Header */}
                <div className='sidebar-header'>
                    <div className='sidebar-brand'>
                        <div className='sidebar-brand-logo'>
                            <BrandLogo />
                        </div>
                        <div className='sidebar-brand-meta'>
                            <div className='sidebar-brand-tag'>Admin Studio</div>
                            <div className='sidebar-brand-sub'>Quản trị Mộc Sách</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className='sidebar-nav'>
                    <div className='sidebar-section-label'>Quản lý</div>
                    {NAV_ITEMS.map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        >
                            <span className='nav-symbol'>{icon}</span>
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer / User Menu */}
                <div className='sidebar-footer' ref={dropdownRef}>
                    {showDropdown && (
                        <div className='admin-dropdown'>
                            <button className='dropdown-item' onClick={() => { setShowDropdown(false); navigate('/'); }}>
                                <HomeIcon fontSize="small" /> Về trang chủ
                            </button>
                            <div className='dropdown-sep' />
                            <button className='dropdown-item danger' onClick={() => { setShowDropdown(false); logout(); }}>
                                <LogoutIcon fontSize="small" /> Đăng xuất
                            </button>
                        </div>
                    )}
                    <button className='admin-button' onClick={() => setShowDropdown(!showDropdown)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldIcon fontSize="small" />
                            <span>Admin</span>
                        </div>
                        <KeyboardArrowDownIcon 
                            fontSize="small"
                            style={{
                                transition: 'transform 0.2s',
                                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                        />
                    </button>
                </div>
            </div>
    );
};

export default AdminSidebar;

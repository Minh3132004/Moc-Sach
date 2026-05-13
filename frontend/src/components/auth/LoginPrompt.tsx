import React from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';
import './LoginPrompt.css';

interface LoginPromptProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ 
  title = "Yêu cầu đăng nhập", 
  message = "Bạn cần đăng nhập để truy cập trang này. Vui lòng đăng nhập để tiếp tục trải nghiệm.",
  icon = <LockOutlinedIcon style={{ fontSize: 64 }} />
}) => {
  return (
    <div className="login-prompt-wrapper">
      <div className="login-prompt-card ms-book-card">
        <div className="login-prompt-icon">
          {icon}
        </div>
        <h2 className="login-prompt-title">{title}</h2>
        <p className="login-prompt-message">{message}</p>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { tab: 'login' } }))}
          className="login-prompt-btn"
          style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <LoginIcon fontSize="small" />
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;

import { useAuth } from "../../../../app/providers/AuthProvider";
import LoginPrompt from "../../../../components/auth/LoginPrompt";
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

function AccountOrdersPage() {
  const { user } = useAuth();
  
  if (!user?.id) {
    return (
      <LoginPrompt 
        title="Vui lòng đăng nhập"
        message="Bạn cần đăng nhập để xem danh sách đơn hàng của mình."
        icon={<ReceiptLongOutlinedIcon style={{ fontSize: 64 }} />}
      />
    );
  }
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Đơn hàng của tôi</h3>
      <p>Trang danh sách đơn hàng (bạn có thể nối API ở đây).</p>
    </div>
  );
}

export default AccountOrdersPage;

import { useAuth } from "../../../../app/providers/AuthProvider";
import LoginPrompt from "../../../../components/auth/LoginPrompt";
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

function AccountVouchersPage() {
  const { user } = useAuth();

  if (!user?.id) {
    return (
      <LoginPrompt 
        title="Vui lòng đăng nhập"
        message="Bạn cần đăng nhập để quản lý và sử dụng mã giảm giá."
        icon={<ConfirmationNumberOutlinedIcon style={{ fontSize: 64 }} />}
      />
    );
  }
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Mã giảm giá</h3>
      <p>Danh sách các mã giảm giá của bạn sẽ hiển thị ở đây.</p>
    </div>
  );
}

export default AccountVouchersPage;

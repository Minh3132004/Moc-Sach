import { useAuth } from "../../../app/providers/AuthProvider";
import { useUserBasicById } from "../../../features/user/hooks/useUserBasicById";

function AccountOverviewPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useUserBasicById(user?.id);

  const profile = data?.data;
  const fullName = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

  // Helper để lấy màu trạng thái
  const getStatusColor = (enabled: boolean) => (enabled ? "#10b981" : "#f59e0b");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      {/* 1. Header Profile: Avatar & Tên */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, paddingBottom: 24, borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <div style={{ 
          width: 100, 
          height: 100, 
          borderRadius: "50%", 
          background: profile?.avatar ? "transparent" : "linear-gradient(135deg, #2a8190 0%, #4facfe 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 800,
          color: "#fff",
          boxShadow: "0 10px 20px rgba(42, 129, 144, 0.2)",
          overflow: "hidden",
          border: profile?.avatar ? "2px solid #fff" : "none"
        }}>
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt={fullName} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
          ) : (
            profile?.firstName?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" }}>
            {fullName || "Người dùng mới"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ 
              display: "inline-block", 
              width: 10, 
              height: 10, 
              borderRadius: "50%", 
              background: getStatusColor(!!profile?.enabled) 
            }}></span>
            <span style={{ fontSize: 14, fontWeight: 600, color: profile?.enabled ? "#059669" : "#d97706" }}>
              {profile?.enabled ? "Tài khoản chính thức" : "Chờ kích hoạt"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Grid Thông tin chi tiết */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
        
        {/* Nhóm thông tin cá nhân */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2a8190", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Thông tin cá nhân
          </h3>
          
          <InfoItem label="Họ và tên" value={fullName} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
          <InfoItem label="Giới tính" value={profile?.gender === 'M' ? 'Nam' : (profile?.gender === 'F' ? 'Nữ' : 'Khác')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>} />
          <InfoItem label="Ngày sinh" value={profile?.dateOfBirth} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
        </div>

        {/* Nhóm thông tin liên lạc */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2a8190", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Liên lạc & Địa chỉ
          </h3>
          
          <InfoItem label="Email" value={profile?.email} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
          <InfoItem label="Số điện thoại" value={profile?.phoneNumber} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} />
          <InfoItem label="Địa chỉ giao hàng" value={profile?.deliveryAddress} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>} fullWidth />
        </div>
      </div>


      {(isLoading || isError) && (
        <div style={{ padding: 20, textAlign: "center", borderRadius: 16, background: "#fff1f2", color: "#be123c" }}>
          {isLoading ? "🔄 Đang tải dữ liệu hồ sơ..." : "⚠️ Không thể tải thông tin, vui lòng thử lại sau."}
        </div>
      )}
    </div>
  );
}

// Component phụ để render từng mục thông tin cho đẹp
function InfoItem({ label, value, icon, fullWidth }: { label: string, value: any, icon: React.ReactNode, fullWidth?: boolean }) {
  return (
    <div style={{ 
      gridColumn: fullWidth ? "1 / -1" : "span 1",
      display: "flex",
      alignItems: "flex-start",
      gap: 12
    }}>
      <div style={{ 
        width: 36, 
        height: 36, 
        borderRadius: 10, 
        background: "#f3f4f6", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontSize: 18,
        flexShrink: 0
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", wordBreak: "break-word" }}>
          {value || "(Chưa cập nhật)"}
        </div>
      </div>
    </div>
  );
}

export default AccountOverviewPage;

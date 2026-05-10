import { useState, useEffect } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useUserBasicById } from "../../../features/user/hooks/useUserBasicById";
import { useUpdateProfile } from "../../../features/user/hooks/useUpdateProfile";
import { toast } from "react-toastify";

function AccountOverviewPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useUserBasicById(user?.id);
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    deliveryAddress: "",
    email: ""
  });

  const profile = data?.data;

  // Cập nhật formData khi có dữ liệu profile từ API
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        gender: profile.gender || "",
        dateOfBirth: profile.dateOfBirth || "",
        phoneNumber: profile.phoneNumber || "",
        deliveryAddress: profile.deliveryAddress || "",
        email: profile.email || ""
      });
    }
  }, [profile]);

  const fullName = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    try {
      await updateProfileMutation.mutateAsync({
        idUser: user.id,
        ...formData,
        email: formData.email // email bắt buộc trong UserResponse
      });
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật!");
    }
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ 
                display: "inline-block", 
                width: 10, 
                height: 10, 
                borderRadius: "50%", 
                background: getStatusColor(!!profile?.enabled) 
              }}></span>
              <span style={{ fontSize: 14, fontWeight: 600, color: profile?.enabled ? "#059669" : "#d97706" }}>
                {profile?.enabled ? "Đã kích hoạt" : "Chưa kích hoạt"}
              </span>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  background: "none",
                  border: "1px solid #2a8190",
                  color: "#2a8190",
                  padding: "4px 12px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.2s"
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                Chỉnh sửa
              </button>
            )}
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
          
          <InfoItem 
            label="Họ" 
            name="firstName"
            value={isEditing ? formData.firstName : profile?.firstName} 
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
          />
          <InfoItem 
            label="Tên" 
            name="lastName"
            value={isEditing ? formData.lastName : profile?.lastName} 
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} 
          />
          <InfoItem 
            label="Giới tính" 
            name="gender"
            value={isEditing ? formData.gender : profile?.gender} 
            isEditing={isEditing}
            onChange={handleInputChange}
            isSelect
            options={[
              { label: "Nam", value: "M" },
              { label: "Nữ", value: "F" },
              { label: "Khác", value: "O" }
            ]}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>} 
          />
          <InfoItem 
            label="Ngày sinh" 
            name="dateOfBirth"
            type="date"
            value={isEditing ? formData.dateOfBirth : profile?.dateOfBirth} 
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} 
          />
        </div>

        {/* Nhóm thông tin liên lạc */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#2a8190", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Liên lạc & Địa chỉ
          </h3>
          
          <InfoItem 
            label="Email" 
            name="email"
            value={isEditing ? formData.email : profile?.email} 
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} 
          />
          <InfoItem 
            label="Số điện thoại" 
            name="phoneNumber"
            value={isEditing ? formData.phoneNumber : profile?.phoneNumber} 
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} 
          />
          <InfoItem 
            label="Địa chỉ giao hàng" 
            name="deliveryAddress"
            value={isEditing ? formData.deliveryAddress : profile?.deliveryAddress} 
            isEditing={isEditing}
            onChange={handleInputChange}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>} 
            fullWidth 
          />
        </div>
      </div>

      {isEditing && (
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 10 }}>
          <button 
            onClick={() => setIsEditing(false)}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#374151",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={updateProfileMutation.isPending}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: "#2a8190",
              color: "#fff",
              fontWeight: 700,
              cursor: updateProfileMutation.isPending ? "not-allowed" : "pointer",
              opacity: updateProfileMutation.isPending ? 0.7 : 1
            }}
          >
            {updateProfileMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      )}


      {(isLoading || isError) && (
        <div style={{ padding: 20, textAlign: "center", borderRadius: 16, background: "#fff1f2", color: "#be123c" }}>
          {isLoading ? "🔄 Đang tải dữ liệu hồ sơ..." : "⚠️ Không thể tải thông tin, vui lòng thử lại sau."}
        </div>
      )}
    </div>
  );
}

// Component phụ để render từng mục thông tin cho đẹp
function InfoItem({ 
  label, 
  value, 
  icon, 
  fullWidth, 
  isEditing, 
  name, 
  type = "text", 
  onChange,
  isSelect,
  options
}: { 
  label: string, 
  value: any, 
  icon: React.ReactNode, 
  fullWidth?: boolean,
  isEditing?: boolean,
  name?: string,
  type?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  isSelect?: boolean,
  options?: { label: string, value: string }[]
}) {
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
        flexShrink: 0,
        marginTop: isEditing ? 8 : 0
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 2 }}>
          {label}
        </div>
        
        {isEditing ? (
          isSelect ? (
            <select
              name={name}
              value={value || ""}
              onChange={onChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
                fontWeight: 600,
                color: "#1f2937",
                outline: "none",
                background: "#f9fafb",
                boxSizing: "border-box",
                transition: "all 0.2s"
              }}
            >
              <option value="">Chọn {label}</option>
              {options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={value || ""}
              onChange={onChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
                fontWeight: 600,
                color: "#1f2937",
                outline: "none",
                background: "#f9fafb",
                boxSizing: "border-box",
                transition: "all 0.2s",
                colorScheme: "light"
              }}
            />
          )
        ) : (
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", wordBreak: "break-word" }}>
            {isSelect 
              ? (options?.find(o => o.value === value)?.label || "(Chưa cập nhật)")
              : (value || "(Chưa cập nhật)")}
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountOverviewPage;

import { useState, useRef } from "react";
import { getCloudinarySignature } from "../../../../features/user/api/userApi";
import { useChangeAvatar } from "../../../../features/user/hooks/useChangeAvatar";
import { toast } from "react-toastify";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface AvatarUploadProps {
  userId: number;
  currentAvatar?: string;
  fullName: string;
  firstName?: string;
}

export function AvatarUpload({ userId, currentAvatar, fullName, firstName }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const changeAvatarMutation = useChangeAvatar();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 2MB!");
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Lấy signature từ backend
      const signatureResponse = await getCloudinarySignature("avatars");
      const { signature, timestamp, apiKey, cloudName, uploadPreset } = signatureResponse.data;

      // 2. Upload trực tiếp lên Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "avatars");

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const uploadResponse = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error?.message || "Upload lên Cloudinary thất bại");
      }

      const imageUrl = uploadResult.secure_url;

      // 3. Cập nhật URL vào database thông qua backend
      await changeAvatarMutation.mutateAsync({
        idUser: userId,
        avatarUrl: imageUrl
      });

      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error(error.message || "Có lỗi xảy ra khi tải ảnh lên!");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ position: "relative", cursor: isUploading ? "wait" : "pointer" }}>
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{ 
          width: 100, 
          height: 100, 
          borderRadius: "50%", 
          background: currentAvatar ? "transparent" : "linear-gradient(135deg, #2a8190 0%, #4facfe 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          fontWeight: 800,
          color: "#fff",
          boxShadow: "0 10px 20px rgba(42, 129, 144, 0.2)",
          overflow: "hidden",
          border: "2px solid #fff",
          transition: "all 0.3s ease",
          position: "relative"
        }}
        className="avatar-container"
      >
        {currentAvatar ? (
          <img 
            src={currentAvatar} 
            alt={fullName} 
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              opacity: isUploading ? 0.5 : 1
            }} 
          />
        ) : (
          <span style={{ opacity: isUploading ? 0.5 : 1 }}>
            {firstName?.charAt(0).toUpperCase() || "U"}
          </span>
        )}

        {/* Overlay khi hover hoặc đang loading */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isUploading ? 1 : 0,
          transition: "opacity 0.2s",
          color: "#fff"
        }}
        className="avatar-overlay"
        >
          {isUploading ? (
            <div className="avatar-spinner" />
          ) : (
            <PhotoCameraIcon />
          )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: "none" }} 
        accept="image/*"
      />

      <style>{`
        .avatar-container:hover .avatar-overlay {
          opacity: 1 !important;
        }
        .avatar-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

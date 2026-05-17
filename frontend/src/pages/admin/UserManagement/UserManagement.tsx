import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import RequireAdmin from "../RequireAdmin";
import Pagination from "../../../components/pagination/Pagination";
import { useUsersAdmin } from "../../../features/user/hooks/useUsersAdmin";
import { useAddUserByAdmin } from "../../../features/user/hooks/useAddUserByAdmin";
import { useUpdateUserByAdmin } from "../../../features/user/hooks/useUpdateUserByAdmin";
import { useToggleUserStatus } from "../../../features/user/hooks/useToggleUserStatus";
import type { UserResponse } from "../../../features/user/api/userApi";

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';

import './UserManagement.css';

// Helper to format Date to YYYY-MM-DD string for input
const formatDateToInput = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
    } catch {
        return '';
    }
};

// Helper to format Date for display (dd/mm/yyyy)
const formatDateDisplay = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('vi-VN');
    } catch {
        return '-';
    }
};

// Initial form states
const getEmptyAddForm = () => ({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
});

const getEmptyEditForm = () => ({
    idUser: 0,
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    deliveryAddress: "",
});

interface UserFormModalProps {
    isEdit: boolean;
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isSubmitting: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = React.memo(({
    isEdit,
    formData,
    setFormData,
    onSubmit,
    onClose,
    isSubmitting
}) => {
    const titleText = isEdit ? "CHỈNH SỬA TÀI KHOẢN" : "THÊM NGƯỜI DÙNG MỚI";
    const subtitleText = isEdit ? "Cập nhật hồ sơ người dùng" : "Tạo tài khoản mới cho hệ thống";

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const modalContent = (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={titleText}>
                <div className="admin-modal-header">
                    <div className="admin-modal-title">
                        <h5 className="admin-modal-title-main">{isEdit ? <span className="admin-modal-helper"><EditIcon fontSize="small" /> {titleText}</span> : <span className="admin-modal-helper"><AddIcon fontSize="small" /> {titleText}</span>}</h5>
                        <div className="admin-modal-title-sub">{subtitleText}</div>
                    </div>
                    <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Đóng modal">
                        <CloseIcon fontSize="small" />
                    </button>
                </div>

                <form className="admin-modal-form" onSubmit={onSubmit} noValidate onInvalid={(e) => e.preventDefault()}>
                    <div className="admin-modal-body">
                        <div className="admin-modal-grid-2">
                            <div className="admin-modal-field">
                                <label>
                                    Tên tài khoản <span style={{ color: "#EF4444" }}>*</span>
                                </label>
                                <input
                                    className="admin-modal-input"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Nhập tên tài khoản"
                                    required
                                    disabled={isEdit}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="admin-modal-field">
                                <label>
                                    Email <span style={{ color: "#EF4444" }}>*</span>
                                </label>
                                <input
                                    className="admin-modal-input"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Nhập email"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="admin-modal-grid-1">
                            <div className="admin-modal-field">
                                <label>
                                    Mật khẩu {!isEdit && <span style={{ color: "#EF4444" }}>*</span>}
                                </label>
                                <input
                                    className="admin-modal-input"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={isEdit ? "Để trống nếu không muốn đổi mật khẩu" : "Nhập mật khẩu (tối thiểu 8 ký tự)"}
                                    required={!isEdit}
                                    autoComplete={isEdit ? "new-password" : "current-password"}
                                />
                            </div>
                        </div>

                        <div className="admin-modal-grid-2">
                            <div className="admin-modal-field">
                                <label>
                                    Tên <span style={{ color: "#EF4444" }}>*</span>
                                </label>
                                <input
                                    className="admin-modal-input"
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="Nhập tên"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            <div className="admin-modal-field">
                                <label>
                                    Họ <span style={{ color: "#EF4444" }}>*</span>
                                </label>
                                <input
                                    className="admin-modal-input"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Nhập họ"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className={isEdit ? "admin-modal-grid-2 is-edit" : "admin-modal-grid-1"}>
                            <div className="admin-modal-field">
                                <label>
                                    Số điện thoại <span style={{ color: "#EF4444" }}>*</span>
                                </label>
                                <input
                                    className="admin-modal-input"
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="Nhập số điện thoại"
                                    required
                                    autoComplete="off"
                                />
                            </div>
                            {isEdit && (
                                <div className="admin-modal-field">
                                    <label>Ngày sinh</label>
                                    <input
                                        className="admin-modal-input admin-modal-date"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            )}
                        </div>

                        {isEdit && (
                            <>
                                <div className="admin-modal-grid-1">
                                    <div className="admin-modal-field">
                                        <label>Giới tính</label>
                                        <select
                                            className="admin-modal-select"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="">-- Chọn giới tính --</option>
                                            <option value="M">Nam</option>
                                            <option value="F">Nữ</option>
                                            <option value="K">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="admin-modal-grid-1">
                                    <div className="admin-modal-field">
                                        <label>Địa chỉ giao hàng</label>
                                        <textarea
                                            className="admin-modal-textarea"
                                            value={formData.deliveryAddress}
                                            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                            placeholder="Nhập địa chỉ giao hàng"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="admin-modal-footer">
                        <button
                            type="button"
                            className="admin-modal-btn secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="admin-modal-btn primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
});

UserFormModal.displayName = 'UserFormModal';

const UserManagement = () => {
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [newUser, setNewUser] = useState(getEmptyAddForm());
    const [editUser, setEditUser] = useState(getEmptyEditForm());

    // --- React Query: Fetch Users ---
    const { data: userData, isLoading, isError, error } = useUsersAdmin(currentPage, pageSize, keyword, "idUser,desc");

    const users = userData?.items || [];
    const totalPages = userData?.page?.totalPages || 1;
    // --- React Query: Add User Mutation ---
    const addUserMutation = useAddUserByAdmin({
        onSuccess: (_data: any, variables: any) => {
            toast.success(`Tài khoản "${variables.username}" đã được tạo thành công!`);
            setShowAddForm(false);
            setNewUser(getEmptyAddForm());
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (err: any) => {
            console.error(err);
            toast.error(err.message || "Tạo tài khoản thất bại từ máy chủ!");
        }
    });

    // --- React Query: Update User Mutation ---
    const updateUserMutation = useUpdateUserByAdmin({
        onSuccess: () => {
            toast.success("Cập nhật thông tin tài khoản thành công!");
            setShowEditForm(false);
            setEditUser(getEmptyEditForm());
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (err: any) => {
            console.error(err);
            toast.error(err.message || "Cập nhật tài khoản thất bại từ máy chủ!");
        }
    });

    // --- React Query: Toggle Status Mutation ---
    const toggleStatusMutation = useToggleUserStatus({
        onSuccess: () => {
            toast.success("Cập nhật trạng thái khóa/mở khóa thành công!");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        },
        onError: (err: any) => {
            console.error(err);
            toast.error(err.message || "Đã xảy ra lỗi khi cập nhật trạng thái!");
        }
    });

    const onToggleStatus = (user: UserResponse) => {
        toggleStatusMutation.mutate(user.idUser);
    };

    const validateForm = (data: any, isEditMode: boolean) => {
        if (!data.username.trim() && !isEditMode) {
            toast.error("Tên tài khoản không được để trống!");
            return false;
        }
        if (data.username.length < 3 && !isEditMode) {
            toast.error("Tên tài khoản phải có ít nhất 3 ký tự!");
            return false;
        }
        if (!data.email.trim()) {
            toast.error("Email không được để trống!");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            toast.error("Email không hợp lệ!");
            return false;
        }
        if (!isEditMode && !data.password.trim()) {
            toast.error("Mật khẩu không được để trống!");
            return false;
        }
        if (!isEditMode && (data.password.length < 8 || data.password.length > 64)) {
            toast.error("Mật khẩu phải có từ 8 đến 64 ký tự!");
            return false;
        }
        if (isEditMode && data.password.trim() && (data.password.length < 8 || data.password.length > 64)) {
            toast.error("Mật khẩu mới phải có từ 8 đến 64 ký tự!");
            return false;
        }
        if (!data.firstName.trim()) {
            toast.error("Tên không được để trống!");
            return false;
        }
        if (!data.lastName.trim()) {
            toast.error("Họ không được để trống!");
            return false;
        }
        if (!data.phoneNumber.trim()) {
            toast.error("Số điện thoại không được để trống!");
            return false;
        }
        return true;
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm(newUser, false)) return;
        addUserMutation.mutate(newUser);
    };

    const handleOpenEditForm = (user: UserResponse) => {
        setEditUser({
            idUser: user.idUser,
            username: user.username || "",
            email: user.email || "",
            password: "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phoneNumber: user.phoneNumber || "",
            dateOfBirth: formatDateToInput(user.dateOfBirth),
            gender: user.gender || "",
            deliveryAddress: user.deliveryAddress || "",
        });
        setShowEditForm(true);
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm(editUser, true)) return;

        const payload: any = {
            email: editUser.email,
            firstName: editUser.firstName,
            lastName: editUser.lastName,
            phoneNumber: editUser.phoneNumber,
            deliveryAddress: editUser.deliveryAddress,
        };

        if (editUser.dateOfBirth) payload.dateOfBirth = editUser.dateOfBirth;
        if (editUser.gender) payload.gender = editUser.gender;
        if (editUser.password.trim()) payload.password = editUser.password.trim();

        updateUserMutation.mutate({ id: editUser.idUser, payload });
    };

    return (
        <div className="container-fluid py-2">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                <div>
                    <h3 className="fw-bold text-dark m-0" style={{ fontSize: "24px", letterSpacing: "-0.5px" }}>Quản lý tài khoản</h3>
                    <p className="text-muted m-0 mt-1" style={{ fontSize: "13.5px" }}>Xem danh sách, chỉnh sửa thông tin, khóa hoặc mở khóa tài khoản người dùng.</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: "relative" }}>
                        <SearchIcon 
                            style={{ 
                                position: "absolute", 
                                left: "14px", 
                                top: "50%", 
                                transform: "translateY(-50%)", 
                                color: "#94A3B8",
                                fontSize: "20px"
                            }} 
                        />
                        <input
                            className="search-input"
                            placeholder="Tìm kiếm tài khoản..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setCurrentPage(0); // Reset page on new search
                            }}
                            style={{ paddingLeft: "40px" }}
                        />
                    </div>
                    <button
                        className="add-btn"
                        onClick={() => setShowAddForm(true)}
                    >
                        <AddIcon fontSize="small" />
                        Thêm tài khoản
                    </button>
                </div>
            </div>

            {isError && (
                <div className="alert alert-danger" role="alert">
                    Lỗi khi tải dữ liệu người dùng: {(error as any)?.message}
                </div>
            )}

            <div className="admin-card">
                <div className="table-responsive">
                    <table className="table admin-table mb-0 align-middle">
                        <thead>
                            <tr>
                                <th>Tên đăng nhập</th>
                                <th>Họ & Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Ngày sinh</th>
                                <th style={{ width: "160px" }}>Trạng thái</th>
                                <th style={{ width: "240px", textAlign: "center" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <div className="spinner-border text-dark spinner-border-sm me-2" role="status"></div>
                                        <span className="text-muted fw-semibold">Đang tải dữ liệu...</span>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !isError && users.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted fw-semibold">
                                        📭 Không tìm thấy kết quả phù hợp!
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !isError && users.map((u: UserResponse) => (
                                <tr key={u.idUser}>
                                    <td className="fw-semibold text-dark">{u.username}</td>
                                    <td>{`${u.firstName || ''} ${u.lastName || ''}`.trim() || '-'}</td>
                                    <td className="text-muted">{u.email}</td>
                                    <td>{u.phoneNumber || '-'}</td>
                                    <td>{formatDateDisplay(u.dateOfBirth)}</td>
                                    <td>
                                        <span 
                                            className="badge rounded-pill admin-status-badge"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                whiteSpace: "nowrap",
                                                backgroundColor: u.enabled ? "rgba(22, 163, 74, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                                color: u.enabled ? "#16A34A" : "#EF4444",
                                                padding: "6px 12px",
                                                fontWeight: 600,
                                                fontSize: "12px"
                                            }}
                                        >
                                            ● {u.enabled ? 'Đang hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", width: "100%" }}>
                                            <button
                                                className="btn-action btn-edit"
                                                onClick={() => handleOpenEditForm(u)}
                                                style={{ width: "90px" }}
                                            >
                                                <EditIcon style={{ fontSize: '16px' }} />
                                                Sửa
                                            </button>
                                            <button
                                                className={`btn-action btn-toggle ${u.enabled ? 'active' : 'inactive'}`}
                                                onClick={() => onToggleStatus(u)}
                                                disabled={toggleStatusMutation.isPending}
                                                style={{ width: "90px" }}
                                            >
                                                {u.enabled ? (
                                                    <LockIcon style={{ fontSize: '16px' }} />
                                                ) : (
                                                    <LockOpenIcon style={{ fontSize: '16px' }} />
                                                )}
                                                {u.enabled ? 'Khóa' : 'Mở'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                        <Pagination
                            currentPage={currentPage + 1}
                            totalPages={totalPages}
                            handlePagination={(page: number) => setCurrentPage(page - 1)}
                        />
                    </div>
                )}
            </div>

            {/* Modal for Add User */}
            {showAddForm && (
                <UserFormModal
                    isEdit={false}
                    formData={newUser}
                    setFormData={setNewUser}
                    onSubmit={handleAddUser}
                    onClose={() => {
                        setShowAddForm(false);
                        setNewUser(getEmptyAddForm());
                    }}
                    isSubmitting={addUserMutation.isPending}
                />
            )}

            {/* Modal for Edit User */}
            {showEditForm && (
                <UserFormModal
                    isEdit={true}
                    formData={editUser}
                    setFormData={setEditUser}
                    onSubmit={handleUpdateUser}
                    onClose={() => {
                        setShowEditForm(false);
                        setEditUser(getEmptyEditForm());
                    }}
                    isSubmitting={updateUserMutation.isPending}
                />
            )}
        </div>
    );
};

const UserManagementPage = RequireAdmin(UserManagement);
export default UserManagementPage;

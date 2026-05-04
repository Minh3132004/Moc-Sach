import React from "react";
import "./TopBuyers.css";
import { useTopBuyers } from "../../../features/order/hooks/useTopBuyers";
import leaderboardBanner from "../../../assets/banners/thiet-ke-bang-xep-hang.jpg";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

function formatCurrency(value: number): string {
    return `${new Intl.NumberFormat("vi-VN").format(Math.round(value))} VND`;
}

function maskPhone(phoneNumber: string): string {
    if (!phoneNumber) return "";
    const clean = phoneNumber.replace(/\s+/g, "");
    if (clean.length <= 4) return clean;
    const visible = clean.slice(-3);
    return `${"*".repeat(Math.max(0, clean.length - 3))}${visible}`;
}

function getDisplayName(firstName: string, lastName: string, username: string): string {
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    return fullName || username || "Khách hàng";
}

function getInitials(name: string): string {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
    return `${first}${last}`;
}

const TopBuyers: React.FC = () => {
    const { data: buyers, isLoading, isError, error } = useTopBuyers(100);
    const updatedAt = new Date();

    if (isLoading) return <div className="top-buyers-loading">Đang tải bảng xếp hạng...</div>;
    if (isError) {
        return (
            <div className="top-buyers-error">
                Lỗi: {error instanceof Error ? error.message : "Lỗi tải dữ liệu!"}
            </div>
        );
    }

    if (!buyers || buyers.length === 0) {
        return <div className="top-buyers-empty">Chưa có dữ liệu xếp hạng.</div>;
    }

    return (
        <div className="top-buyers-container">
            <div className="top-buyers-header">
                <div className="top-buyers-header-left">
                    <div className="top-buyers-icon-wrapper">
                        <EmojiEventsIcon className="top-buyers-icon" />
                    </div>
                    <div className="top-buyers-title-group">
                        <h2 className="top-buyers-title">Bảng xếp hạng</h2>
                        <span className="top-buyers-subtitle">Người mua nhiều nhất tháng</span>
                    </div>
                </div>
                <span className="top-buyers-updated">
                    Cập nhật lúc: {updatedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} {updatedAt.toLocaleDateString("vi-VN")}
                </span>
            </div>
            <div className="top-buyers-body">
                <div className="top-buyers-banner">
                    <img src={leaderboardBanner} alt="Top buyers" />
                </div>
                <div className="top-buyers-panel">
                    <div className="top-buyers-list">
                        {buyers.map((buyer, index) => {
                            const displayName = getDisplayName(buyer.firstName, buyer.lastName, buyer.username);
                            const initials = getInitials(displayName);

                            return (
                                <div
                                    key={`${buyer.idUser}-${index}`}
                                    className={`top-buyer-row rank-row-${index + 1} ${index < 3 ? "top-buyer-highlight" : ""}`}
                                >
                                    <div className={`top-buyer-rank rank-${index + 1}`}>
                                        {index + 1}
                                    </div>
                                    <div className="top-buyer-avatar">
                                        {buyer.avatar ? (
                                            <img src={buyer.avatar} alt={displayName} />
                                        ) : (
                                            <span className="top-buyer-avatar-fallback">{initials}</span>
                                        )}
                                        {index < 3 && (
                                            <div className={`avatar-star star-${index + 1}`}>
                                                <StarIcon style={{ fontSize: '12px' }} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="top-buyer-info">
                                        <div className="top-buyer-name">{displayName}</div>
                                        <div className="top-buyer-phone">{maskPhone(buyer.phoneNumber)}</div>
                                    </div>
                                    <div className="top-buyer-total">{formatCurrency(buyer.totalOrderValue)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBuyers;


import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import { useFilterBooks } from '../../../features/book/hooks';
import { useBookById } from '../../../features/book/hooks/useBookById';
import { useImagesByBook } from '../../../features/image/hooks/useImagesByBook';
import { createPortal } from 'react-dom';
import Pagination from '../../../components/pagination/Pagination';

import './BookManagement.css';

const BookManagement = () => {
    const [keyword, setKeyword] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;
    const [viewBookId, setViewBookId] = useState<number | null>(null);

    // Lấy dữ liệu danh sách sách. Truyền bookName là searchQuery, author là chuỗi rỗng.
    const { data: bookData, isLoading, isError, error } = useFilterBooks(
        searchQuery,      // bookName
        "",               // author
        [],               // genreIds
        undefined,        // minPrice
        undefined,        // maxPrice
        "newest",         // sort
        pageSize,         // size
        currentPage       // page
    );

    const books = bookData?.bookList || [];
    const totalPages = bookData?.totalPages || 1;

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchQuery(keyword);
            setCurrentPage(0);
        }
    };

    const handleSearchClick = () => {
        setSearchQuery(keyword);
        setCurrentPage(0);
    };

    // Hàm format giá tiền
    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '-';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleAddBook = () => {
        toast.info("Chức năng thêm sách đang được phát triển!");
    };

    const handleEditBook = (bookId: number) => {
        toast.info(`Chức năng cập nhật sách (ID: ${bookId}) đang được phát triển!`);
    };

    const handleDeleteBook = (bookId: number) => {
        toast.warning(`Chức năng xoá sách (ID: ${bookId}) đang được phát triển!`);
    };

    // Book detail modal
    const BookDetailModal: React.FC<{ id: number; onClose: () => void }> = ({ id, onClose }) => {
        const { data: book, isLoading, isError } = useBookById(id);
        const { data: images } = useImagesByBook(id);

        useEffect(() => {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }, []);

        const content = (
            <div className="admin-modal-overlay" onClick={onClose}>
                <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                    <div className="admin-modal-header">
                        <div className="admin-modal-title">
                            <h5 className="admin-modal-title-main"><span className="admin-modal-helper"><VisibilityIcon fontSize="small" /> CHI TIẾT SÁCH</span></h5>
                            <div className="admin-modal-title-sub">Xem chi tiết sách</div>
                        </div>
                        <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Đóng modal">×</button>
                    </div>
                    <div className="admin-modal-body">
                        {isLoading ? (
                            <div className="text-center py-4 text-muted">Đang tải chi tiết sách...</div>
                        ) : isError || !book ? (
                            <div className="text-center py-4 text-danger">Không thể tải thông tin sách!</div>
                        ) : (
                            <div className="admin-modal-grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', padding: '8px' }}>
                                <div className="admin-modal-field" style={{ gridColumn: 'span 2' }}>
                                    <h3 style={{ margin: 0, fontWeight: 700, color: '#1E293B', fontSize: '20px' }}>{book.nameBook || 'Đang cập nhật'}</h3>
                                </div>
                                <div className="admin-modal-field">
                                    <label style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>Tác giả</label>
                                    <div className="admin-modal-input" style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '45px', display: 'flex', alignItems: 'center' }}>
                                        {book.author || 'Đang cập nhật'}
                                    </div>
                                </div>
                                <div className="admin-modal-field">
                                    <label style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>Thể loại</label>
                                    <div className="admin-modal-input" style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '45px', display: 'flex', alignItems: 'center' }}>
                                        {book.genres && book.genres.length > 0 ? book.genres.map((g: any) => g.nameGenre).join(', ') : 'Đang cập nhật'}
                                    </div>
                                </div>
                                <div className="admin-modal-field">
                                    <label style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>Giá niêm yết</label>
                                    <div className="admin-modal-input" style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '45px', display: 'flex', alignItems: 'center' }}>
                                        {book.listPrice !== undefined && book.listPrice !== null ? formatPrice(book.listPrice) : 'Đang cập nhật'}
                                    </div>
                                </div>
                                <div className="admin-modal-field">
                                    <label style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>Giá bán</label>
                                    <div className="admin-modal-input" style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '45px', display: 'flex', alignItems: 'center' }}>
                                        <b style={{ color: '#dc2626' }}>{book.sellPrice !== undefined && book.sellPrice !== null ? formatPrice(book.sellPrice) : 'Đang cập nhật'}</b>
                                    </div>
                                </div>
                                <div className="admin-modal-field">
                                    <label style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>Số lượng tồn kho</label>
                                    <div className="admin-modal-input" style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '45px', display: 'flex', alignItems: 'center' }}>
                                        {book.quantity !== undefined && book.quantity !== null ? book.quantity : 'Đang cập nhật'}
                                    </div>
                                </div>
                                <div className="admin-modal-field">
                                    <label style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>Đã bán</label>
                                    <div className="admin-modal-input" style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '45px', display: 'flex', alignItems: 'center' }}>
                                        {book.soldQuantity !== undefined && book.soldQuantity !== null ? book.soldQuantity : 'Đang cập nhật'}
                                    </div>
                                </div>
                                <div className="admin-modal-field" style={{ gridColumn: 'span 2' }}>
                                    <label style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>Mô tả</label>
                                    <div className="admin-modal-input" style={{ backgroundColor: '#F8FAFC', color: '#1E293B', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', minHeight: '45px', display: 'flex', alignItems: 'center', whiteSpace: 'pre-wrap' }}>
                                        {book.description || 'Đang cập nhật'}
                                    </div>
                                </div>
                                {images && images.length > 0 && (
                                    <div className="admin-modal-field" style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>Hình ảnh ({images.length})</label>
                                        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="image-scroll-container">
                                            {images.map((img: any, idx: number) => (
                                                <img key={idx} src={img.urlImage} alt={img.nameImage || `book-img-${idx}`} style={{ height: '140px', width: 'auto', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#fff', flexShrink: 0 }} />
                                            ))}
                                        </div>
                                        <style>{`.image-scroll-container::-webkit-scrollbar { display: none; }`}</style>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="admin-modal-footer">
                        <button type="button" className="admin-modal-btn secondary" onClick={onClose}>Đóng</button>
                    </div>
                </div>
            </div>
        );

        return createPortal(content, document.body);
    };

    return (
        <div className="container-fluid py-2">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                <div>
                    <h3 className="fw-bold text-dark m-0" style={{ fontSize: "24px", letterSpacing: "-0.5px" }}>Quản lý sách</h3>
                    <p className="text-muted m-0 mt-1" style={{ fontSize: "13.5px" }}>Xem danh sách, tìm kiếm, chỉnh sửa và quản lý kho sách.</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: "relative", display: 'flex', alignItems: 'center' }}>
                        <SearchIcon 
                            style={{ 
                                position: "absolute", 
                                left: "14px",
                                color: "#94A3B8",
                                fontSize: "20px",
                                cursor: "pointer"
                            }} 
                            onClick={handleSearchClick}
                        />
                        <input
                            className="search-input"
                            placeholder="Tìm kiếm theo tên sách hoặc tác giả"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleSearch}
                            style={{ paddingLeft: "40px" }}
                        />
                    </div>
                    <button
                        className="add-btn"
                        onClick={handleAddBook}
                    >
                        <AddIcon fontSize="small" />
                        Thêm sách mới
                    </button>
                </div>
            </div>

            {isError && (
                <div className="alert alert-danger" role="alert">
                    Lỗi khi tải dữ liệu sách: {(error as any)?.message}
                </div>
            )}

            {viewBookId !== null && (
                <BookDetailModal id={viewBookId} onClose={() => setViewBookId(null)} />
            )}

            <div className="admin-card">
                <div className="table-responsive">
                    <table className="table admin-table mb-0 align-middle">
                        <thead>
                            <tr>
                                <th>Tên Sách</th>
                                <th>Tác giả</th>
                                <th>Thể loại</th>
                                <th style={{ textAlign: "right" }}>Giá niêm yết</th>
                                <th style={{ textAlign: "right" }}>Giá bán</th>
                                <th style={{ textAlign: "center" }}>Tồn kho</th>
                                <th style={{ width: "140px", textAlign: "center" }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">Đang tải danh sách sách...</td>
                                </tr>
                            ) : books.length > 0 ? (
                                books.map((book: any) => (
                                    <tr key={book.idBook}>
                                        <td>
                                            <div className="fw-semibold text-dark" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {book.nameBook}
                                            </div>
                                        </td>
                                        <td>{book.author}</td>
                                        <td>
                                            <span style={{ fontSize: '13px', color: '#475569' }}>
                                                {book.genres?.map((g: any) => g.nameGenre).join(', ') || '-'}
                                            </span>
                                        </td>
                                        <td className="text-end fw-medium text-muted" style={{ fontSize: '0.9em' }}>
                                            {formatPrice(book.listPrice)}
                                        </td>
                                        <td className="text-end fw-semibold text-danger">
                                            {formatPrice(book.sellPrice)}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge-stock ${book.quantity > 10 ? 'in-stock' : book.quantity > 0 ? 'low-stock' : 'out-of-stock'}`}>
                                                {book.quantity > 0 ? book.quantity : 'Hết hàng'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btn-group justify-content-center">
                                                    <button
                                                        className="btn-icon view"
                                                        title="Xem"
                                                        onClick={() => setViewBookId(book.idBook)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </button>
                                                    <button 
                                                        className="btn-icon edit" 
                                                        title="Chỉnh sửa"
                                                        onClick={() => handleEditBook(book.idBook)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </button>
                                                <button 
                                                    className="btn-icon delete" 
                                                    title="Xóa"
                                                    onClick={() => handleDeleteBook(book.idBook)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">Không tìm thấy sách nào!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {totalPages > 1 && (
                    <div style={{ padding: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'center' }}>
                        <Pagination 
                            currentPage={currentPage + 1} 
                            totalPages={totalPages} 
                            handlePagination={(page: number) => setCurrentPage(page - 1)} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookManagement;
import React from "react";
import "./NewBooks.css";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useNewBooks } from "../../../features/book/hooks";
import FlashSaleItem from "../flashsale/FlashSaleItem";

const NewBooks: React.FC = () => {
    const { data: newBooksData, isLoading, isError, error } = useNewBooks(10);

    if (isLoading) return <div className="new-books-loading">Đang tải sách mới...</div>;
    if (isError) {
        return (
            <div className="new-books-error">
                Lỗi: {error instanceof Error ? error.message : "Lỗi tải dữ liệu!"}
            </div>
        );
    }

    const books = newBooksData?.bookList || [];
    const hasBooks = books.length > 0;

    return (
        <div className="new-books-container">
            <div className="new-books-header">
                <AutoStoriesIcon className="new-books-icon" />
                <span className="new-books-title">Sách mới cập nhật</span>
            </div>
            <div className="new-books-content">
                {hasBooks ? (
                    <div className="new-books-grid">
                        {books.map((book) => (
                            <FlashSaleItem key={book.idBook} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="new-books-empty">Chưa có sách mới.</div>
                )}
            </div>
        </div>
    );
};

export default NewBooks;

import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "./AllBooksPage.css";
import { useFilterBooks } from "../../features/book/hooks";
import { useAllGenres } from "../../features/genre/hooks/useAllGenres";
import Pagination from "../../components/pagination/Pagination";
import FlashSaleItem from "../../components/homepage/flashsale/FlashSaleItem";

const PAGE_SIZE_OPTIONS = [8, 12, 24];

type SortOption = "newest" | "bestselling" | "price_asc" | "price_desc";

const AllBooksPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [sortBy, setSortBy] = useState<SortOption>("bestselling");
  const [authorKeyword, setAuthorKeyword] = useState<string>("");
  const [displayAuthor, setDisplayAuthor] = useState<string>("");
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number } | null>(null);
  const [searchParams] = useSearchParams();

  const authorQuery = authorKeyword.trim();

  const { data, isLoading, isError, error } = useFilterBooks(
    authorQuery, // bookName or author search keyword
    "",          // author empty
    selectedGenreIds,
    priceRange?.min,
    priceRange?.max,
    sortBy,
    pageSize,
    currentPage - 1
  );

  const { data: genres } = useAllGenres();

  const books = data?.bookList ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handlePagination = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAuthorChange = (value: string) => {
    setDisplayAuthor(value);
  };

  // Debounce author search
  useEffect(() => {
    const handler = setTimeout(() => {
      setAuthorKeyword(displayAuthor);
      setCurrentPage(1);
    }, 500); // Đợi 500ms sau khi ngừng gõ mới search

    return () => clearTimeout(handler);
  }, [displayAuthor]);

  useEffect(() => {
    const genreParam = searchParams.get("genreIds");
    if (!genreParam) return;

    const parsedIds = genreParam
      .split(",")
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);

    if (parsedIds.length > 0) {
      setSelectedGenreIds(parsedIds);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    if (priceRange?.min === min && priceRange?.max === max) {
      setPriceRange(null);
    } else {
      setPriceRange({ min, max });
    }
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setDisplayAuthor("");
    setAuthorKeyword("");
    setSelectedGenreIds([]);
    setPriceRange(null);
    setCurrentPage(1);
  };

  if (isLoading) return <div className="loading-container">Đang tải dữ liệu sách...</div>;
  if (isError) {
    return (
      <div className="error-container">Lỗi: {error instanceof Error ? error.message : "Lỗi tải dữ liệu!"}</div>
    );
  }

  return (
    <div className="allbooks-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">TRANG CHỦ</Link>
          <ArrowForwardIosIcon className="breadcrumb-icon" />
          <span className="breadcrumb-current">TỔNG HỢP SẢN PHẨM</span>
        </nav>

        <div className="allbooks-body">
          <aside className="allbooks-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">NHÓM SẢN PHẨM</div>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">TÊN SÁCH , TÁC GIẢ</div>
              <input
                className="sidebar-input"
                value={displayAuthor}
                onChange={(e) => handleAuthorChange(e.target.value)}
                placeholder="Nhập tên sách , tên tác giả..."
              />
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">GIÁ</div>
              <label className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={priceRange?.min === 0 && priceRange?.max === 150000}
                  onChange={() => handlePriceRangeChange(0, 150000)}
                />
                0 - 150,000
              </label>
              <label className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={priceRange?.min === 150000 && priceRange?.max === 300000}
                  onChange={() => handlePriceRangeChange(150000, 300000)}
                />
                150,000 - 300,000
              </label>
              <label className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={priceRange?.min === 300000 && priceRange?.max === 500000}
                  onChange={() => handlePriceRangeChange(300000, 500000)}
                />
                300,000 - 500,000
              </label>
              <label className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={priceRange?.min === 500000 && priceRange?.max === 700000}
                  onChange={() => handlePriceRangeChange(500000, 700000)}
                />
                500,000 - 700,000
              </label>
              <label className="sidebar-checkbox">
                <input
                  type="checkbox"
                  checked={priceRange?.min === 700000 && priceRange?.max === undefined}
                  onChange={() => handlePriceRangeChange(700000, undefined)}
                />
                700,000 - Trở Lên
              </label>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">THỂ LOẠI</div>
              {(genres ?? []).length === 0 ? (
                <div className="sidebar-note">Không có dữ liệu thể loại.</div>
              ) : (
                (genres ?? []).map((g) => (
                  <label key={g.idGenre} className="sidebar-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedGenreIds.includes(g.idGenre)}
                      onChange={() => toggleGenre(g.idGenre)}
                    />
                    {g.nameGenre}
                  </label>
                ))
              )}
            </div>

            {(authorKeyword || selectedGenreIds.length > 0 || priceRange) && (
              <button className="sidebar-clear-all" onClick={clearAllFilters}>
                Xóa tất cả bộ lọc
              </button>
            )}
          </aside>

          <section className="allbooks-content">
            <div className="allbooks-toolbar">
              <div className="toolbar-left">
                <span className="toolbar-label">Sắp xếp theo:</span>
                <select
                  className="toolbar-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="bestselling">Bán chạy nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                </select>
              </div>

              <div className="toolbar-right">
                <select
                  className="toolbar-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s} sản phẩm
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {books.length === 0 ? (
              <div className="allbooks-empty">Hiện chưa có dữ liệu sách.</div>
            ) : (
              <>
                <div className="allbooks-grid">
                  {books.map((book) => (
                    <FlashSaleItem key={book.idBook} book={book} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePagination={handlePagination}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AllBooksPage;

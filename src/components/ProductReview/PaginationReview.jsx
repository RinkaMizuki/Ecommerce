import { Pagination } from "@mui/material";
import styles from "./ProductReview.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles)


const PaginationReview = ({ nPages, currentPage, setCurrentPage }) => {

  return (
    <Pagination count={nPages} defaultPage={1} siblingCount={0} page={currentPage} onChange={(e, page) => setCurrentPage(page)} />
  )
}

export default PaginationReview
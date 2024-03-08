import styles from "./ProductReview.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles)


const Pagination = ({ nPages, currentPage, setCurrentPage }) => {

  const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1)
  }
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1)
  }
  return (
    <nav>
      <ul className='pagination justify-content-center'>
        <li className="page-item">
          <a className="page-link"
            onClick={goToPrevPage}
          >
            <span aria-hidden="true">&laquo;</span>
            <span className="sr-only">Previous</span>
          </a>
        </li>
        {pageNumbers.map(pgNumber => (
          <li key={pgNumber}
            className={cx(`page-item ${currentPage == pgNumber ? 'active' : ''} `)} >
            <a onClick={() => setCurrentPage(pgNumber)}
              className='page-link'
            >
              {pgNumber}
            </a>
          </li>
        ))}
        <li className="page-item">
          <a className="page-link"
            onClick={goToNextPage}
            >
            <span aria-hidden="true">&raquo;</span>
            <span className="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
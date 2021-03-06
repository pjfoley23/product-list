import React from "react";
import { connect } from "react-redux";
import { Col, Row, Pagination, PaginationItem, PaginationLink} from "reactstrap";
import { bindActionCreators } from "redux";
import { setCurrentPage, fetchProducts } from "../actions";

const CatalogIndex = (props) => {
  let pageCount = Math.ceil(props.products.count / 9);

  //edge case: if results of query result in less pages than current page number, start at 1
  if (props.currentPage > pageCount) {
    props.setCurrentPage(1);
    props.fetchProducts(1, props.category, props.searchTerm, props.sortOrder);
  }

  const printPageLinks = () => {
    let pagesLinks = [];
    for (let p = 0; p < pageCount; p++) {
      // I really wanted this to work but my arrays keep becoming objects that JSX won't parse
      // let activePage = props.currentPage === p+1 ? ' active>' : '>';
      // let pageTagOpen = `<PaginationItem key='${p}'${activePage}`;
      // let pageContent = `<PaginationLink href='#'><span onClick={userSetPage}>${p+1}</span></PaginationLink>`;
      // let pageTagClose = '</PaginationItem';
      //   pagesLinks.push( pageTagOpen + pageContent + pageTagClose );

      // and this doesn't work except for page 1; I'm assuming it gets rendered before the prop is updated
      if (props.currentPage === p + 1) {
        console.log("making active page link");
        pagesLinks.push(
          <PaginationItem key={p} active>
            <PaginationLink href="#">
              <span onClick={userSetPage}>{p + 1}</span>
            </PaginationLink>
          </PaginationItem>
        );
      } else {
        console.log("making non-active page link");
        pagesLinks.push(
          <PaginationItem key={p}>
            <PaginationLink href="#">
              <span onClick={userSetPage}>{p + 1}</span>
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    // console.log('pagesLinks is a' + typeof(pagesLinks) );
    // console.log('it look like', pagesLinks);

    return pagesLinks;
  };
  // let paginationJSX = printPageLinks();

  const userSetPage = (changeEvent) => {
    console.log("Page changed to: ", changeEvent.currentTarget.textContent);
    props.setCurrentPage(changeEvent.currentTarget.textContent);
    props.fetchProducts(
      changeEvent.currentTarget.textContent,
      props.category,
      props.searchTerm,
      props.sortOrder
    );
  };

  const userFirstPage = () => {
    console.log("Page changed to: ", 1);
    props.fetchProducts(1, props.category, props.searchTerm, props.sortOrder);
    props.setCurrentPage(1);
  };

  const userLastPage = () => {
    props.fetchProducts(
      pageCount,
      props.category,
      props.searchTerm,
      props.sortOrder
    );
    console.log("Page changed to: ", pageCount);
    props.setCurrentPage(pageCount);
  };

  const userNextPage = () => {
    props.fetchProducts(
      props.currentPage + 1 >= pageCount ? pageCount : props.currentPage + 1,
      props.category,
      props.searchTerm,
      props.sortOrder
    );
    console.log(
      "Page changed to: ",
      props.currentPage + 1 >= pageCount ? pageCount : props.currentPage + 1
    );
    props.setCurrentPage(
      props.currentPage + 1 >= pageCount ? pageCount : props.currentPage + 1
    );
  };

  const userPrevPage = () => {
    props.fetchProducts(
      props.currentPage - 1 <= 1 ? 1 : props.currentPage - 1,
      props.category,
      props.searchTerm,
      props.sortOrder
    );
    console.log(
      "Page changed to: ",
      props.currentPage - 1 <= 1 ? 1 : props.currentPage - 1
    );
    props.setCurrentPage(
      props.currentPage - 1 <= 1 ? 1 : props.currentPage - 1
    );
  };

  return (
    <div>
      <Row>
        <Col>
          <p className="text-center">
            Total products available in this search: {props.products.count}{" "}
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs="1" sm="3" />
        <Col xs="6" sm="6">
          <Pagination aria-label="Page navigation">
            <PaginationItem>
              <PaginationLink first href="#" onClick={userFirstPage} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink previous href="#" onClick={userPrevPage} />
            </PaginationItem>
            {printPageLinks()}
            {/* {paginationJSX.map((pageBox) => pageBox)} */}
            <PaginationItem>
              <PaginationLink next href="#" onClick={userNextPage} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink last href="#" onClick={userLastPage} />
            </PaginationItem>
          </Pagination>
        </Col>
        <Col sm="3" />
      </Row>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    products: state.products,
    currentPage: state.currentPage,
    sortOrder: state.sortOrder,
    searchTerm: state.searchTerm,
    category: state.category,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchProducts,
      setCurrentPage,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogIndex);

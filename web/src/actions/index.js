import axios from 'axios';
// import albumItems from '../data/album';
// action for calling products via API
export const FETCH_PRODUCTS = 'fetch_products';

const ROOT_URL = 'http://localhost:8000/products?';

export function fetchProducts(page, category, search, sort) {
  console.log('In actions index/ fetchProducts()')
  // TODO separate quantity? (thinking this is a wasted call to db)
  let queryBuild = '';
  if (search) {
    queryBuild = queryBuild + `q=${search}&`
  }
  if (page) {
    queryBuild = queryBuild + `page=${page}&`;
  }
  if (category) {
    queryBuild = queryBuild + `category=${category}`
  }

  const request = axios.get(
    `${ROOT_URL}${queryBuild}`
  );
  // ?=${search}&page=${page}&category=${category}
  // TODO handle sort
console.log('got', request);
console.log(` and page: ${page} and category: ${category} and search: ${search}`);
  return {
    type: FETCH_PRODUCTS,
    payload: request
  };
}

//sent to reducers to fetch data

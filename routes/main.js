const router = require('express').Router()
const faker = require('faker')
const Product = require('../models/product')
const Review = require('../models/review')

router.get('/generate-fake-data', (req, res, next) => {
  for (let i = 0; i < 90; i++) {
    let product = new Product()

    product.category = faker.commerce.department()
    product.name = faker.commerce.productName()
    product.price = faker.commerce.price()
    product.image = `https://picsum.photos/seed/${product.name}/250/`
    // product.image = 'https://placeimg.com/250/250/any'
    // product.image = 'https://via.placeholder.com/250?text=Product+Image'

    product.save((err) => {
      if (err) throw err
    })
  }
  res.end()
})

// get all products, ?page= for starting page
// 2) ?/&category= option
// 3) sort by ?/&price=highest/lowest
// 4) ?/&query= search results product name, make case insensitive if possible
// count of products returned needs to dynamically reflect results
router.get('/products/', (req, res, next) => {
  const perPage = 9

  // return the first page by default
  const page = req.query.page || 1

  console.log('products by sort ', req.query.price)
  //clean up this mess of quotes // TODO look this up in Express 
  if (req.query.price) {
    req.query.price = req.query.price.replace(/["]+/g, '')
  }
  if (req.query.category) {
    req.query.category = req.query.category.replace(/["]+/g, '')
  }
  if (req.query.q) {
    req.query.q = req.query.q.replace(/["]+/g, '')
  } //.replace(/[']+/g, '') 

  // configure .sort() parameters
  let pricingSort = {}
  if (req.query.price === "Lowest") {
    pricingSort = {
      "price": "asc"
    }
  } else if (req.query.price === "Highest") {
    pricingSort = {
      "price": "desc"
    }
  } else {
    pricingSort = {
      "_id": "asc"
    } // easier to predict behavior
  }
  console.log('pricingSort ', pricingSort)
  // configure .find() parameters
  let categorizing = {}
  if (req.query.category) {
    categorizing = {
      "category": req.query.category
    }
  }

  let querySearch = {}
  // trying to send %like% search to object
  // if (req.query.q) {querySearch = { "name" : '/'+req.query.q+'/i'}}
  // instead just verbose search for now 
  // TODO make better
  if (req.query.q) {
    querySearch = {
      "name": req.query.q
    }
  }

  Product
    .find()
    .and([categorizing, querySearch])
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort(pricingSort)
    .exec((err, products) => {
      if (err) {
        console.log(err)
      }
      // inject product count into object 
      Product
        .find()
        .and([categorizing, querySearch])
        .sort(pricingSort)
        .countDocuments()
        .exec((err, count) => {
          let niceProducts = {}
          niceProducts.list = products
          niceProducts.count = count
          res.send(JSON.stringify(niceProducts))
        })
    })
})

// returns specific product by id
router.get('/products/:product', (req, res, next) => {
  console.log(`param ${req.params.product}`)
  Product
    .find({
      _id: req.params.product
    })
    .exec((err, products) => {

      console.log(products)
      res.send(JSON.stringify(products))
    })
})

// returns product categories 
router.get('/categories', (req, res, next) => {
  console.log(`getting categories`)
  // both of the below methods work, but have different styles of results. Will keep around
  // for whichever is easiest on frontend
  Product
    .aggregate([{
      $match: {}
    }, {
      $group: {
        _id: null,
        categories: {
          $addToSet: "$category"
        }
      }
    }])
    .exec((err, categories) => {

      // Product.distinct('category', (err, categories) => {

      if (err) {
        console.log(err)
      } else {
        console.log('Got categories')
        console.log(JSON.stringify(categories))
        res.send(JSON.stringify(categories))
      }

    })
})



// returns all reviews of a product, limited to 4 @ time, ?page= option to start page
router.get('/products/:product/reviews', (req, res, next) => {
  console.log(`product review retrieval for ${req.params.product}`)
  const perPage = 4

  // return the first page by default
  const page = req.query.page || 1
  Review
    .find({
      product: req.params.product
    })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, reviews) => {
      if (err) console.log(err)
      res.send(JSON.stringify(reviews))
    })
  // res.sendStatus(200)
})

// creates a new product in the database body = category / name / price / image
router.post('/products', (req, res, next) => {

  console.log(req.body[0].name)
  console.log(req.body[0].price)
  const newProduct = new Product({
    category: req.body[0].category,
    name: req.body[0].name,
    price: req.body[0].price,
    image: req.body[0].image
  })
  newProduct.save((err, data) => {
    if (err) {
      console.log(error)
    } else {
      console.log('new product successfully created')
      res.end()
    }
  })
})
// creates a new review in the database by adding to array
router.post('/:product/reviews', (req, res, next) => {
  console.log(req.body[0].userName)
  console.log(req.body[0].text)
  console.log(req.params.product)
  const newReview = new Review({
    userName: req.body[0].userName,
    text: req.body[0].text,
    product: req.params.product
  })
  newReview.save()
  res.end()
})

// deletes a product by id
router.delete('/products/:product', (req, res, next) => {
  console.log('deleting', req.params.product)
  Product.deleteOne({
    _id: req.params.product
  }, (err) => {
    if (err) console.log(err)
  })
  res.end()
})

// deletes a review by id
router.delete('/reviews/:review', (req, res, next) => {
  console.log('deleting', req.params.review)
  Review.deleteOne({
    _id: req.params.review
  }, (err) => {
    if (err) console.log(err)
  })
  res.end()
})

module.exports = router
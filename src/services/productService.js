const Product = require('../models/Product');

const getProducts = async (filter, options) => {
  const { limit = 10, page = 1, sort, query } = options;
  const queryFilter = {};

  if (query) {
    queryFilter.$or = [
      { category: query },
      { availability: query === 'available' }
    ];
  }

  const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

  const products = await Product.find(queryFilter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  const totalProducts = await Product.countDocuments(queryFilter).exec();
  const totalPages = Math.ceil(totalProducts / limit);

  return {
    status: 'success',
    payload: products,
    totalPages,
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < totalPages ? page + 1 : null,
    page,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
    prevLink: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
    nextLink: page < totalPages ? `/api/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null
  };
};

module.exports = {
  getProducts
};

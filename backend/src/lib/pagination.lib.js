/**
 * Paginate query results
 * @param {Object} model - Mongoose model
 * @param {Object} query - Query conditions
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Paginated results
 */
export const paginate = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    populate = "",
    select = "",
  } = options;

  const skip = (page - 1) * limit;

  let queryBuilder = model.find(query).sort(sort).skip(skip).limit(limit);

  if (select) {
    queryBuilder = queryBuilder.select(select);
  }

  if (populate) {
    queryBuilder = queryBuilder.populate(populate);
  }

  const [results, total] = await Promise.all([
    queryBuilder.exec(),
    model.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    results,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
};

/**
 * Get pagination params from request
 * @param {Object} req - Express request object
 * @returns {Object} - Pagination options
 */
export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || "-createdAt";

  return { page, limit, sort };
};

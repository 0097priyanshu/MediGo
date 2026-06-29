/**
 * Handle demo endpoint requests.
 */
const handleDemo = (req, res, next) => {
  try {
    return res.status(200).json({
      message: "Demo dynamic functionality works!",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  handleDemo,
};

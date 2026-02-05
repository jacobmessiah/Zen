export const handleAddGifToFavourites = (req, res) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.log(
      "Error on #handleAddGifToFavourite #favouritesController.js Error --> ",
      error.message || error,
    );
    return res.status(500).json({ message: "SERVER_ERROR" });
  }
};

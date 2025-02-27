const Listing = require("../models/listing");

module.exports.searchListing = async (req, res) => {
    const searchQuery = req.query.query?.trim();

    if (!searchQuery) {
        req.flash("error", "Please enter a search query.");
        return res.redirect("/listings");
    }

    const searchResults = await Listing.find({
        $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } },
            { country: { $regex: searchQuery, $options: 'i' } },
        ]
    });

    if (searchResults.length === 0) {
        req.flash("error", "No results found. Try searching for a different destination.");
        return res.redirect("/listings");
    }

    res.render("listings/search.ejs", { allListings: searchResults, searchQuery });
};
module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;

    const listings = await Listing.find({ category: { $regex: category, $options: 'i' } });

    if (listings.length === 0) {
        req.flash("error", "No results found. Try searching for a different category.");
        return res.redirect("/listings");
    }

    res.render("listings/category.ejs", {
        allListings: listings,
        category,
        message: ""
    });
};


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_200");
    res.render("listings/edit.ejs", { listing, orignalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted.");
    res.redirect("/listings");
}




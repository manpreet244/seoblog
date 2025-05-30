const Tag = require('../models/tag');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = async (req, res) => {
    console.log(req.body)
    try {
        const { name } = req.body;
        const slug = slugify(name).toLowerCase();

        const tag = new Tag({ name, slug });
        const savedTag = await tag.save();

        return res.status(201).json({ savedTag });
    } catch (error) {
        console.error('Tag creation error:', error);
        return res.status(500).json({ error: errorHandler(error) });
    }
};

exports.list = async (req, res) => {
    try {
        const tags = await Tag.find({});
        return res.json(tags);
    } catch (err) {
        console.error('Error fetching tags:', err);
        return res.status(500).json({ error: errorHandler(err) });
    }
};

exports.read = async (req, res) => {
    const slug = req.params.slug.toLowerCase();
    try {
        const tag = await Tag.findOne({ slug }).exec();
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        return res.json(tag);
    } catch (err) {
        console.error('Error fetching tag:', err);
        return res.status(500).json({ error: errorHandler(err) });
    }
};

exports.remove = async (req, res) => {
    const slug = req.params.slug.toLowerCase();
    try {
        const deletedTag = await Tag.findOneAndDelete({ slug }).exec();
        if (!deletedTag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        return res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
        console.error('Error deleting tag:', err);
        return res.status(500).json({ error: errorHandler(err) });
    }
};

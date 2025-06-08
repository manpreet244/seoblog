const Blog = require('../models/blog');
const formidable = require('formidable');
const slugify = require('slugify');
const { stripHtml } = require('string-strip-html');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');

exports.create = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("Image could not be uploaded");
      return res.status(400).json({ error: 'Image could not be uploaded' });
    }

    const normalizeField = (field) => (Array.isArray(field) ? field[0] : field);
    const titleValue = normalizeField(fields.title);
    const bodyContent = normalizeField(fields.body);

    // Parse JSON safely
    const parseJSON = (json) => {
      try {
        return JSON.parse(normalizeField(json));
      } catch {
        return null;
      }
    };

    const arrayOfCategories = parseJSON(fields.categories);
    if (!arrayOfCategories) {
      return res.status(400).json({ error: 'Categories must be a valid JSON array' });
    }

    const arrayOfTags = parseJSON(fields.tags);
    if (!arrayOfTags) {
      return res.status(400).json({ error: 'Tags must be a valid JSON array' });
    }

    // Validation
    if (!titleValue || typeof titleValue !== 'string' || titleValue.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    const plainTextBody = stripHtml(bodyContent || '').result.trim();
    if (!plainTextBody || plainTextBody.length < 200) {
      return res.status(400).json({ error: 'Content is too short. Minimum 200 characters required.' });
    }

    if (!arrayOfCategories.length) {
      return res.status(400).json({ error: 'At least one category is required' });
    }

    if (!arrayOfTags.length) {
      return res.status(400).json({ error: 'At least one tag is required' });
    }

    // Create Blog instance
    let blog = new Blog();
    blog.title = titleValue.trim();
    blog.body = bodyContent;
    blog.slug = slugify(titleValue.trim()).toLowerCase();
    blog.mtitle = `${titleValue.trim()} | ${process.env.APP_NAME}`;
    blog.mdesc = stripHtml(bodyContent.substring(0, 160)).result;
    blog.postedBy = req.user._id;
    blog.categories = arrayOfCategories;
    blog.tags = arrayOfTags;

    // Photo upload
    if (files.photo) {
      const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;
      console.log('Photo file info:', photoFile);

      if (photoFile.size > 1000000) {
        return res.status(400).json({ error: 'Image should be less than 1MB in size' });
      }

      const photoPath = photoFile.filepath || photoFile.path;
      blog.photo.data = fs.readFileSync(photoPath);
      blog.photo.contentType = photoFile.mimetype || photoFile.type;
    }

    try {
      const result = await blog.save();
      return res.json(result);
    } catch (saveError) {
      return res.status(400).json({ error: errorHandler(saveError) });
    }
  });
};

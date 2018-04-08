const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
var Publication = require('../models/Publication');
var User = require('../models/User');

// Display list of all Publications.
exports.publication_list = function(req, res) {
  Publication.find()
    .sort({'creationdate': -1})
    .populate('publisher')
    .exec(function (err, list_publications) {
      if (err) { return next(err); }

      //Successful, so render
      res.render('publications/list', {publications_list: list_publications});
    });
};

// Display detail page for a specific Publication.
exports.publication_detail = function(req, res, next) {
  async.parallel({
    publication: function(callback) {
      Publication.findById(req.params.id)
        .populate('publisher')
        .exec(callback)
    }
  }, function(err, results) {
    if (err) { return next(err); } // Error in API usage.

    if (results.publication==null) { // No results.
      var err = new Error('Publicación #'+req.params.id+' no encontrada');
      err.status = 404;
      return next(err);
    }

    // Successful, so render.
    res.render('publications/detail', { title: 'Inmo | Publicación #'+req.params.id, publication: results.publication } );
  });
};

// Display Publication create form on GET.
exports.publication_create_get = function(req, res, next) {
  // Get publication and users for form.
  async.parallel({
    users: function(callback) {
      User.find(callback);
    },
  },
  function(err, results) {
    if (err) { return next(err); }
    // Success.
    res.render('publications/create', { title: 'Nueva publicación', users:results.users });
  });
};

// Handle Publication create on POST.
exports.publication_create_post = [
  body('address', 'Dirección del inmueble es requerida')
    .isLength({ min: 1 }).trim(),
  body('price', 'Precio es requerido')
    .isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody('address').trim().escape(),
  sanitizeBody('price').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var publication = new Publication({
      creationdate: new Date(),
      expirationdate: new Date(),
      address: req.body.address,
      publisher: req.body.username,
      status: 'Active',
      price: req.body.price,
      currency: req.body.currency,
      latitude: 0,
      longitude: 0,
      publisher: req.body.publisher
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('publications/create', { title: 'Inmo | Nueva publicación', publication: publication, errors: errors.array()});
      return;
    } else {
      publication.save(function (err) {
        if (err) { return next(err); }
        // Publication saved. Redirect to publication detail page.
        res.redirect(publication.url);
      });
    }
  }
];

// Display Publication delete form on GET.
exports.publication_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Publication delete GET');
};

// Handle Publication delete on POST.
exports.publication_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Publication delete POST');
};

// Display Publication update form on GET.
exports.publication_update_get = function(req, res, next) {
  // Get publication and users for form.
  async.parallel({
    publication: function(callback) {
      Publication.findById(req.params.id).populate('publisher').exec(callback);
    },
    users: function(callback) {
      User.find(callback);
    },
  },
  function(err, results) {
    if (err) { return next(err); }
      if (results.publication==null) { // No results.
        var err = new Error('Publicación no encontrada.');
          err.status = 404;
          return next(err);
        }
        // Success.
        res.render('publications/create', { title: 'Editar publicación', users:results.users, publication: results.publication });
        });

};

// Handle publication update on POST.
exports.publication_update_post = [
  // Validate fields.
  body('address', 'Dirección es requerida.').isLength({ min: 1 }).trim(),
  body('publisher', 'Usuario es requerido.').isLength({ min: 1 }).trim(),
  body('currency', 'Moneda es requerida.').isLength({ min: 1 }).trim(),
  body('price', 'Precio es requerido.').isLength({ min: 1 }).trim(),

  // Sanitize fields.
  sanitizeBody('address').trim().escape(),
  sanitizeBody('publisher').trim().escape(),
  sanitizeBody('currency').trim().escape(),
  sanitizeBody('price').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Publication object with escaped/trimmed data and old id.
    var publication = new Publication({
      address: req.body.address,
      publisher: req.body.publisher,
      currency: req.body.currency,
      price: req.body.price,
      _id: req.params.id //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all users for form.
      async.parallel({
        users: function(callback) {
          User.find(callback);
        },
      }, function(err, results) {
        if (err) { return next(err); }
          res.render('publications/create', { title: 'Editar publicación', users:results.users, publication: publication, errors: errors.array() });
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      Publication.findByIdAndUpdate(req.params.id, publication, {}, function (err, thepublication) {
        if (err) { return next(err); }
          // Successful - redirect to publication detail page.
          res.redirect(thepublication.url);
        });
      }
  }
];


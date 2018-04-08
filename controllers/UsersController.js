const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');
var User = require('../models/User');
var Publication = require('../models/Publication');

// Display list of all Users.
exports.user_list = function(req, res) {
  if (!req.session) {
    res.redirect('/users/login');
  } else {
    res.send('NOT IMPLEMENTED: User list');
  }
};

// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {
  async.parallel({
    user: function(callback) {
      User.findById(req.params.id)
        .exec(callback)
    },
    publications: function(callback) {
      Publication.find({'publisher': req.params.id})
        .exec(callback)
    },
  },
  function(err, results) {
    if (err) { return next(err); } // Error in API usage.
      if (results.user==null) { // No results.
        var err = new Error('Usuario no encontrado');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('users/detail', { title: 'Inmo | Usuario', session: req.session, user: results.user, user_publications: results.publications } );
  });
};

// Display User create form on GET.
exports.user_create_get = function(req, res) {
    res.render('users/create', {title: 'Inmo | Registro de usuario'});
};

// Handle User create on POST.
exports.user_create_post = [
  body('username', 'Nombre de usuario es requerido')
    .isLength({ min: 1 }).trim(),
  body('contrasenia', 'Contraseña es requerida')
    .isLength({ min: 1 }).trim(),
  body('firstnames', 'Nombres del usuario son requeridos')
    .isLength({ min: 1 }).trim(),
  body('familynames', 'Apellidos del usuario son requeridos')
    .isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody('username').trim().escape(),
  sanitizeBody('firstnames').trim().escape(),
  sanitizeBody('familynames').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var user = new User({
      username: req.body.username,
      password: req.body.contrasenia,
      names: req.body.firstnames,
      familynames: req.body.familynames
    });


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('users/create', { title: 'Inmo | Registro de usuario', user: user, errors: errors.array()});
      return;
    } else {
      // Data from form is valid.
      // Check if User with same username already exists.
      User.findOne({ 'username': req.body.username })
        .exec( function(err, found_user) {
           if (err) { return next(err); }
             if (found_user) {
               // User exists, redirect to its detail page.
               res.redirect(found_user.url);
             } else {
               user.save(function (err) {
                 if (err) { return next(err); }
                 // User saved. Redirect to user detail page.
                 res.redirect(user.url);
               });
             }
        });
    }
  }
];

// Display User delete form on GET.
exports.user_delete_get = function(req, res) {
  if (!req.session) {
    res.redirect('/users/login');
  }
  res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle User delete on POST.
exports.user_delete_post = function(req, res) {
  if (!req.session) {
    res.redirect('/users/login');
  }
  res.send('NOT IMPLEMENTED: User delete POST');
};

// Display User update form on GET.
exports.user_update_get = function(req, res) {
  if (!req.session) {
    res.redirect('/users/login');
  }
  res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
  if (!req.session) {
    res.redirect('/users/login');
  }
  res.send('NOT IMPLEMENTED: User update POST');
};

exports.user_auth = [
  body('username', 'Nombre de usuario es requerido')
    .isLength({ min: 1 }).trim(),
  body('password', 'Contraseña es requerida')
    .isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody('username').trim().escape(),
  sanitizeBody('password').trim().escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('users/login', { title: 'Inmo | Inicio de sesión', errors: errors.array()});
      return;
    } else {
      // Data from form is valid.
      // Check if User with same username already exists.
      User.findOne({ 'username': req.body.username, 'password': req.body.password })
        .exec( function(err, found_user) {
          if (err) { return next(err); }
            if (found_user) {
              // User exists, redirect to its detail page.
              if (!req.session.user_id) {
                req.session.user_id=found_user._id;
              }
              res.redirect(found_user.url);
            } else {
               // User saved. Redirect to user detail page.
               res.redirect('/users/login');
            }
        });
    }
  }
];


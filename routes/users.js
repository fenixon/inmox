var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/UsersController');

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('Users index');
});*/

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', user_controller.user_auth);

/// User ROUTES ///

// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get('/create', user_controller.user_create_get);

// POST request for creating User.
router.post('/create', user_controller.user_create_post);

// GET request to delete User.
router.get('/:id/delete', user_controller.user_delete_get);

// POST request to delete User.
router.post('/:id/delete', user_controller.user_delete_post);

// GET request to update User.
router.get('/:id/update', user_controller.user_update_get);

// POST request to update User.
router.post('/:id/update', user_controller.user_update_post);

// GET request for one User.
router.get('/:id', user_controller.user_detail);

// GET request for list of all Users.
router.get('/', user_controller.user_list);

module.exports = router;

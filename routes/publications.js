var express = require('express');
var router = express.Router();

// Require controller modules.
var publication_controller = require('../controllers/PublicationsController');

/// Publication ROUTES ///

// GET publications home page.
router.get('/', publication_controller.publication_list);

// GET request for creating a publication. NOTE This must come before routes that display Publication (uses id).
router.get('/create', publication_controller.publication_create_get);

// POST request for creating Publication.
router.post('/create', publication_controller.publication_create_post);

// GET request to delete Publication.
router.get('/:id/delete', publication_controller.publication_delete_get);

// POST request to delete Publication.
router.post('/:id/delete', publication_controller.publication_delete_post);

// GET request to update Publication.
router.get('/:id/update', publication_controller.publication_update_get);

// POST request to update Publication.
router.post('/:id/update', publication_controller.publication_update_post);

// GET request for one Publication.
router.get('/:id', publication_controller.publication_detail);

module.exports = router;

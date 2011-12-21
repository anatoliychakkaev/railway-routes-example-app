var routing = require('railway-routes');
var mw = require('./middleware');

exports.init = function (app) {
    var map = new routing.Map(app, handler);

    // resourceful routes
    map.resources('posts', {
        middleware: mw.loadPost,
        middlewareExcept: ['index', 'new', 'create']});

    // admin namespace
    map.namespace('admin', {middleware: mw.requireAdmin}, function (admin) {
        admin.resources('users', {
            middleware: mw.loadUser,
            middlewareExcept: ['index', 'new', 'create']});
    });

    // generic routes
    map.all('/:controller/:action');
    map.all('/:controller/:id/:action');
};

// simple routes handler

function handler(ns, controller, action) {
    try {
        var ctlFile = './controllers/' + ns + controller + '_controller';
        var responseHandler =  require(ctlFile)[action];
    } catch(e) {}

    return controller ? responseHandler || handlerNotFound : genericRouter;

    function handlerNotFound(req, res) {
        res.send('Handler not found for ' + ns + controller + '#' + action);
    };

    // to deal with :controller/:action routes
    function genericRouter(req, res) {
        var ctlFile = './controllers/' + ns + req.param('controller') + '_controller';
        try {
            var responseHandler =  require(ctlFile)[req.param('action')];
        } catch (e) {
            responseHandler = function (req, res) {
                res.send('Handler not found for ' + ns + req.param('controller') + '#' + req.param('action'));
            }
        }
        responseHandler(req, res);
    }
}


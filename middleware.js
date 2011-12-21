exports.loadUser = function loadUser(req, res, next) {
    console.log('Loading user');
    req.user = {name: 'JB'};
    process.nextTick(next);
};

exports.loadPost = function loadPost(req, res, next) {
    console.log('Loading post');
    req.post = {title: 'Hello world'};
    process.nextTick(next);
};

exports.requireAdmin = function requireAdmin(req, res, next) {
    if (req.param('admin')) {
        console.log('Hello admin!');
        next();
    } else {
        console.log('Hey! This area for privileged users only (pass ?admin=1 param to query string)');
        res.send('admin required');
    }
};

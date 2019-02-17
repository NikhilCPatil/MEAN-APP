const Post = require('../model/post');

exports.get = (req, res, next) => {
    Post.findById(req.params.postId).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "Post  Not Fetched"});
        }
    }).catch(err => {
        res.status(500).json({
            message: "Fetching post failed"
        });
    });
}

exports.list = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery.then((documents) => {
        fetchedPosts = documents;
        return Post.countDocuments();
    }).then((count) => {
        res.status(200).json({message: "Post fetched succesfully", posts: fetchedPosts, maxPosts: count});
    }).catch(err => {
        res.status(500).json({
            message: "Fetching posts failed"
        });
    });
}

exports.post = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post Updated succesfully!",
            post: {
                ...createdPost,
                id: createdPost._id,
            }
        });
    }).catch(err => {
        res.status(500).json({message: "Creating a post failed"})
    });
}

exports.update = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.body.id, creator: req.userData.userId}, post).then(result => {
        if (result.n > 0) {
            res.status(200).json({message: "Updated Succesfully"});
        } else {
            res.status(401).json({message: "Not Authorized"});
        }
    }).catch(error => {
        res.status(500).json({
            message: "Coudent update post"
        });
    });
}

exports.delete = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if (result.n > 0) {
            res.status(200).json({message: "Delete Succesfully"});
        } else {
            res.status(401).json({message: "Not Authorized"});
        }
    }).catch(err => {
        res.status(500).json({
            message: "Deleting post failed"
        });
    });
}
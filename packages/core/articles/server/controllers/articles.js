'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Articles) {

    return {
        /**
         * Find article by id
         */
        article: function(req, res, next, id) {
            Article.load(id, function(err, article) {
                if (err) return next(err);
                if (!article) return next(new Error('Failed to load article ' + id));
                req.article = article;
                next();
            });
        },
        /**
         * Create an article
         */
        create: function(req, res) {
            var article = new Article(req.body);
            console.log(req.body);
            console.log(article);
            article.user = req.user;

            article.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the article'
                    });
                }

                Articles.events.publish({
                    action: 'created',
                    user: {
                        name: req.user.name
                    },
                    url: config.hostname + '/articles/' + article._id,
                    name: article.title
                });

                res.json(article);
            });
        },
        /**
         * Update an article
         */
        update: function(req, res) {
            var article = req.article;

            article = _.extend(article, req.body);

            article.save(function(err) {
                console.log('err', err);
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the article'
                    });
                }

                Articles.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: article.title,
                    url: config.hostname + '/articles/' + article._id
                });

                res.json(article);
            });
        },

        updateSortId: function (req, res) {
            var article = req.article;

            article = _.extend(article, req.body);

            // Article.findOne({
            //         _id: article._id
            //     }).exec(function(err, circle) {
            //         console.log(circle, typeof article.sort_id)
            //     })

            Article.findOneAndUpdate({
                _id: article._id
            }, {
                $set: {'sort_id': article.sort_id}
            }, {
                multi: false,
                upsert: false
            }, function(err, articleMy) {
                if (err) {
                    return res.send(500, err.message);
                }



                res.send(200, 'updated');
            });

        },
        /**
         * Delete an article
         */
        destroy: function(req, res) {
            var article = req.article;


            article.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the article'
                    });
                }

                Articles.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: article.title
                });

                res.json(article);
            });
        },
        /**
         * Show an article
         */
        show: function(req, res) {
            console.log('req.user', req.user);

            Articles.events.publish({
                action: 'viewed',
                user: {
                    name: req.user.name
                },
                name: req.article.title,
                url: config.hostname + '/articles/' + req.article._id
            });

            res.json(req.article);
        },
        /**
         * List of Articles
         */
        all: function(req, res) {
            var query = req.acl.query('Article');

            query.find({}).sort('-created').populate('user', 'name username').exec(function(err, articles) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }

                res.json(articles)
            });

        }
    };
}
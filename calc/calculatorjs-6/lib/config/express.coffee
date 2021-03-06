'use strict'

express = require('express')
path = require('path')

module.exports = (app) ->
  rootPath = path.normalize "#{__dirname}/../.."

  app.configure 'development', () ->
    app.use require('connect-livereload')()

    # Disable caching of scripts for easier testing
    app.use (req, res, next) ->
      if (req.url.indexOf('/scripts/') == 0)
        res.header "Cache-Control", "no-cache, no-store, must-revalidate"
        res.header "Pragma", "no-cache"
        res.header "Expires", 0
      next();

    app.use express.static(path.join(rootPath, '.tmp'))
    app.use express.static(path.join(rootPath, 'app'))
    app.use express.errorHandler()
    app.set 'views', "#{rootPath}/app/views"

  app.configure 'production', () ->
    app.use express.favicon(path.join(rootPath, 'public', 'favicon.ico'))
    app.use express.static(path.join(rootPath, 'public'))
    app.set 'views', "#{rootPath}/views"

  app.configure () ->
    app.set 'view engine', 'jade'
    app.use express.logger('dev')
    app.use express.bodyParser()
    app.use express.methodOverride()

    # Router needs to be last
    app.use(app.router)
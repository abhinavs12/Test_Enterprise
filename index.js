var SERVER_NAME = 'tablet-api'
var PORT = 4002;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the users
  , tabletsSave = require('save')('tablets')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME })

server.listen(PORT, HOST, function () {
    console.log('Server started at %s', server.url)
    console.log('Resources:/tablets')
    
    
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all tablets in the system
server.get('/tablets', function (req, res, next) {

    // Find every entity within the given collection
    tabletsSave.find({}, function (error, tablets) {

        // Return all of the tablets in the system
        res.send(tablets)
    })
})



// Create a new tablets
server.post('/tablets', function (req, res, next) {

    // Make sure name is defined
    if (req.params.model === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('Model must be supplied'))
    }
    if (req.params.brand === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('Brand must be supplied'))
    }
    var newTablet = {
        model: req.params.model,
        brand: req.params.brand
    }

    // Create the user using the persistence engine
    tabletsSave.create(newTablet, function (error, tablets) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the tablet if no issues
        res.send(201, tablets)
    })
})


 




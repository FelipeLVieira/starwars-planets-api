![alt text](https://image.ibb.co/d61Wny/Star_wars_longshadow_00.jpg "starwars-planets-api")
# starwars-planets-api

Simple REST API designed to store Star Wars planets, written in Serverless, NodeJS and Mongoose.

## Using

You can use an tool like [Postman](https://www.getpostman.com/) to POST new planets.
The planets sent to API must follow the following JSON format:

```
{
    "name": "Alderaan",
    "climate": "temperate",
    "terrain": "grasslands, mountains"
}
```
The API will get the movies from the named planet, if exists, and will persist in the database.

You can use the following endpoints with the API:

Create a new planet:
* POST - https://skes7yea77.execute-api.us-east-1.amazonaws.com/dev/planets
Search a planet by id:
* GET - https://skes7yea77.execute-api.us-east-1.amazonaws.com/dev/planets/{id}
Search a planet by name:
* GET - https://skes7yea77.execute-api.us-east-1.amazonaws.com/dev/planets/name/{name}
Show all planets:
* GET - https://skes7yea77.execute-api.us-east-1.amazonaws.com/dev/planets
Modify a planet by id:
* PUT - https://skes7yea77.execute-api.us-east-1.amazonaws.com/dev/planets/{id}
Remove a planet:
* DELETE - https://skes7yea77.execute-api.us-east-1.amazonaws.com/dev/planets/{id}


## Getting Started Offline

To run this project offline, run the following commands:
```
$ npm install
$ sls offline start --skipCacheInvalidation
```
The API will start running at the default address *http://localhost:3000*.

## Deployment

The service used to host the API was MongoDB Atlas.
You'll need to create a variables.env file. Then you'll need to create a MongoDB Atlas project, create a free tier cluster, create an user, get the cluester's 3.4 or erlier connection string and finally add to variables.env file, example:
```
DB=mongodb://admin:<PASSWORD>@obiwan-shard-00-00-tira4.mongodb.net:27017,obiwan-shard-00-01-tira4.mongodb.net:27017,obiwan-shard-00-02-tira4.mongodb.net:27017/test?ssl=true&replicaSet=Obiwan-shard-0&authSource=admin&retryWrites=true
```

## Built With

* [SWAPI](https://swapi.co/) - Used get planet's films apparitions

## Authors

* **Felipe Vieira**

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details

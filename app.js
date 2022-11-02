const express = require("express");
const app = express();

const { NotFoundError, BadRequestError} = require("./expressError");
const { items } = require("./fakeDb")

app.use(express.json());                           // process JSON data
app.use(express.urlencoded());                     // process trad form data

/** Returns JSON list of all shopping items
 * Ex: { items: [
 *    { name: "cheerios", price: 1.45 }, ... ]}
 */

app.get("/items", function (req, res) {
  return res
    .json(db.items);
})

/** Accepts JSON object of a single item, adds it to the "database"
 * Returns the JSON object with status code 201.
 * If item already exists in shopping list, error is thrown.
 */
app.post("/items", function (req, res) {

  const newItem = req.body;

  if (newItem in items) {
    throw new BadRequestError("Item already in shopping list");
  } else {
    items.push(newItem);

    return res
    .status(201)
    .json(newItem);
  }
})

/** Accepts JSON for single item in URL attribute.
 * Returns that single item object in JSON
 * If item does not exist in shopping list, error is thrown.
 * */
app.get("/items/:name", function (req, res) {
  const searchName = req.params.name;

  for (let item of items) {
    if (item.name === searchName) {
      return res
      .json(item)
    }
  }

  throw new BadRequestError("Item does not exist in shopping list");
})


/** 404 handler: matches unmatched routes. */
app.use(function (req, res) {
  throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});

module.exports = app;
"use strict"
const express = require("express");
const router = new express.Router();
const { NotFoundError, BadRequestError} = require("./expressError");
const { items } = require("./fakeDb")


/** Returns JSON list of all shopping items
 * Ex: { items: [
 *    { name: "cheerios", price: 1.45 }, ... ]}
 */

router.get("/", function (req, res) {
  return res
    .json(db.items);
})

/** Accepts JSON object of a single item, adds it to the "database"
 * Returns the JSON object with status code 201.
 * If item already exists in shopping list, error is thrown.
 */
router.post("/", function (req, res) {

  const newItem = req.body;

  if (newItem in items) {
    throw new BadRequestError("Item already in shopping list");
  } else {
    items.push(newItem);

    return res
    .status(201)
    .json({"added":newItem});
  }
})

/** Accepts JSON for single item in URL attribute.
 * Returns that single item object in JSON
 * If item does not exist in shopping list, error is thrown.
 * */
router.get("/:name", function (req, res) {
  const searchName = req.params.name;

  for (let item of items) {
    if (item.name === searchName) {
      return res
      .json(item)
    }
  }

  throw new BadRequestError("Item does not exist in shopping list");
})
/** Accepts item name and price request change from URL and body.
 * Updates in database. Returns updated status
 * If item does not exist in shopping list, error is thrown.
  */
router.patch("/:name", function (req,res) {

  const reqItem = req.body.name;
  const oldName = req.params.name;
  for (let item of items) {
    if (item.name === oldName) {
        item = {
          name:reqItem,
          price: req.body.price
        }
        return res.json({"updated":item});
    }
  }
  throw new BadRequestError("Item does not exist in shopping list");
})
/** Accepts item to delete in URL. Deletes object with given name as key
 * Returns updated status and throws an error if item doesnt exist in the database.
 */
router.delete("/:name", function (req,res) {

  const reqItem = req.params.name;
  for(let i = 0;i<items.length;i++) {
    if (items[i].name === reqItem) {
      items.splice(i,1);
      console.log(items)
      return res.json({"message":"Deleted"});
  }
}

  throw new BadRequestError("Item does not exist in shopping list");
})

module.exports = router;
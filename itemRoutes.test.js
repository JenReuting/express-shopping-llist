const request = require("supertest")

const app = require("./app")
const { items } = require("./fakeDb")

const testItem = { name: 'muffins', price: 15.00 };
const testItem2 = { name: 'donuts', price: 12.00 };

beforeEach(function() {
  items.push(testItem);
  //before tasks go here
});

afterEach(function() {
  //after tasks go here
});

/** Tests GET request of all shopping list items */

describe("GET /items", function() {
  it("Gets list of all shopping list items", async function() {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual(items);
  });
});
// end

/** Tests GET for getting item object for one item */

describe("GET /items/:name", function() {
  /* Test getting item with correct name */
  it("gets a single item object", async function() {
    const resp = await request(app).get(`/items/${testItem.name}`);

    expect(resp.body).toEqual(testItem);
  })

  /* Test getting item with incorrect name */
  it("Responds with 400 if cannot find item", async function() {
    const resp = await request(app).get(`/items/not-real-item`);
    expect(resp.body.error.status).toEqual(400);
    expect(resp.body.error.message).toEqual('Item does not exist in shopping list');
  })
})

/** Tests POST for adding new item to shopping list */

describe("POST /items", function() {

  /* Test adding new item that doesn't already exist */
  it("Adds a new item to the shopping list", async function() {
    const resp = await request(app)
      .post('/items')
      .send(testItem2);
    expect(resp.body).toEqual({added: testItem2});
    expect(resp.statusCode).toEqual(201);
  })

  /* Test adding new item that DOES already exist */
  it("Adds a new item that already exists in shopping list", async function() {
    const resp = await request(app)
      .post('/items')
      .send(items[0]);

      console.log('resp.body ------------------', resp.body)
    expect(resp.body.error.status).toEqual(400);
    expect(resp.body.error.message).toEqual("Item already in shopping list");
  })
})
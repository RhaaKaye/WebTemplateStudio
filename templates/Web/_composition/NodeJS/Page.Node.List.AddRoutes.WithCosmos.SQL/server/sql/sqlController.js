﻿var SQLClient = require("./sqlClient");
const CONSTANTS = require("../constants");

module.exports = class SQLController {
  constructor() {
    this.sqlClient = new SQLClient(
      CONSTANTS.COSMOS.DATABASE,
      CONSTANTS.COSMOS.CONTAINER
    );

    this.sqlClient.connect();
  }

  // Find all items from the ListItem container in Cosmos Core SQL List database
  async get(req, res, next) {
    const querySpec = {
      query: "SELECT r.id as _id, r.text FROM root r ORDER BY r._ts DESC",
      parameters: []
    };

    try {
      const { resources } = await this.sqlClient.container.items
        .query(querySpec)
        .fetchAll();

      res.json(resources);
    } catch (error) {
      next(error);
    }
  }

  // Post a new item to the ListItem container in Cosmos Core SQL List database
  async create(req, res, next) {
    // TODO Web Template Studio: The Cosmos Core SQL Database is set up to hold a container called ListItems which contains documents
    // with the following schema. Define your own schema to add documents to the container here.
    var listItem = {
      text: req.body.text
    };
    try {
      const { item } = await this.sqlClient.container.items.upsert(listItem);
      res.json({ _id: item.id, text: listItem.text });
    } catch (error) {
      next(error);
    }
  }

  // Remove an item from the ListItem container in Cosmos Core SQL List database
  async destroy(req, res, next) {
    const { _id } = req.params;
    try {
      await this.sqlClient.container.item(_id).delete();
      res.json({ _id });
    } catch (error) {
      next(error);
    }
  }
};

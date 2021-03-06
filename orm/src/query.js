const Transaction = require("./transaction");
const Util = require("./util");

/**
 * Responsible for interacting with the Database.
 */
class Query {
  /**
   * Executes a given query in the currently running transaction.
   *
   * @param {Object|String}           query Object containing paramaterised SQL & parameter, or an SQL string to execute
   * @param {String}                  [query.text] The paramaterised SQL query to execute
   * @param {Array<String>}           [query.values] Values to be submitted with a paramatarised query
   * @returns {Promise<Array<Object>>} Resulting rows from the query
   */
  async _executeSQLQuery(sqlQuery) {
    // const transactionID = Transaction.get("transactionID");
    const transaction = Transaction.get("transaction");
    // console.log(transactionID, sqlQuery);
    // console.log(
    //   transaction.processID,
    //   "ProcessID",
    //   transactionID,
    //   "transactionID"
    // );
    const result = await transaction.query(sqlQuery);
    return Util.groupData(result.rows);
  }

  /**
   * Gets the column associated with the given attributeName.
   *
   * @param {array<Model>} models Array of models to check for the given column
   * @param {string} attributeName name of a model attribute
   * @returns {Column}
   *
   * @throws Error if no attribute not found
   * @throws Error if multiple columns match the attribute name
   */
  _getMatchingColumn(models, attributeName) {
    // ID should only reference the ID of the initial model, not the association
    if (attributeName === "id") {
      return models[0].entity[attributeName];
    }

    let matches = [];
    models.forEach(model => {
      // Check each column of each model
      model.sqlConfig.columns.forEach(column => {
        if (column.name === attributeName) {
          matches.push(model.entity[attributeName]);
        }
      });
    });

    // No matches found
    if (matches.length === 0) {
      throw new Error(`No attribute match found for ${attributeName}`);
    }

    // Multiple matches found
    if (matches.length > 1) {
      let matchOutput = "";
      matches.forEach((match, index) => {
        if (index !== 0) {
          matchOutput += ", ";
        }
        matchOutput += `${match.table._schema}.${match.table._name}.${
          match.name
        }`;
      });
      throw new Error(
        `Multiple attribute matches found for ${attributeName} - ${matchOutput}`
      );
    }

    return matches[0];
  }

  /**
   * Executes a Select Query.
   *
   * @param {Model}                 model           Initial model on which this query is executed.
   * @param {object}                attributes     Attributes used in the where clause
   * @param {object}                options        Query options
   * @param {Array<string>}         options.includes   Array of association names
   */
  async select(modelClass, where = {}, options) {
    let queryBuilder = modelClass.entity;
    const modelClassName = modelClass.name;

    // select
    queryBuilder = queryBuilder.select(modelClass.entity.star());
    options.includes.forEach(include => {
      const association = modelClass.associations[include];
      const recipricalModelClass = association.getRecipricalModel(
        modelClassName
      );
      queryBuilder = queryBuilder.select(
        recipricalModelClass.entity.star({ prefix: `${include}.` })
      );
    });

    // from
    let fromClause = modelClass.entity;
    options.includes.forEach(include => {
      const association = modelClass.associations[include];
      fromClause = association.join(modelClass, fromClause);
    });
    queryBuilder = queryBuilder.from(fromClause);

    // where
    let recipricalModels = options.includes.map(include => {
      let association = modelClass.associations[include];
      return association.getRecipricalModel(modelClassName);
    });
    let modelClasses = [modelClass, ...recipricalModels];
    Object.keys(where).forEach(whereAttributeName => {
      let attribute = this._getMatchingColumn(modelClasses, whereAttributeName);
      let whereAttributeValue = where[whereAttributeName];
      queryBuilder.where(attribute.equals(whereAttributeValue));
    });

    const sqlQuery = queryBuilder.toQuery();
    return this._executeSQLQuery(sqlQuery);
  }

  /**
   * Executes an SQl query to create a table if it doesn't exist
   * @param {Model} model
   * @return an Instance of Query to be executed
   * @see Model
   */
  async createTableIfNotExists(model) {
    const sqlQuery = model.entity
      .create()
      .ifNotExists()
      .toQuery();
    return this._executeSQLQuery(sqlQuery);
  }

  /**
   * Executes an SQL query to create an instance of an entity
   * @param {Model} model
   * @param {*} attributes
   * @returns the rows created
   * @see Model
   */
  async create(model) {
    const modelDefinition = model.constructor;
    const attributes = model._getDirtyData();

    if (Object.keys(attributes).length !== 0) {
      const sqlQuery = modelDefinition.entity
        .insert(attributes)
        .returning(modelDefinition.entity.star())
        .toQuery();
      const groupedDataArray = await this._executeSQLQuery(sqlQuery);
      model.id = groupedDataArray[0].id;
    }
  }

  async createAll(modelArray) {
    if (modelArray && modelArray.length > 0) {
      const modelDefinition = modelArray[0].constructor;
      const attributesArray = [];

      // Read data for each model
      modelArray.forEach(model => {
        const attributes = model._getDirtyData();
        attributesArray.push(attributes);
      });

      const sqlQuery = modelDefinition.entity
        .insert(attributesArray)
        .returning(modelDefinition.entity.star())
        .toQuery();
      const groupedDataArray = await this._executeSQLQuery(sqlQuery);

      groupedDataArray.forEach((groupedData, index) => {
        modelArray[index].id = groupedDataArray.id;
      });
    }
  }

  /**
   * Counts the number of rows.
   *
   * @param {Model} model
   * @param {Object} attributes
   * @return {Number} the count
   */
  async count(model, attributes) {
    const kCOUNT = "count";
    const sqlQuery = model.entity
      .select(model.entity.count().as(kCOUNT))
      .where(attributes)
      .toQuery();
    let rows = await this._executeSQLQuery(sqlQuery);
    return parseInt(rows[0][kCOUNT], 10);
  }

  /**
   * Performs an SQL modification
   * @param {Model} model
   * @param {Number} id ID of the entity
   * @param {Object} attributes
   */
  async modify(model) {
    const modelDefinition = model.constructor;
    const id = model.id;
    const attributes = model._getDirtyData();

    if (Object.keys(attributes).length !== 0) {
      let sqlQuery = modelDefinition.entity
        .update(attributes)
        .where({ id })
        .returning(modelDefinition.entity.star())
        .toQuery();
      return this._executeSQLQuery(sqlQuery);
    }
  }

  /**
   * Performs an SQL delete where matches the where object
   * @param {Model} model
   * @param {Object} where
   */
  async delete(model, where) {
    let sqlQuery = model.entity
      .delete()
      .where(where)
      .toQuery();
    return this._executeSQLQuery(sqlQuery);
  }
}

module.exports = new Query();

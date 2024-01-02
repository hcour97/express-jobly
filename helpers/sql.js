const { BadRequestError } = require("../expressError");

/**  
 * Helper function to make updates to selected specifications. 
 * The calling function uses it to make a SET clause for the SQL command UPDATE.
 * 
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSQL {Object} {matches the js-style input to database column names.}
 *        i.e. {firstName: "first_name", age: "age"}
 * @returns {Object} {setCols, values}
 * 
 * @example {firstName: 'Aliya', age: 32} => { setCols:'"first_name"=$1', '"age"=$2', values: ["Aliya", "32"] }
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // 
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };

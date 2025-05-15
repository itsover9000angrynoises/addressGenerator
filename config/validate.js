const _ = require("lodash");

function parseString(input, key) {
  let result = { status: true, error: "", value: null };
  let value = _.get(input, key, null);
  if (value !== null) {
    if (typeof value === "string") {
      result.value = value;
    } else {
      result.status = false;
      result.error = "String type validation failure";
    }
  } else {
    result.status = false;
    result.error = "Property not found";
  }
  return result;
}

function parseBoolean(input, key) {
  let result = { status: true, error: "", value: null };
  let value = _.get(input, key, null);
  if (value !== null) {
    if (typeof value === "boolean") {
      result.value = value;
    } else {
      result.status = false;
      result.error = "Boolean type validation failure";
    }
  } else {
    result.status = false;
    result.error = "Property not found";
  }
  return result;
}

function parseNumber(input, key) {
  let result = { status: true, error: "", value: null };
  let value = _.get(input, key, null);
  if (value !== null) {
    // convert the type to number since there is chance that it was set from env and in that case it would be
    // received as string
    if (!isNaN(Number(value))) {
      result.value = Number(value);
    } else {
      // not a number
      result.status = false;
      result.error = "Number Type validation failure";
    }
  } else {
    result.status = false;
    result.error = "Property not found";
  }
  return result;
}

function parseArray(input, key) {
  let result = { status: true, error: "", value: null };
  let value = _.get(input, key, null);
  if (value !== null) {
    // parse the array to number since there is chance that it was set from env and in that case it would be
    // received as string
    try {
      if (typeof value === "string") {
        let parsedJson = JSON.parse(value);
        value = parsedJson;
      }
      if (Array.isArray(value)) {
        result.value = value;
      } else {
        result.status = false;
        result.error = "Array Type validation failure";
      }
    } catch (err) {
      result.status = false;
      result.error = "JSON parse error";
    }
  } else {
    result.status = false;
    result.error = "Property not found";
  }
  return result;
}

function parseObject(input, schema) {
  let result = { parsed: {}, status: true, errors: [] };

  if (typeof schema !== "object") {
    result.status = false;
    result.errors.push({ schemaTypeError: "Schema should be an object" });
    return result;
  }

  Object.keys(schema).forEach((key) => {
    // check the type of element
    if ("type" in schema[key]) {
      let elementType = schema[key].type;
      if (elementType === "string") {
        let res = parseString(input, key);
        if (res.status) {
          result.parsed[key] = res.value;
        } else {
          result.status = false;
          result.errors.push({ [key]: res.error });
        }
      }else if (elementType === "boolean") {
        let res = parseBoolean(input, key);
        if (res.status) {
          result.parsed[key] = res.value;
        } else {
          result.status = false;
          result.errors.push({ [key]: res.error });
        }
      }  else if (elementType === "number") {
        let res = parseNumber(input, key);
        if (res.status) {
          result.parsed[key] = res.value;
        } else {
          result.status = false;
          result.errors.push({ [key]: res.error });
        }
      } else if (elementType === "array") {
        // check schema present
        if ("schema" in schema[key]) {
          let res = parseArray(input, key);
          if (res.status) {
            result.parsed[key] = [];
            if("type" in schema[key].schema){
              if (schema[key].schema.type === "object") {
                // for each element
                if ("schema" in schema[key].schema) {
                  for (let value of res.value) {
                    let objRes = parseObject(value, schema[key].schema.schema);
                    if (objRes.status) {
                      result.parsed[key].push(objRes.parsed);
                    } else {
                      result.status = false;
                      result.errors.push({ [key]: objRes.errors });
                    }
                  }
                } else {
                  result.status = false;
                  result.errors.push({
                    [key]: "Schema required for Object in array",
                  });
                }
              }
              else if (schema[key].schema.type === "string") {
                for (let value of res.value) {
                  if(typeof value === "string"){
                    result.parsed[key].push(value);
                  }
                  else{
                    result.status = false;
                    result.errors.push({
                      [key]: "String type validation failure",
                    });
                  }
                }
              }
              else if (schema[key].schema.type === "number") {
                for (let value of res.value) {
                  if(!isNaN(Number(value))){
                    result.parsed[key].push(Number(value));
                  }
                  else{
                    result.status = false;
                    result.errors.push({
                      [key]: "NUmber type validation failure",
                    });
                  }
                }
              }
              else{
                result.status = false;
                result.errors.push({ [key]: "Invalid type in array" });
              }
            }
            else{
              result.status = false;
              result.errors.push({ [key]: "Type required for schema in Array" });
            }
          } else {
            result.status = false;
            result.errors.push({ [key]: res.error });
          }
        } else {
          result.status = false;
          result.errors.push({ [key]: "Schema required for Array" });
        }
      } else if (elementType === "object") {
        // check schema present
        if ("schema" in schema[key]) {
          let value = _.get(input, key, null);
          if (value) {
            let res = parseObject(value, schema[key].schema);
            if (res.status) {
              result.parsed[key] = res.parsed;
            } else {
              result.status = false;
              result.errors.push({ [key]: res.errors });
            }
          } else {
            result.status = false;
            result.errors.push({ [key]: "Property not found" });
          }
        } else {
          result.status = false;
          result.errors.push({ [key]: "Schema required in object" });
        }
      } else {
        result.status = false;
        result.errors.push({ [key]: "Invalid type" });
      }
    } else {
      result.status = false;
      result.errors.push({ [key]: "Invalid schema, type not available" });
    }
  });
  return result;
}

module.exports = parseObject;
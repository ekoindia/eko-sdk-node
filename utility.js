exports.deepMergeObjects = deepMergeObjects;

function deepMergeObjects(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const targetValue = target[key];
        const sourceValue = source[key];
  
        // If the key exists in the target object, merge the properties.
        if (targetValue !== undefined) {
          if (typeof targetValue === "object" && typeof sourceValue === "object") {
            deepMergeObjects(targetValue, sourceValue);
          } else {
            target[key] = sourceValue;
          }
        } else {
          // If the key does not exist in the target object, copy the property from the source object.
          target[key] = sourceValue;
        }
      }
    }
  
    return target;
  }
  
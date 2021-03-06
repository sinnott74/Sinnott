/**
 * Abstract Super Class
 */
class AbstractDataType {
  static getSQLType(attributeOptions) {
    throw new Error("get getSQLType must be implemented");
  }
}

/**
 * Boolean
 */
class BooleanDataType extends AbstractDataType {
  static getSQLType(attributeOptions) {
    return "boolean";
  }
}

/**
 * INT
 */
class IntDataType extends AbstractDataType {
  static getSQLType(attributeOptions) {
    if (attributeOptions.autoIncrement) {
      return "SERIAL";
    }
    return "INT";
  }
}

/**
 * String
 */
class StringDataType extends AbstractDataType {
  static getSQLType(attributeOptions) {
    if (attributeOptions.length && attributeOptions.length > 255) {
      throw new Error("String too long, use TextDataType instead");
    }
    return attributeOptions.length
      ? `varchar(${attributeOptions.length})`
      : "varchar";
  }
}

/**
 * Text
 */
class TextDataType extends AbstractDataType {
  static getSQLType(attributeOptions) {
    return "TEXT";
  }
}

/**
 * Timestamp
 */
class TimeStampDataType extends AbstractDataType {
  static getSQLType(attributeOptions) {
    return "TIMESTAMP WITH TIME ZONE";
  }
}

module.exports = {
  ABSTRACT: AbstractDataType,
  BOOLEAN: BooleanDataType,
  INT: IntDataType,
  STRING: StringDataType,
  TEXT: TextDataType,
  TIMESTAMP: TimeStampDataType
};

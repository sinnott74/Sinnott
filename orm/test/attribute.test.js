const Attribute = require("../src/attribute");

describe("Attribute", () => {
  it("has a name", () => {
    const name = "name";
    const value = "value";
    const attribute = new Attribute(name, value);
    expect(attribute.name).toBe(name);
  });

  it("has a value", () => {
    const name = "name";
    const value = "value";
    const attribute = new Attribute(name, value);
    expect(attribute.value).toBe(value);
  });

  it("has is dirty when value set", () => {
    const name = "name";
    const value = "value";
    const attribute = new Attribute(name, value);
    expect(attribute.isDirty).toBe(true);
  });

  it("can change value", () => {
    const name = "name";
    const value = "value";
    const attribute = new Attribute(name, value);
    const value2 = "value2";
    attribute.value = value2;
    expect(attribute.value).toBe(value2);
  });

  it("can be cleaned", () => {
    const name = "name";
    const value = "value";
    const attribute = new Attribute(name, value);
    attribute.isDirty = false;
    expect(attribute.isDirty).toBe(false);
  });

  it("can be dirtied when value changes", () => {
    const name = "name";
    const value = "value";
    const attribute = new Attribute(name, value);
    attribute.isDirty = false;
    const value2 = "value2";
    attribute.value = value2;
    expect(attribute.isDirty).toBe(true);
  });

  it("won't be dirtied when value set is the same", () => {
    const name = "name";
    const value = "value";
    const attribute = new Attribute(name, value);
    attribute.isDirty = false;
    const sameValue = "value";
    attribute.value = sameValue;
    expect(attribute.isDirty).toBe(false);
  });
});

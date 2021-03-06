/**
 * Tests Util
 */
const util = require("../src/util");

it("pluralises string", () => {
  expect(util.puralize("test")).toBe("tests");
});

it("Capitalises a string", () => {
  expect(util.capitalize("test")).toBe("Test");
});

it("Empty data is grouped correctly", () => {
  const given = [];
  const expected = [];
  expect(util.groupData(given)).toEqual(expected);
});

it("Falsey data should show up in grouped data", () => {
  const given = [
    {
      id: 1,
      active: false,
      "child.id": 1,
      "child.active": false
    }
  ];
  const expected = [
    {
      id: 1,
      active: false,
      child: [
        {
          id: 1,
          active: false
        }
      ]
    }
  ];
  expect(util.groupData(given)).toEqual(expected);
});

it("Undefined attributes should not show up in grouped data", () => {
  const given = [
    {
      id: 1,
      active: undefined,
      "child.id": 1,
      "child.active": undefined
    }
  ];
  const expected = [
    {
      id: 1,
      child: [
        {
          id: 1
        }
      ]
    }
  ];
  expect(util.groupData(given)).toEqual(expected);
});

it("Data is grouped correctly", () => {
  const given = [
    {
      id: 1,
      name: "parent1",
      "child.id": 1,
      "child.name": "child1"
    },
    {
      id: 1,
      name: "parent1",
      "child.id": 2,
      "child.name": "child2"
    },
    {
      id: 2,
      name: "parent2",
      "child.id": 1,
      "child.name": "child1"
    },
    {
      id: 2,
      name: "parent2",
      "child.id": 2,
      "child.name": "child2"
    },
    {
      id: 1,
      name: "parent1",
      "child.id": 3,
      "child.name": "child3",
      "child.grandchild.id": 1,
      "child.grandchild.name": "grandchild1"
    }
  ];

  const expected = [
    {
      id: 1,
      name: "parent1",
      child: [
        {
          id: 1,
          name: "child1"
        },
        {
          id: 2,
          name: "child2"
        },
        {
          id: 3,
          name: "child3",
          grandchild: [
            {
              id: 1,
              name: "grandchild1"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "parent2",
      child: [
        {
          id: 1,
          name: "child1"
        },
        {
          id: 2,
          name: "child2"
        }
      ]
    }
  ];

  expect(util.groupData(given)).toEqual(expected);
});

it("Defines an immutable property", () => {
  const object = {};
  util.defineImmutableProperty(object, "property", "value");
  const expected = {
    value: "value",
    writable: false,
    enumerable: false,
    configurable: false
  };
  expect(object.property).toBe("value");
  expect(Object.getOwnPropertyDescriptor(object, "property")).toEqual(expected);
});

it("Define a non enumerable property", () => {
  const object = {};
  util.defineNonEnumerableProperty(object, "property", "value");
  const expected = {
    writable: true,
    enumerable: false,
    configurable: true,
    value: "value",
    get: undefined,
    set: undefined
  };
  expect(object.property).toBe("value");
  expect(Object.getOwnPropertyDescriptor(object, "property")).toEqual(expected);
});

it("Define a non enumerable property", () => {
  const object = {};
  util.defineNonEnumerableProperty(object, "property", "value");
  const expected = {
    writable: true,
    enumerable: false,
    configurable: true,
    value: "value",
    get: undefined,
    set: undefined
  };
  expect(object.property).toBe("value");
  expect(Object.getOwnPropertyDescriptor(object, "property")).toEqual(expected);
});

it("asyncForEach call callback for each item in array", () => {
  const array = [1, 2, 3];
  const mockCallback = jest.fn(); // mock function

  return util.asyncForEach(array, mockCallback).then(() => {
    expect(mockCallback.mock.calls.length).toBe(array.length);
  });
});

it("asyncForEach returns a promise", () => {
  const array = [1, 2, 3];
  const mockCallback = jest.fn(); // mock function

  const promise = util.asyncForEach(array, mockCallback);
  expect(promise).toBeInstanceOf(Promise);
});

it("defineGetterAndSetter sets an enumerable getter & setter on the objects prototype", () => {
  const object = {};
  object.prototype = Function;
  object.prototype.get = jest.fn();
  object.prototype.set = jest.fn();
  const name = "test";
  util.defineGetterAndSetter(object, name);

  expect(
    Object.getOwnPropertyDescriptor(object.prototype, name).configurable
  ).toBe(false);
  expect(
    Object.getOwnPropertyDescriptor(object.prototype, name).enumerable
  ).toBe(true);
  expect(
    Object.getOwnPropertyDescriptor(object.prototype, name).get
  ).toBeInstanceOf(Function);
  expect(
    Object.getOwnPropertyDescriptor(object.prototype, name).set
  ).toBeInstanceOf(Function);

  object.prototype[name] = true;
  object.prototype[name];
  expect(object.prototype.get.mock.calls.length).toBe(1);
  expect(object.prototype.set.mock.calls.length).toBe(1);
});

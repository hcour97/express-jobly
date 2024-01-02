const { sqlForPartialUpdate } = require("./sql");

// TEST FOR ONE
describe("sqlForPartialUpdate", function() {
    test("Updates 1 item", function() {
        const results = sqlForPartialUpdate( 
            { a1: "b1" },
            { a1: "a1", aA2: "a2"});
        expect(results).toEqual({
            setCols: "\"a1\"=$1",
            values: ["b1"]
        });
    });

    test("Updates 2 items", function() {
        const results = sqlForPartialUpdate(
            { a1: "b1", aA2: "b2"},
            {aA2: "a2"});
        expect(results).toEqual({
            setCols: "\"a1\"=$1, \"a2\"=$2",
            values: ["b1", "b2"]
        });
    });
});

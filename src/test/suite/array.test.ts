import * as assert from "assert";
import { flatten, distinct } from "../../utils/array";

suite("array", () => {
    suite("flatten", () => {
        test("it should correctly flatten a 2D array", () => {
            const arr = [[1], [2, 3], [4]];
            const result = flatten(arr);
            assert.deepStrictEqual(result, [1, 2, 3, 4]);
        });

        test("should properly handle empty nested arrays", () => {
            const arr = [[1], [], [2], [3]];
            const result = flatten(arr);
            assert.deepStrictEqual(result, [1, 2, 3]);
        });
    });

    suite("distinct", () => {
        test("should properly remove duplicate items from arrays", () => {
            const arr = [1, 1, 2, 3, 3, 4];
            const result = distinct(arr);
            assert.deepStrictEqual(result, [1, 2, 3, 4]);
        });

        test("should properly handle empty arrays", () => {
            const arr = [] as Number[];
            const result = distinct(arr);
            assert.deepStrictEqual(result, []);
        });
    });
});

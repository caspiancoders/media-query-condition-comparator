var assert = require('assert');
var {MediaQueryCondition, compare} = require('../index.js');
var {compare} = require('../index.js');

describe('MediaQueryCondition', function () {
    describe('#getRaw()', function () {
        it('should return exact same condition string given to its constructor.', function () {
            let condition = new MediaQueryCondition('(max-width: 920px)');

            assert.equal('(max-width: 920px)', condition.getRaw());

            condition = new MediaQueryCondition('(min-width: 100px)');

            assert.equal('(min-width: 100px)', condition.getRaw());
        });
    });

    describe('#isMax', function () {
        it('should return `true` when our condition is a `max-width` type.', function () {
            let condition = new MediaQueryCondition('(max-width: 920px)');

            assert.strictEqual(condition.isMax(), true);
        });

        it('should return `false` when our condition is a `min-width` type.', function () {
            let condition = new MediaQueryCondition('(min-width: 920px)');

            assert.strictEqual(condition.isMax(), false);
        });

        it('should return `false` when our condition is both `min-width` and `max-width` type.', function () {
            let condition = new MediaQueryCondition('(max-width: 400px) and (min-width: 920px)');

            assert.strictEqual(condition.isMax(), false);
        });
    });

    describe('#isMin', function () {
        it('should return `false` when our condition is a `max-width` type.', function () {
            let condition = new MediaQueryCondition('(max-width: 1100px)');

            assert.strictEqual(condition.isMin(), false);
        });

        it('should return `true` when our condition is a `min-width` type.', function () {
            let condition = new MediaQueryCondition('(min-width: 200em)');

            assert.strictEqual(condition.isMin(), true);
        });

        it('should return `false` when our condition is both `min-width` and `max-width` type.', function () {
            let condition = new MediaQueryCondition('(max-width: 400px) and (min-width: 920px)');

            assert.strictEqual(condition.isMin(), false);
        });
    });

    describe('#isMinMax', function () {
        it('should return `false` when our condition is a `max-width` type.', function () {
            let condition = new MediaQueryCondition('(max-width: 1100px)');

            assert.strictEqual(condition.isMinMax(), false);
        });

        it('should return `false` when our condition is a `min-width` type.', function () {
            let condition = new MediaQueryCondition('(min-width: 200em)');

            assert.strictEqual(condition.isMinMax(), false);
        });

        it('should return `true` when our condition is both `min-width` and `max-width` type.', function () {
            let condition = new MediaQueryCondition('(max-width: 400px) and (min-width: 920px)');

            assert.strictEqual(condition.isMinMax(), true);
        });
    });

    describe('#getValues', function () {
        it('should return `100px` when condition is `(min-width: 100px)`.', function () {
            let condition = new MediaQueryCondition('(min-width: 100px)');

            assert.strictEqual(condition.getValues('first'), '100px');
        });

        it('should return `800em` when condition is `(max-width: 800em)`.', function () {
            let condition = new MediaQueryCondition('(max-width: 800em)');

            assert.strictEqual(condition.getValues('first'), '800em');
        });

        it('should return `[100, 500rem]` when condition is `(max-width: 100) and (min-width: 500rem)`.', function () {
            let condition = new MediaQueryCondition('(max-width: 100) and (min-width: 500rem)');

            assert.deepStrictEqual(condition.getValues(), ['100', '500rem']);
        });

        it('should return `[400px, 920px]` when condition is `(min-width: 400px) and (max-width: 920px)`.', function () {
            let condition = new MediaQueryCondition('(min-width: 400px) and (max-width: 920px)');

            assert.deepStrictEqual(condition.getValues(), ['400px', '920px']);
        });
    });

    describe('#hasPriority', function () {
        it('should return `true` when our first condition is `max-width` and second is `min-width`.', function () {
            let condition1 = new MediaQueryCondition('(max-width: 100px)');
            let condition2 = new MediaQueryCondition('(min-width: 100px)');

            assert.strictEqual(condition1.hasPriority(condition2), true);
        });

        it('should return `true` when our first condition is `max-width` and second is `min-width` and `max-wdith`.', function () {
            let condition1 = new MediaQueryCondition('(max-width: 100px)');
            let condition2 = new MediaQueryCondition('(min-width: 100px) and (max-width: 500px)');

            assert.strictEqual(condition1.hasPriority(condition2), true);
        });

        it('should return `false` when our first condition is `min-width` and second is `min-width` and `max-wdith`.', function () {
            let condition1 = new MediaQueryCondition('(min-width: 100px)');
            let condition2 = new MediaQueryCondition('(min-width: 100px) and (max-width: 500px)');

            assert.strictEqual(condition1.hasPriority(condition2), false);
        });

        it('should return `false` when our first condition is `min-width` and second is `max-width`.', function () {
            let condition1 = new MediaQueryCondition('(min-width: 100px)');
            let condition2 = new MediaQueryCondition('(max-width: 500px)');

            assert.strictEqual(condition1.hasPriority(condition2), false);
        });

        it('should return `true` when our first condition is `min-width` and `max-width` and second is `min-width`.', function () {
            let condition1 = new MediaQueryCondition('(min-width: 100px) and (max-width: 500px)');
            let condition2 = new MediaQueryCondition('(min-width: 500px)');

            assert.strictEqual(condition1.hasPriority(condition2), true);
        });

        it('should return `false` when our first condition is `min-width` and `max-width` and second is `max-width`.', function () {
            let condition1 = new MediaQueryCondition('(min-width: 100px) and (max-width: 500px)');
            let condition2 = new MediaQueryCondition('(max-width: 500px)');

            assert.strictEqual(condition1.hasPriority(condition2), false);
        });

        it('should return `true` when first condition is `(min-width: 100px)` and second condition is `(min-width: 200px)`.', function () {
            let condition1 = new MediaQueryCondition('(min-width: 100px)');
            let condition2 = new MediaQueryCondition('(min-width: 200px)');

            assert.strictEqual(condition1.hasPriority(condition2), true);
        });

        it('should return `false` when first condition is `(min-width: 300px)` and second condition is `(min-width: 100px)`.', function () {
            let condition1 = new MediaQueryCondition('(min-width: 300px)');
            let condition2 = new MediaQueryCondition('(min-width: 100px)');

            assert.strictEqual(condition1.hasPriority(condition2), false);
        });

        it('should return `true` when first condition is `(max-width: 500px)` and second condition is `(max-width: 100px)`.', function () {
            let condition1 = new MediaQueryCondition('(max-width: 500px)');
            let condition2 = new MediaQueryCondition('(max-width: 100px)');

            assert.strictEqual(condition1.hasPriority(condition2), true);
        });

        it('should return `false` when first condition is `(max-width: 100px)` and second condition is `(max-width: 500px)`.', function () {
            let condition1 = new MediaQueryCondition('(max-width: 100px)');
            let condition2 = new MediaQueryCondition('(max-width: 500px)');

            assert.strictEqual(condition1.hasPriority(condition2), false);
        });
    });
});

describe('compare()', function () {
    it('should return `-1` when first is `(max-width: 300px)` and second is `(min-width: 500px)`.', function () {
        assert.strictEqual(compare('(max-width: 300px)', '(min-width: 500px)'), -1);
    });

    it('should return `1` when first is `(min-width: 100px)` and second is `(min-width: 50px)`.', function () {
        assert.strictEqual(compare('(min-width: 100px)', '(min-width: 50px)'), 1);
    });

    it('should return `1` when first is `(min-width: 100px)` and second is `(max-width: 10)`.', function () {
        assert.strictEqual(compare('(min-width: 100px)', '(max-width: 10)'), 1);
    });

    it('should return `1` when first is `(min-width: 100)` and second is `(min-width: 100) and (max-width: 50)`.', function () {
        assert.strictEqual(compare('(min-width: 100)', '(min-width: 100) and (max-width: 50)'), 1);
    });
});
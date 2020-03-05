/**
 * Media query condition.
 *
 * Represents a single media query condition. Used to easily get the type of
 * condition (either min-width, max-width or both) and its value.
 */
class MediaQueryCondition {
    /**
     * Constructor.
     *
     * @param {string} conditionString
     */
    constructor(conditionString) {
        this._conditionString = conditionString;
        this._isMin = false;
        this._isMax = false;
        this._conditions = null;

        this._parseConditionString(conditionString);
    }

    isMax() {
        return this._isMax;
    }

    isMin() {
        return this._isMin;
    }

    isMinMax() {
        return this._isMinMax;
    }

    /**
     * Returns true when it has priority over the given condition.
     *
     * @param {MediaQueryCondition} condition
     */
    hasPriority(condition) {
        if (this._isMin) {
            if (condition.isMin()) {
                let first = parseInt(this.getValues('first'));
                let second = parseInt(condition.getValues('first'));

                return first < second;
            }

            return false;
        }

        if (this._isMax) {
            if (condition.isMax()) {
                let first = parseInt(this.getValues('first'));
                let second = parseInt(condition.getValues('first'));

                return first > second;
            }

            return true;
        }

        return this._isMinMax && !condition.isMax();
    }

    /**
     * Returns the raw condition string.
     *
     * @returns {string}
     */
    getRaw() {
        return this._conditionString;
    }

    /**
     * Returns the condition keys.
     *
     * @param {string} returnType
     * @returns {array|string}
     */
    getKeys(returnType = 'array') {
        const keys = this._conditions.map(condition => condition.key);

        switch (returnType) {
            case 'first':
                return keys[0];

            default:
                return keys;
        }
    }

    /**
     * Returns the condition values.
     *
     * @param {string} returnType Determines how to return values,
     * can be 'array' or 'first'. In case of 'first' it returns the first item.
     * Defaults to 'array'.
     *
     * @returns {array|string}
     */
    getValues(returnType = 'array') {
        const values = this._conditions.map(condition => condition.value);

        switch (returnType) {
            case 'first':
                return values[0];

            default:
                return values;
        }
    }

    /**
     * Parses a condition string and extracts its arguments.
     *
     * @param {string} condition
     * @private
     */
    _parseConditionString(condition) {
        this._extractData(condition);
        this._setupMinMax();
    }

    /**
     * Extracts the condition data.
     *
     * @param {string} condition
     * @private
     */
    _extractData(condition) {
        this._conditions = [];
        const regex = /\(([\w\-]+):\s?(\w+)\)/g;
        let matches = null;

        do {
            matches = regex.exec(condition);

            if (matches) {
                this._conditions.push({
                    key: matches[1],
                    value: matches[2]
                })
            }

        } while (matches);
    }

    /**
     * Setups the min max data.
     *
     * @private
     */
    _setupMinMax() {
        const keys = this.getKeys();

        this._isMin = keys.indexOf('min-width') !== -1;
        this._isMax = keys.indexOf('max-width') !== -1;
        this._isMinMax = this._isMin && this._isMax;
        this._isMin = this._isMin && !this._isMinMax;
        this._isMax = this._isMax && !this._isMinMax;
    }
}

/**
 * Compares two media query conditions and returns a value between -1, 0, 1
 * based on which condition has higher priority over the other.
 *
 * @param {string|MediaQueryCondition} a
 * @param {string|MediaQueryCondition} b
 *
 * @return {0|-1|1}
 */
function compare(a, b) {
    a = new MediaQueryCondition(a);
    b = new MediaQueryCondition(b);

    return a.hasPriority(b) ? -1 : 1;
}

module.exports = {
    compare,
    MediaQueryCondition,
};

module.exports = () => {
    class Builder {

        constructor() {
        }

        /**
         * 默认情况
         * @param key
         * @param selector
         * @param removeSelector
         * @param methodInfo
         * @param dataStrategy
         * @param dealStrategy
         * @returns {{key: *, selector: Array, methodInfo: {text: Array}, dataStrategy: {string: Array}, dealStrategy: string, removeSelector: Array}}
         */
        normal(key, selector = [], removeSelector = [], methodInfo = {text: []}, dataStrategy = {"string": []}, dealStrategy = "jsdom") {
            return {
                key: key,
                selector: selector,
                methodInfo: methodInfo,
                dataStrategy: dataStrategy,
                dealStrategy: dealStrategy,
                removeSelector: removeSelector
            };
        }

        /**
         * 有数组的情况
         * @param key
         * @param selector
         * @param removeSelector
         * @param data
         * @param dealStrategy
         * @returns {{key: *, selector: *, methodInfo: {each: Array}, dataStrategy: string, dealStrategy: string, removeSelector: Array, data: Array}}
         */
        array(key, selector, removeSelector = [], data = [], dealStrategy = "jsdom") {
            return {
                key: key,
                selector: selector,
                methodInfo: {each: []},
                dataStrategy: "array",
                dealStrategy: dealStrategy,
                removeSelector: removeSelector,
                data: data
            };
        }

    }

    return new Builder();
};
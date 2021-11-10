import {tokenize, markEdits} from 'react-diff-view';

const TokenizeF = (hunks) => {
    if (!hunks) {
        return undefined;
    }

    const options = {
        highlight: false,
        enhancers: [markEdits(hunks, {type: 'block'})],
    };

    try {
        return tokenize(hunks, options);
    } catch (ex) {
        return undefined;
    }
};

export default TokenizeF;
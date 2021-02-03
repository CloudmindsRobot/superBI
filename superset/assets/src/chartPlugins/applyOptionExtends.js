
const chain = [];


const applyUtc = function(options, props) {
    options.useUTC = props.formData.useUtc;
    return options;
}


export const addExecutor = function(chainItem) {
    chain.push(chainItem);
}


addExecutor(applyUtc);

export function applyOptionExtends(options, props) {
    const applyChain = chain;

    for(const chainItem of applyChain) {
        options = chainItem(options, props);
    }

    return options;
}
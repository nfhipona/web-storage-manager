module.exports = function () {
    const presets = [ "env" ];
    const plugins = [ 
        "transform-object-rest-spread",
        "transform-react-jsx"
     ];

    return {
        presets,
        plugins
    };
}
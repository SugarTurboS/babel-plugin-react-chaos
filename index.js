module.exports = function(babel){
    let t = babel.types;
    return {
        visitor: {
            ImportDeclaration(path, state){
                let chaosLevel = state.opts.chaosLevel ? state.opts.chaosLevel : 5;
                const updateParamNameVisitor = {
                    ExportDefaultDeclaration(path) {
                        var dName = path.node.declaration.name;
                        if(dName){
                            const funcId = t.identifier('withChaos');
                            const func = t.callExpression(funcId,[path.node.declaration,
                                t.numericLiteral(chaosLevel), t.stringLiteral(dName + 'Chaos Error')]);
                            const defaults = t.exportDefaultDeclaration(func);
                            path.replaceWith(defaults);
                        }
                    }
                };
                if(path.node.source.value === 'react'){
                    const importDefault = t.importDefaultSpecifier(t.identifier('withChaos'));
                    const imports = t.importDeclaration([importDefault], t.stringLiteral('react-chaos'));

                    const newPath = path.findParent((path) => path.isProgram());
                    newPath.node.body.splice(2,0,imports);
                    newPath.traverse(updateParamNameVisitor)
                }
            }
        }
    }
}
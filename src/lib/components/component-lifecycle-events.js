const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports.get = function(ast) {
    return `\n${this.getOnInit(ast)}${this.getOnChanges(ast)}${this.getOnDestroy(ast)}${this.getPostLink(ast)}\n`;
};

module.exports.getOnInit = function (ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const controllerClass = classes[0];

    if(!controllerClass) {
        return '';
    }

    let onInit = controllerClass.members.find(x => x.name && x.name.text === '$onInit' && (x.initializer || x.body));

    if (onInit) {
        onInit = ast.text.slice(onInit.pos, onInit.end);
        onInit = onInit.replace(/(public|private|async| ) ?\$onInit.*/, 'ngOnInit(): void {');
    }
    else {
        const constructor = controllerClass.members.find(x => x.kind === kind.Constructor);
        if(constructor) {
            onInit = constructor.body.statements.find(s => {
                return /\$onInit/.test(ast.text.slice(s.pos, s.end));
            });
            if (onInit) {
                onInit = ast.text.slice(onInit.pos, onInit.end);
                onInit = onInit.replace(/this\.\$onInit.*{/, 'ngOnInit(): void {');
                onInit = onInit.replace(/ {4}/g, '  ');
                onInit = onInit.replace(/ {6}/g, '        ');
                onInit = onInit.slice(0, onInit.length - 1);
            }
        }
    }

    return onInit || '';
};

module.exports.getOnChanges = function (ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const controllerClass = classes[0];

    if(!controllerClass) {
        return '';
    }

    let onChanges = controllerClass.members.find(x => x.name && x.name.text === '$onChanges' && (x.initializer || x.body));

    if (onChanges) {
        onChanges = ast.text.slice(onChanges.pos, onChanges.end);
        onChanges = onChanges.replace(/(private|public|async| ) ?\$onChanges.*{/, 'ngOnChanges(changes: SimpleChanges): void {');
    }
    else {
        const constructor = controllerClass.members.find(x => x.kind === kind.Constructor);
        if(constructor) {
            onChanges = constructor.body.statements.find(s => {
                return /\$onChanges/.test(ast.text.slice(s.pos, s.end));
            });
            if (onChanges) {
                onChanges = ast.text.slice(onChanges.pos, onChanges.end);
                onChanges = onChanges.replace(/this\.\$onChanges.*/, 'ngOnChanges(changes: SimpleChanges): void {');
                onChanges = onChanges.replace(/ {4}/g, '  ');
                onChanges = onChanges.replace(/ {6}/g, '        ');
                onChanges = onChanges.slice(0, onChanges.length - 1);
            }
        }
    }

    if(onChanges) {
        onChanges = onChanges.replace(/bindings/g, 'changes');
    }

    return onChanges || '';
};

module.exports.getOnDestroy = function (ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const controllerClass = classes[0];

    if(!controllerClass) {
        return '';
    }
    
    let onDestroy = controllerClass.members.find(x => x.name && x.name.text === '$onDestroy' && (x.initializer || x.body));

    if (onDestroy) {
        onDestroy = ast.text.slice(onDestroy.pos, onDestroy.end);
        onDestroy = onDestroy.replace(/(private|public|async| ) ?\$onDestroy.*/, 'ngOnDestroy(): void {');
    }
    else {
        const constructor = controllerClass.members.find(x => x.kind === kind.Constructor);
        if(constructor) {
            onDestroy = constructor.body.statements.find(s => {
                return /\$onDestroy/.test(ast.text.slice(s.pos, s.end));
            });
            if (onDestroy) {
                onDestroy = ast.text.slice(onDestroy.pos, onDestroy.end);
                onDestroy = onDestroy.replace(/this\.\$onDestroy.*{/, 'ngOnDestroy(): void {');
                onDestroy = onDestroy.replace(/ {4}/g, '  ');
                onDestroy = onDestroy.replace(/ {6}/g, '        ');
                onDestroy = onDestroy.slice(0, onDestroy.length - 1);
            }
        }
    }

    return onDestroy || '';
};

module.exports.getPostLink = function (ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const controllerClass = classes[0];
    

    if(!controllerClass) {
        return '';
    }
    
    let postLink = controllerClass.members.find(x => x.name && x.name.text === '$postLink' && (x.initializer || x.body));

    if (postLink) {
        postLink = ast.text.slice(postLink.pos, postLink.end);
        postLink = postLink.replace(/(private|public|async| ) ?\$postLink.*/, 'ngAfterViewInit(): void {');
    }
    else {
        const constructor = controllerClass.members.find(x => x.kind === kind.Constructor);
        if(constructor) {
            postLink = constructor.body.statements.find(s => {
                return /\$postLink/.test(ast.text.slice(s.pos, s.end));
            });
            if (postLink) {
                postLink = ast.text.slice(postLink.pos, postLink.end);
                postLink = postLink.replace(/this\.\$postLink.*{/, 'ngAfterViewInit(): void {');
                postLink = postLink.replace(/ {4}/g, '  ');
                postLink = postLink.replace(/ {6}/g, '        ');
                postLink = postLink.slice(0, postLink.length - 1);
            }
        }
    }

    return postLink || '';
};

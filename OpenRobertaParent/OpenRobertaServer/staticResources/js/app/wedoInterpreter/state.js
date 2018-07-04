(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./constants", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var C = require("./constants");
    var U = require("./util");
    var bindings = {};
    var stack = [];
    var operations = [];
    var functions = {};
    var pc = 0;
    var operationsStack = [];
    function reset() {
        bindings = {};
        stack = [];
        operations = [];
        pc = 0;
        // p( 'state reset' );
    }
    exports.reset = reset;
    function getFunction(name) {
        return functions[name];
    }
    exports.getFunction = getFunction;
    function bindVar(name, value) {
        if (name === undefined || name === null) {
            dbcException("bindVar name invalid");
        }
        if (value === undefined || value === null) {
            dbcException("bindVar value invalid");
        }
        var nameBindings = bindings[name];
        if (nameBindings === undefined || nameBindings === null || nameBindings === []) {
            bindings[name] = [value];
            p('bind new ' + name + ' with ' + value + ' of type ' + typeof value);
        }
        else {
            nameBindings.unshift(value);
            p('bind&hide ' + name + ' with ' + value + ' of type ' + typeof value);
        }
    }
    exports.bindVar = bindVar;
    function unbindVar(name) {
        if (name === undefined || name === null) {
            dbcException("unbindVar name invalid");
        }
        var oldBindings = bindings[name];
        if (oldBindings.length < 1) {
            dbcException("unbind failed for: " + name);
        }
        oldBindings.shift();
        p('unbind ' + name + ' remaining bindings are ' + oldBindings.length);
    }
    exports.unbindVar = unbindVar;
    function getVar(name) {
        if (name === undefined || name === null) {
            dbcException("getVar name invalid");
        }
        var nameBindings = bindings[name];
        if (nameBindings === undefined || nameBindings === null || nameBindings.length < 1) {
            dbcException("getVar failed for: " + name);
        }
        // p( 'get ' + name + ': ' + nameBindings[0] );
        return nameBindings[0];
    }
    exports.getVar = getVar;
    function setVar(name, value) {
        if (name === undefined || name === null) {
            dbcException("setVar name invalid");
        }
        if (value === undefined || value === null) {
            dbcException("setVar value invalid");
        }
        var nameBindings = bindings[name];
        if (nameBindings === undefined || nameBindings === null || nameBindings.length < 1) {
            dbcException("setVar failed for: " + name);
        }
        nameBindings[0] = value;
        // p( 'set ' + name + ': ' + nameBindings[0] );
    }
    exports.setVar = setVar;
    function push(value) {
        if (value === undefined || value === null) {
            dbcException("push value invalid");
        }
        stack.push(value);
        p('push ' + value + ' of type ' + typeof value);
    }
    exports.push = push;
    function pop() {
        if (stack.length < 1) {
            dbcException("pop failed with empty stack");
        }
        var value = stack.pop();
        // p( 'pop ' + value );
        return value;
    }
    exports.pop = pop;
    function storeCode(ops, fct) {
        operations = ops;
        functions = fct;
        pc = 0;
    }
    exports.storeCode = storeCode;
    // only for debugging!
    function getOps() {
        var state = {};
        state[C.OPS] = operations;
        state[C.PC] = pc;
        return state;
    }
    exports.getOps = getOps;
    function getOp() {
        while (operations !== undefined && pc >= operations.length) {
            popOps();
        }
        if (operations === undefined) {
            return undefined;
        }
        else {
            return operations[pc++];
        }
    }
    exports.getOp = getOp;
    function pushOps(reenable, ops) {
        if (reenable && pc > 0) {
            pc--;
        }
        var opsWrapper = {};
        opsWrapper[C.OPS] = operations;
        opsWrapper[C.PC] = pc;
        operationsStack.unshift(opsWrapper);
        operations = ops;
        pc = 0;
        opLog('PUSHING STMTS');
    }
    exports.pushOps = pushOps;
    function popOps() {
        var opsWrapper = operationsStack.shift();
        operations = opsWrapper === undefined ? undefined : opsWrapper[C.OPS];
        pc = opsWrapper === undefined ? 0 : opsWrapper[C.PC];
    }
    exports.popOps = popOps;
    function popOpsUntil(target) {
        while (true) {
            var opsWrapper = operationsStack.shift();
            if (opsWrapper === undefined) {
                throw "pop ops until " + target + "-stmt failed";
            }
            var suspendedStmt = opsWrapper[C.OPS][opsWrapper[C.PC]];
            clearDangerousProperties(suspendedStmt);
            if (suspendedStmt[C.OPCODE] === target) {
                operations = opsWrapper[C.OPS];
                pc = opsWrapper[C.PC];
                return;
            }
        }
    }
    exports.popOpsUntil = popOpsUntil;
    function clearDangerousProperties(stmt) {
        var opc = stmt[C.OPCODE];
        if (opc === C.REPEAT_STMT) {
            stmt[C.VALUE] = undefined;
            stmt[C.END] = undefined;
        }
        else if (opc === C.METHOD_CALL_VOID || opc === C.METHOD_CALL_RETURN) {
            stmt[C.RETURN] = undefined;
        }
    }
    exports.clearDangerousProperties = clearDangerousProperties;
    function opLog(msg) {
        var opl = '';
        var counter = 0;
        for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
            var op = operations_1[_i];
            var opc = op[C.OPCODE];
            if (op[C.OPCODE] === C.EXPR) {
                opc = opc + '[' + op[C.EXPR];
                if (op[C.EXPR] === C.BINARY) {
                    opc = opc + '-' + op[C.OP];
                }
                opc = opc + ']';
            }
            opl = opl + (counter++ == pc ? '*' : '') + opc + ' ';
        }
        p(msg + ' pc:' + pc + ' ' + opl);
    }
    exports.opLog = opLog;
    function p(s) {
        U.p(s);
    }
    function dbcException(s) {
        U.dbcException(s);
    }
});
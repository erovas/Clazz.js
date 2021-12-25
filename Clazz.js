/**
 * Clazz.js v1.0.0
 * Small library to create classes without using class syntax.
 * [Back-compatibility: IE11+]
 * Copyright (c) 2022, Emanuel Rojas Vásquez
 * BSD 3-Clause License
 * https://github.com/erovas/Clazz.js
 */
(function(window){

    let PROTOTYPE = 'prototype';
    let STATIC = 'Static';
    let EXTENDS = 'Extends';
    let SUPER = 'Super';
    let CONSTRUCTOR = 'constructor';
    let ES5_CONSTRUCTOR = 'Constructor';
    let NO_FUNCTION = 'is not a function';
    let NO_PLAIN_OBJECT = 'is not a plain object';

    function Clazz(builder){

        //Comprobar que lo que se ha pasado en un objeto plano
        if(!_aux_is_plain_object(builder))
            _aux_throwError(CONSTRUCTOR, NO_PLAIN_OBJECT);

        if(builder[SUPER])
            _aux_throwError(SUPER, 'is a reserved name');

        //Comprobar el Constructor
        if(!_aux_isFunction(builder[ES5_CONSTRUCTOR]))
            _aux_throwError(ES5_CONSTRUCTOR, NO_FUNCTION);

        //Comprobar el Extends
        let Extends = builder[EXTENDS];

        if(Extends && !_aux_isFunction(Extends))
            _aux_throwError(EXTENDS, NO_FUNCTION);


        //Comprobar los Statics
        let Static = builder[STATIC];

        if(Static && !_aux_is_plain_object(Static))
            _aux_throwError(STATIC, NO_PLAIN_OBJECT);


        //objeto dummy para NO modificar el original
        let obj = _aux_object_assing(Object.create(null), builder);

        //Crear funcion constructora
        let classe = _aux_build_constructor(obj);

        //Seteo de los Statics
        _aux_set_static(classe, obj);

        //Seteo de los prototypes
        _aux_object_assing(classe[PROTOTYPE], obj);
        
        //Devolver la function class
        return classe;
    }

    //Revelación del objeto
    window.Clazz = Clazz;

    //#region Utilidades

    function _aux_build_constructor(obj){
        let builder_ = obj[ES5_CONSTRUCTOR];
        let extends_ = obj[EXTENDS];
        let out = builder_;

        if(extends_){

            out = function(){
                let that = this;
                that[SUPER] = function(){
                    extends_.apply(that, arguments);
                }

                builder_.apply(that, arguments);

                that[SUPER] = undefined;
            }

            //Herencia de los prototypes
            _aux_object_assing(out[PROTOTYPE], extends_[PROTOTYPE]);
            //out[PROTOTYPE] = Object.create(extends_[PROTOTYPE]);

            //Herencia de los Static
            //_aux_object_assing(out, extends_);  //Error en IE
            //Object.assign(out, extends_);       //Toca hacer polyfill
            for(let property in extends_)
                if(Object.hasOwnProperty.call(extends_, property))
                    _aux_defineProperty(out, property, extends_[property]);
                    //out[property] = extends_[property];
        }

        //Redefinir el constructor de la clase
        _aux_defineProperty(out[PROTOTYPE], CONSTRUCTOR, out);

        //Borrado del "Extends" del objeto dummy
        delete obj[EXTENDS];
        //Borrado del "Constructor" del objeto dummy
        delete obj[ES5_CONSTRUCTOR];
        
        return out;
    }

    /**
     * Lanza un error
     * @param {String} txt 
     * @param {String} act 
     * @returns 
     */
    function _aux_throwError(txt, act){
        let error;
        try { throw new Error(); }
        catch(e){ error = e; }
        if(!error) return;

        error = error.stack.split('\n');
        //removing the line that we force to generate the error (let error = new Error();) from the message
        //aux.splice(0, 2);
        error.splice(0, 3);
        error = error.join('\n');
        if(act)
            error = '"' + txt + '" ' + act + '\n' + error;
        else
            error = txt + '\n' + error;
        
        throw error;
    }

    /**
     * Define un prototipo
     * @param {Object} target 
     * @param {String} name 
     * @param {Object} value 
     */
    function _aux_defineProperty(target, name, value){
        Object.defineProperty(target, name, { value: value });
    }

    /**
     * Comprueba si obj es un objeto palno
     * @param {object} obj 
     * @returns 
     */
    function _aux_is_plain_object(obj){
        if(
            //Separate from primitives
            typeof obj === 'object' &&
            //Separate build-in like Math
            Object.prototype.toString.call(obj) === '[object Object]'
            ){
            let props = Object.getPrototypeOf(obj);
            //obj == Object.create(null) || Separate instances (Array, DOM, ...)
            return props === null || props[CONSTRUCTOR] === Object;
        }
    
        return false;
    }

    /**
     * Simliar a Object.assing() pero mas poderoso
     * @param {object} target 
     * @param {object} source 
     * @returns 
     */
    function _aux_object_assing(target, source){
        Object.getOwnPropertyNames(source).forEach(function(name){
            Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
        });
        return target;
    }

    function _aux_isFunction(obj){
        return typeof obj == 'function';
    }

    /**
     * setea metodos, propiedas de la classe (NO de prototype)
     * @param {function} target 
     * @param {object} source 
     * @returns 
     */
     function _aux_set_static(target, source){
        let static = source[STATIC];
        if(static) _aux_object_assing(target, static);
        delete source[STATIC];
        return target;
    }

    //#endregion

})(window);
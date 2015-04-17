(function () {
	'use strict';


	angular.module('ang-validator')
		.service('internalValidation', [
			InternalValidation
		]);

	function InternalValidation () {}

	InternalValidation.prototype = {
		/**
		 *
		 * @param {object} obj
		 * @param {string} errMsg
		 * @param {boolean=} isOptional Defaults to false
		 * @return void
		 * @throws ReferenceError
		 * @description
		 * If the object is not defined and not optional, this method will throw ReferenceError
		 */
		validateObject: validateObject,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @param {boolean=} isOptional Defaults to false
		 * @return void
		 * @throws ReferenceError
		 * @description
		 * If the property on the object does not exist and is not optional, this method will throw ReferenceError
		 */
		validateProperty: validateProperty,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @param {boolean=} canBeEmpty Defaults to false
		 * @return void
		 * @throws TypeError RangeError
		 * @description
		 * If the property on the object is not a string this method will throw TypeError.
		 * If the property on the string is an empty string, and canBeEmpty is not true, this method will throw RangeError
		 */
		validateString: validateString,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @return void
		 * @throws TypeError
		 * @description
		 * If the property on the object is not a function this method will throw TypeError.
		 */
		validateFunction: validateFunction,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @param {boolean=} isOptional Defaults to false
		 * @param {boolean=} canBeEmpty Defaults to false
		 * @description
		 * Validates a string property.
		 */
		validateStringProperty: validateStringProperty,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @param {boolean=} isOptional Defaults to false
		 * @description
		 * Validates a function property.
		 */
		validateFunctionProperty: validateFunctionProperty
	};

	/**
	 *
	 * @param {object} obj
	 * @param {string} errMsg
	 * @param {boolean=} isOptional Defaults to false
	 * @return void
	 * @throws ReferenceError
	 * @description
	 * If the object is not defined and not optional, this method will throw ReferenceError
	 */
	function validateObject (obj, errMsg, isOptional) {
		isOptional = !!isOptional;

		if (!obj && !isOptional) {
			throw new ReferenceError(errMsg + ' must be provided.');
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @param {boolean=} isOptional Defaults to false
	 * @return void
	 * @throws ReferenceError
	 * @description
	 * If the property on the object does not exist and is not optional, this method will throw ReferenceError
	 */
	function validateProperty (obj, propName, errMsg, isOptional) {
		isOptional = !!isOptional;

		if (angular.isUndefined(obj[propName]) && !isOptional) {
			throw new ReferenceError(errMsg + ' must have a ' + propName + ' property.');
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @param {boolean=} canBeEmpty Defaults to false
	 * @return void
	 * @throws TypeError RangeError
	 * @description
	 * If the property on the object is not a string this method will throw TypeError.
	 * If the property on the string is an empty string, and canBeEmpty is not true, this method will throw RangeError
	 */
	function validateString (obj, propName, errMsg, canBeEmpty) {
		if (!angular.isString(obj[propName])) {
			throw new TypeError(errMsg + propName + ' property must be a string.');
		}

		if (obj[propName] === '' && !canBeEmpty) {
			throw new RangeError(errMsg + propName + ' property must not be an empty string.');
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @return void
	 * @throws TypeError
	 * @description
	 * If the property on the object is not a function this method will throw TypeError.
	 */
	function validateFunction (obj, propName, errMsg) {
		if (!angular.isFunction(obj[propName])) {
			throw new TypeError(errMsg + propName + ' property must be a function.');
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @param {boolean=} isOptional Defaults to false
	 * @param {boolean=} canBeEmpty Defaults to false
	 * @description
	 * Validates a string property.
	 */
	function validateStringProperty (obj, propName, errMsg, isOptional, canBeEmpty) {
		isOptional = !!isOptional;
		canBeEmpty = !!canBeEmpty;
		/*jshint validthis:true */
		this.validateProperty(obj, propName, errMsg, isOptional);

		if (obj[propName]) {
			this.validateString(obj, propName, errMsg + '\'s ', canBeEmpty);
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @param {boolean=} isOptional Defaults to false
	 * @description
	 * Validates a function property.
	 */
	function validateFunctionProperty (obj, propName, errMsg, isOptional) {
		isOptional = !!isOptional;

		/*jshint validthis:true */
		this.validateProperty(obj, propName, errMsg, isOptional);

		if (obj[propName]) {
			this.validateFunction(obj, propName, errMsg + '\'s ');
		}
	}
}());
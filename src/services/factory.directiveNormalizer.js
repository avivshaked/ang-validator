(function () {
	'use strict';

	var _ErrHead  = 'ang-validator: directiveNormalizer: ';

	angular.module('ang-validator')
		.factory('directiveNormalizer', [
			DirectiveNormalizer
		]);
	function DirectiveNormalizer () {
		return {
			convertMethodNameToDirectiveName: convertMethodNameToDirectiveName,
			fromCamelCase: fromCamelCase
		};

		/**
		 *
		 * @param {string} methodName
		 * @param {string=} prefix
		 * @returns {string}
		 */
		function convertMethodNameToDirectiveName (methodName, prefix) {
			var _errMsg = _ErrHead + 'convertMethodNameToDirectiveName: ';

			// Validations and defaults
			if(!angular.isString(prefix)) {
				prefix = '';
			}

			if (angular.isUndefined(methodName)) {
				throw new ReferenceError(_errMsg + 'methodName argument must be provided');
			}
			if (!angular.isString(methodName)) {
				throw new TypeError(_errMsg + 'methodName argument must be a string');
			}
			if (methodName === '') {
				throw new RangeError(_errMsg + 'methodName argument must not be an empty string');
			}


			// Declarations
			var i;
			var originalChars = methodName.split('');
			var processedChars = [];
			var lastIsUppercase =true;

			// Set first char. IF prefix exists then first char is uppercase, otherwise its lowercase.
			if (prefix) {
				processedChars[0] = originalChars[0].toUpperCase();
			} else {
				processedChars[0] = originalChars[0].toLowerCase();
			}

			// Iterate through remaining chars. Each uppercase is converted to lowercase if the char before was an uppercase.
			// The reason for this is - you dont want angular to normalize isURL method to is-u-r-l bu to isUrl or with prefix
			// ngvIsUrl
			for (i=1; i<originalChars.length; i+=1) {
				if (/[a-zA-Z]/.test(originalChars[i]) && originalChars[i] === originalChars[i].toUpperCase()) {
					if (lastIsUppercase) {
						// This checks if there are any more chars. If there are we need to verify that the next one is not
						// a lowercase char. If it is, this chat must remain capitalized.
						// example: isURLValid should be converted to isUrlValid and not isUrlvalid
						if (i+1 < originalChars.length && /[a-zA-Z]/.test(originalChars[i+1]) && originalChars[i+1] === originalChars[i+1].toLowerCase()) {
							processedChars.push(originalChars[i]);
						} else {
							processedChars.push(originalChars[i].toLowerCase());
						}
					} else {
						processedChars.push(originalChars[i]);
						lastIsUppercase = true;
					}
				} else {
					processedChars.push(originalChars[i]);
					lastIsUppercase = false;
				}
			}

			return prefix + processedChars.join('');
		}

		function fromCamelCase (str) {

			// VALIDATIONS
			var _errMsg = _ErrHead + 'fromCamelCase: ';

			if (angular.isUndefined(str)) {
				throw new ReferenceError(_errMsg + 'str argument must be provided');
			}
			if (!angular.isString(str)) {
				throw new TypeError(_errMsg + 'str argument must be a string');
			}
			if (str === '') {
				throw new RangeError(_errMsg + 'str argument must not be an empty string');
			}

			var i;
			var originalChars = str.split('');
			var processedChars = [];

			processedChars[0] = originalChars[0].toLowerCase();
			for (i=1; i<originalChars.length; i+=1) {
				if (/[a-zA-Z]/.test(originalChars[i]) && originalChars[i] === originalChars[i].toUpperCase()) {
					processedChars.push('-');
					processedChars.push(originalChars[i].toLowerCase());
				} else {
					processedChars.push(originalChars[i]);
				}
			}

			return processedChars.join('');
		}
	}
}());
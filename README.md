# ang-validator.js #
[![Build Status](https://travis-ci.org/avivshaked/ang-validator.svg?branch=master)](https://travis-ci.org/avivshaked/ang-validator)
[![Coverage Status](https://coveralls.io/repos/avivshaked/ang-validator/badge.svg?branch=master)](https://coveralls.io/r/avivshaked/ang-validator?branch=master)

An angular wrapper for chriso's [validator.js](https://github.com/chriso/validator.js).

An angular wrapper for chriso's validator.js . 
It wraps all of validator.js functionality into easy to use angular directives. 
It also provides a simple way to add custom angular validators and sanitizers.

## How to install ##
This library can be installed via [bower](http://bower.io/).

	$ bower install ang-validator --save
	
Another way to install this library is to clone this repository. Then copy the file ang-validator.js or and-validator.min.js from dist folder, and put it in your project.

	$ git clone https://github.com/avivshaked/ang-validator.git


	
	
## How to include ##
First reference chriso's validator.js
Then reference ang-validator.js

	<script src="/bower_components/validator-js/validator.js"></script>
	<script src="/bower_components/ang-validator/ang-validator.js"></script>

In you module reference ang-validator.js

	angular.module('myApp', ['ang-validator']);


## How to access validator.js functionality ##
Any of validator.js functionality is available via $validator service. 
Inject the service anywhere, and call the methods you need.

Example:
	
	angular.module('myApp')
		.controller('MyCtrl', [
			'$validator'
			function ($validator) {
				this.isValAnEmail = function (val) {
					return $validator.isEmail(val);
				};
			}
		]);
		
Example with options: 

	angular.module('myApp')
		.controller('MyCtrl', [
			'$validator'
			function ($validator) {
				this.isValAUrl = function (val) {
					return $validator.isURL(val, {require_tld: false});
				};
			}
		]);

For any information on chriso's [validator.js](https://github.com/chriso/validator.js) please check out the git.

## ang-validator validator directives ##
All of validator.js validators have a correlating angular directive. All the directives have an "ngv" prefix, and then a normalized version of the original method. For example "equals" is ngv-equals, and isURL is ngv-is-url.
**To use the directives**, add them as attribute to an input that has an ng-model directive.
Example:

	<input ng-model="userEmail" ngv-is-email>
	
Now this input (or rather its model) has a validator that acts exactly the same as native angular validators.
When the input has a value that is not a valid email, the element will have an ng-invalid-is-email. When the input has a value that is a valid email, the element will have an ng-valid-is-email attribute.
If the input has no value, the element will show as valid (like native angular validators). 
The model on the form will reflect the error when the validation is invalid.

	<form name="myForm">
		<input ng-model="email" name="userEmail" ngv-is-email>
		<p ng-show="myForm.userEmail.$error.isEmail">Not a valid email</p>
	</form>

If you want the validator directive to validate even when the input has no value, use ngv-required="true"

	<input ng-model="userEmail" ngv-is-email ngv-required="true">
	
You can also use the directives with options or values. To do this simply add the desired expression to the directive.

	<form name="myForm">
		<label> What is the meaning of life?
			<input name="answer" ng-model="userAnswer" ngv-equals="42" ngv-required="true">
			<p ng-show="!myForm.answer.$error.equals">Right!</p>
		</label>
	</form>

You don't have to use a value, this is an expression and will be evaluated against the scope. ngv-equals="ctrl.someVar", means that angular will try to extrapolate the value of ctrl.someVar, and the extrapolated value will be passed to the validator.

If the value of the expression is an array, it will be passed to the validator as individual params.

	<input ng-model="password" ngv-is-length="[4, 12]">
	
script

	function isLength (val, min, max) {
		// min will get the value 4
		// max will get the value 12
	}

The expression can also be in the form of an object, with direct values or with references:

	<input name="homepage" ng-model="ctrl.homepage" ngv-is-url="{protocols: ctrl.allowedProtocolsArray, allow_trailing_dot: true}">


## ang-validator sanitizer directives ##
All of validator.js sanitizers have a correlating angular directive. All the directives have an "ngs" prefix, and then a normalized version of the original method. For example "toInt" is ngs-to-int, and "normalizeEmail" is ngs-normalize-email.
**To use the directives**, add them as attribute to an input that has an ng-model directive.
Example:

	<input ng-model="someNumber" ngs-to-int>
	
Now this input (or rather its model) has a parser that acts exactly the same as native angular parsers.
When the input has a value, the model's value will be a number, and in this case, an integer.
The sanitizer will change only the model value and **not the input's value**.
	
You can also use the directives with options or values. To do this simply add the desired expression to the directive.

	<form name="myForm">
		<label> Please enter you're values a base 16
			<input name="someHexNumber" ng-model="someHexNumber" ngs-to-int="16">
		</label>
	</form>

You don't have to use a value, this is an expression and will be evaluated against the scope. ngs-to-int="ctrl.someVar", means that angular will try to extrapolate the value of ctrl.someVar, and the extrapolated value will be passed to the sanitizer.

If the value of the expression is an array, it will be passed to the sanitizer as individual params.

The expression can also be in the form of an object, with direct values or with references:

	
	
### **Directives** ###
#### **Validators** ####

#####equals 

 - Description: check if the string matches the comparison.
 - Directive name: **ngv-equals**
 - Validator name: **equals**
 - options: **comparison** {string}
 - Example: `<input ng-model=value" ngv-equals="42">`
 
#####contains 

 - Description: check if the string contains the seed.
 - Directive name: **ngv-contains**
 - Validator name: **contains**
 - options: **seed** {string}
 - Example: `<input ng-model=value" ngv-contains="thisword">`
 
#####matches 
 
 - Description: check if string matches the pattern.
 - Directive name: **ngv-matches**
 - Validator name: **matches**
 - options: **pattern** {regex} || **Array <pattern{string}[, modifiers{string}]>**
 - Example1: `<input ng-model=value" ngv-matches="ctrl.regex">`
 - Example2: `<input ng-model=value" ngv-matches="['hello', 'i']">`
 
#####isEmail 

 - Description: check if the string is an email.
 - Directive name: **ngv-is-email**
 - Validator name: **isEmail**
 - options: **object** optional
	- **allow_display_name**: boolean Default: false. If set to true, the validator will also match Display Name `<email-address>`
	- **allow_utf8_local_part**: boolean Default: true. If set to false, the validator will not allow any non-English UTF8 character in email address' local part. 
 - Example1: `<input ng-model=value" ngv-is-email>`
 - Example2: `<input ng-model=value" ngv-is-email="{allow_utf8_local_part: false}">`
 
#####isURL 
 
 - Description: check if the string is an URL.
 - Directive name: **ngv-is-url**
 - Validator name: **isUrl**
 - options: **object** optional
 	- **protocols**: Array of strings Default: ['http','https','ftp']
 	- **require_tld**: boolean Default: true
 	- **require_protocol**: boolean Default: false
 	- **allow_underscores**: boolean Default: false
 	- **host_whitelist**: boolean | Array of string Default: false
 	- **host_blacklist**:boolean | Array of string Default: false
 	- **allow_trailing_dot**: boolean Default: false
 	- **allow_protocol_relative_urls**: boolean Default: false
 - Example1: `<input ng-model=value" ngv-is-url>`
 - Example2: `<input ng-model=value" ngv-is-url="{require_tld: false, host_blacklist: ctrl.hostBlacklist}">`

#####isFQDN 
 
 - Description: check if the string is a fully qualified domain name (e.g. domain.com).
 - Directive name: **ngv-is-fqdn**
 - Validator name: **isFqdn**
 - options: **object** optional
	- **require_tld**: boolean Default: true
	- **allow_underscores**: boolean Default: false
 - Example1: `<input ng-model=value" ngv-is-fqdn>`
 - Example2: `<input ng-model=value" ngv-is-fqdn="{require_tld: false}">`

#####isIP 

 - Description: check if the string is an IP (version 4 or 6).
 - Directive name: **ngv-is-ip**
 - Validator name: **isIp**
 - options: **version** {string} defaults to 4
 - Example: `<input ng-model=value" ngv-is-ip="6">`
 
#####isAlpha 

 - Description: check if the string contains only letters (a-zA-Z).
 - Directive name: **ngv-is-alpha**
 - Validator name: **isAlpha**
 - Example: `<input ng-model=value" ngv-is-alpha>`
 
#####isNumeric 

 - Description: check if the string contains only letters (a-zA-Z).
 - Directive name: **ngv-is-numeric**
 - Validator name: **isNumeric**
 - Example: `<input ng-model=value" ngv-is-numeric>`

#####isAlphanumeric 

 - Description: check if the string contains only letters and numbers.
 - Directive name: **ngv-is-alphanumeric**
 - Validator name: **isAlphanumeric**
 - Example: `<input ng-model=value" ngv-is-alphanumeric>` 
 
#####isBase64 

 - Description: check if a string is base64 encoded.
 - Directive name: **ngv-is-base64**
 - Validator name: **isBase64**
 - Example: `<input ng-model=value" ngv-is-base64>` 
 
#####isHexadecimal 

 - Description: check if the string is a hexadecimal number.
 - Directive name: **ngv-is-hexadecimal**
 - Validator name: **isHexadecimal**
 - Example: `<input ng-model=value" ngv-is-hexadecimal>` 
 
#####isHexColor 

 - Description: check if the string is a hexadecimal color.
 - Directive name: **ngv-is-hexColor**
 - Validator name: **isHexColor**
 - Example: `<input ng-model=value" ngv-is-hexColor>` 
 
#####isLowercase 

 - Description: check if the string is lowercase.
 - Directive name: **ngv-is-lowercase**
 - Validator name: **isLowercase**
 - Example: `<input ng-model=value" ngv-is-lowercase>` 
 
#####isUppercase 

 - Description: check if the string is uppercase.
 - Directive name: **ngv-is-uppercase**
 - Validator name: **isUppercase**
 - Example: `<input ng-model=value" ngv-is-uppercase>`

#####isInt 

 - Description: check if the string is an integer. options is an object which can contain the keys min and/or max to check the integer is within boundaries (e.g. { min: 10, max: 99 }).
 - Directive name: **ngv-is-int**
 - Validator name: **isInt**
 - options: **object** optional
	- **min**: number= optional
	- **max**: number= optional
 - Example: `<input ng-model=value" ngv-is-int>` 
 - Example: `<input ng-model=value" ngv-is-int={ min: 10, max: 99 }>` 

 
#####isFloat 

 - Description: check if the string is a float. options is an object which can contain the keys min and/or max to validate the float is within boundaries (e.g. { min: 7.22, max: 9.55 }).
 - Directive name: **ngv-is-float**
 - Validator name: **isFloat**
 - options: **object** optional
	- **min**: number= optional
	- **max**: number= optional 
 - Example: `<input ng-model=value" ngv-is-float>` 
 - Example: `<input ng-model=value" ngv-is-float={ min: 7.22, max: 9.55 }>` 
 
#####isDivisibleBy 

 - Description: check if the string is a number that's divisible by another.
 - Directive name: **ngv-is-divisible-by**
 - Validator name: **isDivisibleBy**
 - options: **number** {number}
 - Example: `<input ng-model=value" ngv-is-divisible-by="2">` 

#####isNull 

 - Description: check if the string is null.
 - Directive name: **ngv-is-null**
 - Validator name: **isNull**
 - Example: `<input ng-model=value" ngv-is-null >` 
 
#####isLength 
 
 - Description: check if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 - Directive name: **ngv-is-length**
 - Validator name: **isLength**
 - options: **min** {number} || **Array <min{number}[, max{number}]>**
 - Example1: `<input ng-model=value" ngv-is-length="4">` // Value's length will have to be equal or greater then 4
 - Example2: `<input ng-model=value" ngv-is-length="[4, 8]">` // Value's length will have to be equal or greater then 4 and equal or smaller then 8
 
#####isByteLength 
 
 - Description: check if the string's length (in bytes) falls in a range.
 - Directive name: **ngv-is-byte-length**
 - Validator name: **isByteLength**
 - options: **min** {number} || **Array <min{number}[, max{number}]>**
 - Example1: `<input ng-model=value" ngv-is-byte-length="4">` // Value's length will have to be equal or greater then 4
 - Example2: `<input ng-model=value" ngv-is-byte-length="[4, 8]">` // Value's length will have to be equal or greater then 4 and equal or smaller then 8
 
#####isUUID 

 - Description: check if the string is a UUID (version 3, 4 or 5).
 - Directive name: **ngv-is-uuid**
 - Validator name: **isUuid**
 - options: **version** {string=} optional
 - Example: `<input ng-model=value" ngv-is-uuid="3">`
 
#####isDate 

 - Description: check if the string is a date.
 - Directive name: **ngv-is-date**
 - Validator name: **isDate**
 - Example: `<input ng-model=value" ngv-is-date >` 
 
#####isAfter 

 - Description: check if the string is a date that's after the specified date (defaults to now).
 - Directive name: **ngv-is-after**
 - Validator name: **isAfter**
 - options: **date** {date=} optional defaults to now
 - Example1: `<input ng-model=value" ngv-is-after >` 
 - Example2: `<input ng-model=value" ngv-is-after="12/12/12" >` 
 
#####isBefore 

 - Description: check if the string is a date that's before the specified date.
 - Directive name: **ngv-is-before**
 - Validator name: **isBefore**
 - options: **date** {date}
 - Example2: `<input ng-model=value" ngv-is-before="12/12/12" >`

#####isIn 

 - Description: check if the string is in a array of allowed values.
 - Directive name: **ngv-is-in**
 - Validator name: **isIn**
 - options: **values** {Array}
 - Example: `<input ng-model=value" ngv-is-in="['home', 'office', 'pool']">`

#####isCreditCard 

 - Description: check if the string is a credit card.
 - Directive name: **ngv-is-credit-card**
 - Validator name: **isCreditCard**
 - Example: `<input ng-model=value" ngv-is-credit-card>`
 
#####isISIN 

 - Description: check if the string is a credit card.
 - Directive name: **ngv-is-isin**
 - Validator name: **isIsin**
 - Example: `<input ng-model=value" ngv-is-isin>`
 
#####isISBN 

 - Description: check if the string is an ISBN (version 10 or 13).
 - Directive name: **ngv-is-isbn**
 - Validator name: **isIsbn**
 - options: **version** {string=} optional (version 10 or 13).
 - Example: `<input ng-model=value" ngv-is-isbn="13">`
 
#####isMobilePhone 

 - Description: check if the string is a mobile phone number, (locale is one of ['zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM']).
 - Directive name: **ngv-is-mobile-phone**
 - Validator name: **isMobilePhone**
 - options: **local** {string} Needs to be one of ['zh-CN', 'en-ZA', 'en-AU', 'en-HK', 'pt-PT', 'fr-FR', 'el-GR', 'en-GB', 'en-US', 'en-ZM']
 - Example: `<input ng-model=value" ngv-is-mobile=phone="en-US">`
 
#####isJSON 

 - Description: check if the string is valid JSON (note: uses JSON.parse).
 - Directive name: **ngv-is-json**
 - Validator name: **isJson**
 - Example: `<input ng-model=value" ngv-is-json>`
 
#####isMultibyte 

 - Description: check if the string contains one or more multibyte chars.
 - Directive name: **ngv-is-multibyte**
 - Validator name: **isMultibyte**
 - Example: `<input ng-model=value" ngv-is-multibyte>`
 
#####isAscii 

 - Description: check if the string contains ASCII chars only.
 - Directive name: **ngv-is-ascii**
 - Validator name: **isAscii**
 - Example: `<input ng-model=value" ngv-is-ascii>`
 
#####isFullWidth 

 - Description: check if the string contains any full-width chars.
 - Directive name: **ngv-is-full-width**
 - Validator name: **isFullWidth**
 - Example: `<input ng-model=value" ngv-is-full-width>`
 
#####isHalfWidth 

 - Description: check if the string contains any half-width chars.
 - Directive name: **ngv-is-half-width**
 - Validator name: **isHalfWidth**
 - Example: `<input ng-model=value" ngv-is-half-width>`
 
#####isVariableWidth 

 - Description: check if the string contains a mixture of full and half-width chars.
 - Directive name: **ngv-is-variable-width**
 - Validator name: **isVariableWidth**
 - Example: `<input ng-model=value" ngv-is-variable-width>`
 
#####isSurrogatePair 

 - Description: check if the string contains any surrogate pairs chars.
 - Directive name: **ngv-is-surrogate-pair**
 - Validator name: **isSurrogatePair**
 - Example: `<input ng-model=value" ngv-is-surrogate-pair>`
 
#####isMongoId 

 - Description: check if the string is a valid hex-encoded representation of a MongoDB ObjectId.
 - Directive name: **ngv-is-mongo-id**
 - Validator name: **isMongoId**
 - Example: `<input ng-model=value" ngv-is-mongo-id>`
 
#####isCurrency 
 
 - Description: check if the string is a valid currency amount. 
 - Directive name: **ngv-is-currency**
 - Validator name: **isCurrency**
 - options: **object** optional
	- **symbol**: string Default: '$'
	- **require_symbol**: boolean Default: false
	- **allow_space_after_symbol**: boolean Default: false
	- **symbol_after_digits**: boolean Default: false
	- **allow_negatives**: boolean Default: true
	- **parens_for_negatives**: boolean Default: false
	- **negative_sign_before_digits**: boolean Default: false
	- **negative_sign_after_digits**: boolean Default: false
	- **thousands_separator**: string Default: ','
	- **decimal_separator**: string Default: '.'
	- **allow_space_after_digits**: boolean Default: false
 - Example1: `<input ng-model=value" ngv-is-currency>`
 - Example2: `<input ng-model=value" ngv-is-currency="{symbol: 'EU', allow_space_after_symbol: true}">`


#### **Sanitizers** ####

######**toString**

 - Description: convert the input to a string.
 - Directive name: **ngs-to-string**
 - Example: `<input ng-model=model" ngs-to-string>`
 
#####toDate

 - Description: convert the input to a date, or null if the input is not a date.
 - Directive name: **ngs-to-date**
 - Example: `<input ng-model=model" ngs-to-date>`
 
#####toFloat 

 - Description: convert the input to a float, or NaN if the input is not a float.
 - Directive name: **ngs-to-float**
 - Example: `<input ng-model=model" ngs-to-float>`
 
#####toInt 

 - Description: convert the input to an integer, or NaN if the input is not an integer.
 - Directive name: **ngs-to-int**
 - options: **radix** {number=} optional
 - Example: `<input ng-model=model" ngs-to-int="10">`
 
#####toBoolean 

 - Description: convert the input to a boolean. Everything except for '0', 'false' and '' returns true. In strict mode only '1' and 'true' return true.
 - Directive name: **ngs-to-boolean**
 - options: **strict** {boolean=} optional
 - Example: `<input ng-model=model" ngs-to-boolean>`
 
#####trim 

 - Description: trim characters (whitespace by default) from both sides of the input.
 - Directive name: **ngs-trim**
 - options: **chars** {string=} optional
 - Example: `<input ng-model=model" ngs-trim>`
 
#####ltrim 

 - Description: trim characters (whitespace by default) from the left-side of the input.
 - Directive name: **ngs-ltrim**
 - options: **chars** {string=} optional
 - Example: `<input ng-model=model" ngs-ltrim>`
 
#####rtrim 

 - Description: trim characters (whitespace by default) from the right-side of the input.
 - Directive name: **ngs-rtrim**
 - options: **chars** {string=} optional
 - Example: `<input ng-model=model" ngs-rtrim>`
 
#####escape 

 - Description: replace <, >, &, ', " and / with HTML entities.
 - Directive name: **ngs-escape**
 - Example: `<input ng-model=model" ngs-escape>`
 
#####stripLow 

 - Description: remove characters with a numerical value < 32 and 127, mostly control characters. If keep_new_lines is true, newline characters are preserved (\n and \r, hex 0xA and 0xD). Unicode-safe in JavaScript.
 - Directive name: **ngs-strip-low**
 - options: **keep_new_lines** {boolean=} optional
 - Example: `<input ng-model=model" ngs-strip-low>`
 
#####whitelist 

 - Description: remove characters that do not appear in the whitelist. The characters are used in a RegExp and so you will need to escape some chars, e.g. whitelist(input, '\[\]').
 - Directive name: **ngs-white-list**
 - options: **chars** {string}
 - Example: `<input ng-model=model" ngs-white-list="yn">`
 
#####blacklist 

 - Description: remove characters that appear in the blacklist. The characters are used in a RegExp and so you will need to escape some chars, e.g. blacklist(input, '\[\]').
 - Directive name: **ngs-black-list**
 - options: **chars** {string}
 - Example: `<input ng-model=model" ngs-black-list="!@#$">`
 
#####normalizeEmail 

 - Description: canonicalize an email address. options is an object which defaults to { lowercase: true }. With lowercase set to true, the local part of the email address is lowercased for all domains; the hostname is always lowercased and the local part of the email address is always lowercased for hosts that are known to be case-insensitive (currently only GMail). Normalization follows special rules for known providers: currently, GMail addresses have dots removed in the local part and are stripped of tags (e.g. some.one+tag@gmail.com becomes someone@gmail.com) and all @googlemail.com addresses are normalized to @gmail.com.
 - Directive name: **ngs-normalize-email**
 - options: **object** - optional
	- **lowercase**: boolean Default: true
 - Example: `<input ng-model=model" ngs-normalize-email>`
 - Example: `<input ng-model=model" ngs-normalize-email="{lowercase: false}">`

## Adding custom validators ##
This feature has two advantages to angular's own mechanism. It can be added on the fly (though it is not recommended. It's best to add validators at run phase). The other advantage is its simplicity.
Using $validatorBuilder.buildValidator method, you need to pass an object that has 3 parameters:

 - directiveName: {string} will be normalized. i.e. ngDirective will be normalized to ng-directive.
 - validatorName: {string} Will remain as is in the model, and will be normalized in the class names. i.e. "validatorName" will remain "validatorName" on the $error object, and will be ng-valid-validator-name and ng-invalid-validator-name classes.
 - validator: {function} the function takes ({*}value, {*=} option) or if passed an array as option then ({*} value, [arg1 ...[, args]]). The function needs to return a boolean. True means valid. False means invalid.

example1: eight.

Say we would want a validator that is valid when an input equals 8

	angular.module('myApp')
		.run([
			'$validatorBuilder',
			function ($validatorBuilder) {
				$validatorBuilder.buildValidator({
					directiveName: 'eight',
					validatorName: 'eight',
					validator: function (val) {
						return val===8;
					}
				});
			}
		]);


example2: between.

Say we would want a validator that is valid when an number is between min and max

	angular.module('myApp')
		.run([
			'$validatorBuilder',
			function ($validatorBuilder) {
			
				// First way to do it
				$validatorBuilder.buildValidator({
					directiveName: 'isBetween',
					validatorName: 'between',
					validator: function (val, min, max) {
						return val >= min && val <= max;
					}
				});
				
				// Second way to do it
				$validatorBuilder.buildValidator({
					directiveName: 'isBetween',
					validatorName: 'between',
					validator: function (val, options) {
						return val >= options.min && val <= options.max;
					}
				});
			}
		]);
		
The difference in the two ways to do it is expressed in the way that options are passed in the html markup

	<input ng-model="value" is-between="[3,7]" > // This is used for the first way
	<input ng-model="value" is-between="{min: 3, max: 7}" > // This is used for the second way
	
If you want to add multiple validator directives you can use $validatorBuilder.buildValidators which takes an array of the validator objects.

		angular.module('myApp')
			.run([
				'$validatorBuilder',
	 			function ($validatorBuilder) {
					$validatorBuilder.buildValidators([
						{
							directiveName: 'eight',
							validatorName: 'eight',
							validator: function (val) {
								return val===8;
							}
						},
						{
							directiveName: 'isBetween',
							validatorName: 'between',
							validator: function (val, min, max) {
								return val >= min && val <= max;
						}
					]);
				}
			]);

	
You can use $validator.extend method to expand the functionality of validator.js. This makes the code more testable.

		angular.module('myApp')
			.run([
				'$validator',
				'$validatorBuilder',
				function ($validator, $validatorBuilder) {
				
					// This will allow you to unit test the validator without having to inject it in an element.
					// It also adheres to the separation of control principle.
					$validator.extend('eight', function (val) {
						return val===8;
					});
					
					
					$validatorBuilder.buildValidator({
						directiveName: 'eight',
						validatorName: 'eight',
						validator: $validator.eight
					});
				}
			]);

## Adding custom sanitizers ##
This feature has two advantages to angular's own mechanism. It can be added on the fly (though it is not recommended. It's best to add validators at run phase). The other advantage is its simplicity.
Using $validatorBuilder.buildSanitizer method, you need to pass an object that has 2 parameters:

 - directiveName: {string} will be normalized. i.e. ngDirective will be normalized to ng-directive.
 - sanitizer: {function} the function takes ({*}value, {*=} option) or if passed an array as option then ({*} value, [arg1 ...[, args]]). The function needs to return a value. If the returned value is undefined, angular will understand an error has occurred in the parser.

example1: noHello.

Say we would want a sanitizer that puts good-bye in our model for every hello

script

	angular.module('myApp')
		.run([
			'$validatorBuilder',
			function ($validatorBuilder) {
				$validatorBuilder.buildSanitizer({
					directiveName: 'noHello',
					sanitizer: function (val) {
						var pattern = /hello/g
						return val.replace(pattern, 'goodbye');
					}
				});
			}
		]);
		
		
html

	<input type="text" ngs-no-hello>
	
Now for each 'hello' the model will have the value 'goodbye' so if the user has entered 'hello world' the model will actually hold 'goodbye world'


example2: noHello.

Say we would want a sanitizer that puts some value in our model for every hello

script

	angular.module('myApp')
		.run([
			'$validatorBuilder',
			function ($validatorBuilder) {
				$validatorBuilder.buildSanitizer({
					directiveName: 'noHello',
					sanitizer: function (val, replaceWith) {
						var pattern = /hello/g
						return val.replace(pattern, replaceWith);
					}
				});
			}
		]);
		
		
html

	<input type="text" ngs-no-hello="fair well"> 
	<!-- will pass "fair well" to the sanitizer -->
	
	<input type="text" ngs-no-hello="ctrl.replaceHello"> 
	<!-- will pass the value of replaceHello on the controller -->
	
Now for each "hello" the user enters in the input, a "fair well" or the value of replaceHello will be in the model.
	
If you want to add multiple sanitizer directives you can use $validatorBuilder.buildSanitizers which takes an array of the sanitizer objects.

		angular.module('myApp')
			.run([
				'$validatorBuilder',
				function ($validatorBuilder) {
					$validatorBuilder.buildValidators([
						{
							directiveName: 'noHello',
							sanitizer: function (val, replaceWith) {
								var pattern = /hello/g;
								return val.replace(pattern, replaceWith);
							}
						},
						{
							directiveName: 'noGoodbye',
							sanitizer: function (val, replaceWith) {
								var pattern = /goodbye/g;
								return val.replace(pattern, replaceWith);
							}
						}
					]);
				}
			]);


## Manual build ##
If you've cloned or forked the repository, and have made changes to the files, use gulp to build. gulp (default) will build the dist files and run tests with coverage.

	$ gulp
	
## Gulp commands ##

- **gulp scripts**: Builds the dist files.
- **gulp test**: Runs all tests on the normal version.
- **gulp test-minified**: Runs all tests on the minified version.
- **gulp watch**: Puts watches in place. On script files change, it runs build and both versions of test. On specs change it runs both version of tests. If NODE_ENV is set to production, on test failure gulp will throw and exit.
- **gulp build**: Runs scripts and both versions of tests.
- **gulp** (default): Runs build and watch.
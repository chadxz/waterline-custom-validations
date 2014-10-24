'use strict';

/**
 * A list of common validation rules
 */
exports.validationRules = {
    duplicateValue: {
        rule: 'duplicateValue',
        message: 'This field requires unique values, yet the value you have supplied already exists.'
    },
    required: {
        rule: 'required',
        message: 'This field is required.'
    },
    oneRequired: {
        rule: 'oneRequired',
        message: 'One of these fields is required.'
    },
    invalidFieldInContext: {
        rule: 'invalidFieldInContext',
        message: 'This field is not valid in this context.'
    },
    entityDoesNotExist: {
        rule: 'entityDoesNotExist',
        message: 'This field refers to an entity that does not exist.'
    }
};

/**
 * Helper for building a custom validation error that looks like a waterline validation error.
 *
 * builds an object that looks like this:
 * {
 *   invalidAttributes: {
 *     fieldName: [
 *       {
 *         rule: 'required',
 *         message: 'This field is required.'
 *       }
 *     ]
 *   }
 * }
 *
 * @param {string} field The field that has the error
 * @param {object} ruleDefinition the rule definition the field has violated
 * @param {string} ruleDefinition.rule the name of the rule
 * @param {string} ruleDefinition.message the friendly description of the rule
 */
exports.validationErrorFor = function (field, ruleDefinition) {
    var validationError = { invalidAttributes: {} };
    validationError.invalidAttributes[field] = [ruleDefinition];
    return validationError;
};

/**
 * Helper to combine an array of validationErrors into a single validation error object.
 *
 * @param {Array} validationErrors A list of validation errors built using `validationErrorFor`
 */
exports.buildMultiValidationError = function (validationErrors) {
    var invalidAttributes = {};

    validationErrors.forEach(function (error) {
        Object.keys(error.invalidAttributes).forEach(function (attr) {
            if (!invalidAttributes[attr]) {
                invalidAttributes[attr] = error.invalidAttributes[attr];
                return;
            }

            // if the attribute already exists in our result invalidAttributes, only grab unique rules
            var uniqueRules = error.invalidAttributes[attr].filter(function (ruleDef) {
                return !invalidAttributes[attr].some(function (existingRuleDef) {
                    return existingRuleDef.rule === ruleDef.rule;
                });
            });

            invalidAttributes[attr] = invalidAttributes[attr].concat(uniqueRules);
        });
    });

    return { invalidAttributes: invalidAttributes };
};

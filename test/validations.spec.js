'use strict';
var chai = require('chai');
chai.config.includeStack = true;
var should = chai.should();

describe("validations", function () {

    var validations = require('../validations');

    it("exposes common validation rules", function () {
        should.exist(validations.validationRules);
        validations.validationRules.should.be.an('object');
    });

    describe("each validation rule", function () {

        it("has a rule and message", function () {
            Object.keys(validations.validationRules).forEach(function (key) {
                var ruleDefinition = validations.validationRules[key];
                should.exist(ruleDefinition.rule);
                ruleDefinition.rule.should.be.a('string');
                ruleDefinition.rule.should.not.equal('');
                should.exist(ruleDefinition.message);
                ruleDefinition.message.should.be.a('string');
                ruleDefinition.message.should.not.equal('');
            });
        });
    });

    it("has a validationErrorFor public method", function () {
        should.exist(validations.validationErrorFor);
        validations.validationErrorFor.should.be.a('function');
    });

    describe("the validationErrorFor public method", function () {

        describe("when called with a string field and rule", function () {

            it("returns an object in waterline validation error format", function () {
                var field = 'myfield';
                var rule = { rule: 'required', message: 'This field is required.' };

                var expected = {
                    invalidAttributes: {
                        myfield: [
                            { rule: 'required', message: 'This field is required.' }
                        ]
                    }
                };

                var actual = validations.validationErrorFor(field, rule);
                should.exist(actual);
                actual.should.deep.equal(expected);
            });
        });
    });

    it("has a buildMultiValidationError public method", function () {
        should.exist(validations.buildMultiValidationError);
        validations.buildMultiValidationError.should.be.a('function');
    });

    describe("the buildMultiValidationError public method", function () {

        describe("when called with 2 validation errors for the same field", function () {

            describe("but with different rules", function () {

                it("combines the rules into a single validation error", function () {
                    var expected = {
                        invalidAttributes: {
                            myfield: [
                                { rule: 'foo', message: 'foo' },
                                { rule: 'bar', message: 'bar' }
                            ]
                        }
                    };

                    var actual = validations.buildMultiValidationError([
                        validations.validationErrorFor('myfield', { rule: 'foo', message: 'foo' }),
                        validations.validationErrorFor('myfield', { rule: 'bar', message: 'bar' })
                    ]);

                    should.exist(actual);
                    actual.should.deep.equal(expected);
                });
            });

            describe("with the same rule both times", function () {

                it("only adds the rule once to the field", function () {
                    var expected = {
                        invalidAttributes: {
                            myfield: [
                                { rule: 'foo', message: 'foo' }
                            ]
                        }
                    };

                    var actual = validations.buildMultiValidationError([
                        validations.validationErrorFor('myfield', { rule: 'foo', message: 'foo' }),
                        validations.validationErrorFor('myfield', { rule: 'foo', message: 'foo' })
                    ]);

                    should.exist(actual);
                    actual.should.deep.equal(expected);
                });
            });
        });

        describe("when called with multiple validation rules for different fields", function () {

            it("creates a validationRule with an entry for each field", function () {
                var expected = {
                    invalidAttributes: {
                        field1: [
                            { rule: 'foo', message: 'foo' },
                            { rule: 'bar', message: 'bar' }
                        ],
                        field2: [
                            { rule: 'foo', message: 'foo' }
                        ],
                        field3: [
                            { rule: 'bar', message: 'bar' }
                        ]
                    }
                };

                var actual = validations.buildMultiValidationError([
                    validations.buildMultiValidationError([
                        validations.validationErrorFor('field1', { rule: 'foo', message: 'foo' }),
                        validations.validationErrorFor('field1', { rule: 'bar', message: 'bar' })
                    ]),
                    validations.validationErrorFor('field2', { rule: 'foo', message: 'foo' }),
                    validations.validationErrorFor('field3', { rule: 'bar', message: 'bar' })
                ]);

                should.exist(actual);
                actual.should.deep.equal(expected);
            });
        });
    });
});

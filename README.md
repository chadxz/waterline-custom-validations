# custom-validations

Library to help build validation messages that mimic the structure of waterline 0.10 validation messages.

This can be useful if you are already using waterline, and don't want to have to translate their structure into some other arbitrary structure.

The waterline validation error format is:

```
{
  invalidAttributes: {
    fieldName1: [
      { rule: 'someRuleName', message: 'some friendly rule message' },
      { rule: 'anotherRuleName', message: 'another friendly rule message' }
    ],
    fieldName2: [
      { rule: 'someRuleName', message: 'some friendly rule message' }
    ]
  }
}
```

actual waterline objects have a lot more properties/fields than this, as well as backwards compatibility for Sails 0.9x validation messages that use the `ValidationError` property to hold the validation errors. To see a full implementation of the waterline validation errors, see [the WLValidationError source in Waterline](https://github.com/balderdashy/waterline/blob/25fefac624bb24bb38521f1faf9c326028fcf2f0/lib/waterline/error/WLValidationError.js)


## development

To run the tests, clone the repo, then

 - `npm install`
 - `npm test`

You can also get code coverage on the tests by running

```
npm run cover
```

## contributing

To contribute, see [CONTRIBUTING.md](CONTRIBUTING.md)

## license

MIT

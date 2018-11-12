# Ngx Date Range

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.4.

This project began as a fork of [angular-2-daterangepicker](https://github.com/alsoicode/angular-2-daterangepicker) which works, but doesn't offer much in terms of type-safety or being able to be packaged for proper distribution as an Angular module, or for use with Angular's ReactiveForms module.

This codebase is heavily refactored from angular-2-daterangepicker, and works great out-of-the-box if you're using Bootstrap 4.x.

**This project is currently in development, and is not quite ready for production use.**

You can however, run this sample application to see current progress.

Items remaining:

- Re-enable "apply" button
- Re-enable pre-supplied date ranges.
- Styling for apply/cancel buttons.

## DatePicker Settings

Most settings are optional and an interface, [IDateRangePickerOptions](https://github.com/alsoicode/ngx-daterange/blob/master/src/modules/ngx-daterange/src/interfaces/IDateRangePickerOptions.ts) is provided.  Here are all of the settings currently enabled:

### autoApply

Automatically sets the `range` value when both dates are selected and hides the calendars. If using a single calendar, the `range` is set and the calendar is closed when the date is selected.

Type: `boolean`

Default value: `true`

<hr/>

### format

The format of the `range` value as displayed in the UI.

Type: `string`

Default value: `'YYYY-MM-DD'`

Accepted value: Any format string supported by [Moment.js](https://momentjs.com/docs/#/displaying/format/)

<hr/>

### icons

Icons displayed for the next/previous and month/year buttons. By default, inlined base64 images are used. If you're using Font Awesome 5, or Google Material Icons, you may specify one or the other. You are expected to apply the CSS for those libraries independent of this module.

Type: `string`

Default value: `'default'`

Accepted values: `'default'`, `'font-awesome'` or `'material'`

<hr />

### labelText

The text of the form label when using the default templating.

Type: `string`

Default value: `'Date Range'`

Accepted value: Any

<hr />

### maxDate

The maximum selectable date in the future.

Type: `Moment`

Default value: `null`

Accepted value: Any valid Moment instance.

<hr />

### minDate

The maximum selectable date in the past.

Type: `Moment`

Default value: `null`

Accepted value: Any valid Moment instance.

<hr />

### position

The side on which you would like the date picker to open.

Type: `string`

Default value: `'left'`

Accepted values: `'left'`, `'center'` or `'right'`

<hr />

### singleCalendar

Display a single calendar instance instead of a range. Useful when you don't want to add another dependency and need to select a single date.

Type:

Default value: `false`

<hr />


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build Sample App

Run `ng build` to build the sample app. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Build Library

Run `ng build:lib` to build the ngx-daterange module for deployment to npm. The build articfacts will be stored in the `ngx-daterange/dist` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

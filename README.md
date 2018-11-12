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

Most settings are optional. A set of default options is provided as such:

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Purpose</th>
      <th>Default Value</th>
      <th>Possible Value(s)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top">autoApply</td>
      <td valign="top">Automatically set the <code>range</code> value when both dates are selected and hide the calendars. If using a single calendar, the <code>range</code> is set and the calendar is closed when the date is selected.</td>
      <td valign="top"><code>true</code></td>
      <td valign="top"><code>true | false</code></td>
    </tr>
    <tr>
      <td valign="top">displayFormat</td>
      <td valign="top">The format of the <code>range</code> value as displayed in the UI.</td>
      <td valign="top" style="white-space: nowrap;"><code>'YYYY-MM-DD'</code></td>
      <td valign="top">Any format supported by <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">Moment.js</a></td>
    </tr>
    <tr>
      <td valign="top">icons</td>
      <td valign="top">Icons displayed for the next/previous month/year buttons. By default, images are used. If you're using Font Awesome 5, or Google Material Icons, you may specify one or the other. You are expected to apply the CSS independent of this module.</td>
      <td valign="top" style="white-space: nowrap;"><code>'default'</code></td>
      <td valign="top" style="white-space: nowrap;"><code>'default' | 'font-awesome' | 'material'</code></td>
    </tr>
  </tbody>
</table>




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

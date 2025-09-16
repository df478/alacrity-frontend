# Frontend App for AlaCrity

## Development

Run AlaCrity backend service in debug mode. Change `.env.development` to match your backend. Then run `yarn install` && `yarn start`

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `yarn run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

## Theming

AlaCrity's fronted supports dark and light modes. It is based on `antd` colour schemes. Therefore, all used `antd` components within the project support both modes by default. However if we implement a custom component or want to change some global colors some steps needs to be considered.

### Implement Dark Mode in custom component

To ensure your elements work with both dark and light modes, following points needs to be considered:

- **Don't use JSX inline styles for colors, use classNames instead and create rules within the `styles/style.less` or the according theme**
- Use `antd` variables as `@layout-body-background, @body-background, @skeleton-color` for the colors.
    - Use `@layout-body-background` for page backgrounds [`#f0f2f5`, `#000`]
    - Use `@background-color-light` for log views or input areas [`#fafafa`, `rgba(255, 255, 255, 0.04)`]
    - Use `@body-background` for elements within a card [`#fff`, `#000`]
    - Use `@skeleton-color` for all border colors. [`#f2f2f2`, `#303030`]
- Use the class `.inner-card` for nested cards, like the network stats.
- If you need additional colors, that are present within an `antd` component, grab the according variable located in `~antd/lib/style/themes/default.less`

#### Dev Mode & Hot Reload

It can happen that modifying the `app.less` during `yarn run dev` leads to `FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory less`. To overcome this, we need to set `max-old-space-size`.

```bash
export NODE_OPTIONS="--max-old-space-size=8192"
```

### Global Variables

To add global less variables place them in `styles/vars.less`.

### Override Antd specific Variables

To override `antd` specific colors modify the according constant in `config-overrides.js` -> [`lightVars`, `darkVars`].

## Tests

### e2e

e2e testing are nocking the network callback.
However, you need to run the project before running the e2e testing to allow the headless browser to navigate through your pages.
To run end to end testing you just have to run `yarn start` then `yarn test:e2e` or `yarn test:e2e--open` if you want to display the result.

const dataPackage=`
{
    "name": "forge-ui-starter",
    "version": "1.0.0",
    "main": "index.js",
    "license": "MIT",
    "private": true,
    "scripts": {
          "lint": "./node_modules/.bin/eslint src/**/* || npm run --silent hook-errors",
          "hook-errors": "echo 'x1b[31mThe build failed because a Forge UI hook is being used incorrectly. Forge UI hooks follow the same rules as React Hooks but have their own API definitions. See the Forge documentation for details on how to use Forge UI hooks.' && exit 1"
    },
    "devDependencies": {
          "eslint": "^6.5.1",
          "eslint-plugin-react-hooks": "^2.1.2"
    },
    "dependencies": {
          "@forge/ui": "^1.1.0"
    }
}

`
module.exports=dataPackage
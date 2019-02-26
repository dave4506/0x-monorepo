import webpack from 'webpack';

class ExtractReactRoutesPlugin {

    private _routesFile: string;
    private _options: object;
    private _plugins: (paths: [string]) => [object];

    constructor(_routesFile: string, _options: object, _plugins: (paths: [string]) => [object]) {
        this._routesFile = _routesFile;
        this._options = _options;
        this._plugins = _plugins;
    }

    private _generateWebPackConfigs(compiler: any): object {
        return {
            context: compiler.context,
            entry: {
              routes: [this._routesFile],
            },
            output: {
              path: '/',
              filename: 'routes.js',
            },
            module: {
              loaders: compiler.options.module.loaders,
            },
          };
    }

    private _compileRoutes(config: object): void {
        const compiler = webpack(config);
    }

    public apply(compiler: any): void {
        console.log('something is happening');
        // compile routes
        // exectute routes
        // create routes
        // send to plugins
        // callback
    }
}

// tslint:disable-next-line:no-default-export
export default ExtractReactRoutesPlugin;

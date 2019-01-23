import * as fs from 'fs';
import * as path from 'path';

import { ContractSource } from '../types';

import { EnumerableResolver } from './enumerable_resolver';

const SOLIDITY_FILE_EXTENSION = '.sol';

export class NameResolver extends EnumerableResolver {
    private readonly _contractsDir: string;
    constructor(contractsDir: string) {
        super();
        this._contractsDir = contractsDir;
    }
    public resolveIfExists(lookupContractName: string): ContractSource | undefined {
        console.log('enter1');
        // console.log('this._contractsDir', this._contractsDir);
        // console.log('resolveIfExists', lookupContractName);
        let contractSource: ContractSource | undefined;
        const onFile = (filePath: string) => {
            // console.log('onFile', filePath);
            const contractName = path.basename(filePath, SOLIDITY_FILE_EXTENSION);
            if (contractName === lookupContractName) {
                const absoluteContractPath = path.join(this._contractsDir, filePath);
                const source = fs.readFileSync(absoluteContractPath).toString();
                contractSource = { source, path: filePath, absolutePath: absoluteContractPath };
                return true;
            }
            return undefined;
        };
        this._traverseContractsDir(this._contractsDir, onFile);
        console.log('exit1');
        return contractSource;
    }
    public getAll(): ContractSource[] {
        console.log('enter');
        const contractSources: ContractSource[] = [];
        const onFile = (filePath: string) => {
            const absoluteContractPath = path.join(this._contractsDir, filePath);
            const source = fs.readFileSync(absoluteContractPath).toString();
            const contractSource = { source, path: filePath, absolutePath: absoluteContractPath };
            contractSources.push(contractSource);
        };
        this._traverseContractsDir(this._contractsDir, onFile);
        console.log('exit');
        return contractSources;
    }
    // tslint:disable-next-line:prefer-function-over-method
    private _traverseContractsDir(dirPath: string, onFile: (filePath: string) => true | void): boolean {
        console.log('dirPath entry', dirPath);
        let dirContents: string[] = [];
        try {
            dirContents = fs.readdirSync(dirPath);
        } catch (err) {
            console.log('dirPath throw', dirPath);
            throw new Error(`No directory found at ${dirPath}`);
        }
        for (const fileName of dirContents) {
            console.log('dirPath', dirPath, 'fileName', fileName);
            console.log('path.join(dirPath, fileName)', path.join(dirPath, fileName));
            const absoluteEntryPath = path.resolve(path.join(dirPath, fileName));
            const isDirectory = fs.lstatSync(absoluteEntryPath).isDirectory();
            console.log('this._contractsDir', this._contractsDir, 'absoluteEntryPath', absoluteEntryPath);
            const entryPath = path.relative(this._contractsDir, absoluteEntryPath);
            console.log('entryPath', entryPath);
            let isComplete;
            if (isDirectory) {
                console.log('_traverseContractsDir => ', absoluteEntryPath);
                isComplete = this._traverseContractsDir(absoluteEntryPath, onFile);
            } else if (fileName.endsWith(SOLIDITY_FILE_EXTENSION)) {
                isComplete = onFile(entryPath);
            }
            if (isComplete) {
                console.log('dirPath exit', dirPath);
                return isComplete;
            }
        }
        console.log('dirPath exit', dirPath);
        return false;
    }
}

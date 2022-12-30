import * as Electron from "electron"
import * as FsModule from 'fs'
import * as PathModule from 'path'

const { app, shell }: typeof Electron = window.require('@electron/remote')
const fs: typeof FsModule = window.require('fs')
const pathModule: typeof PathModule = window.require('path')

function getAppPath(): string {
  const appPath = app.getAppPath()
  if (pathModule.basename(appPath) === 'app.asar') {
    return pathModule.dirname(app.getPath('exe'))
  }
  return appPath;
}

function getUserDataPath(): string {
  return app.getPath('userData')
}

export function getDefaultConfigPath(): string {
  return pathModule.join(getAppPath(), 'public', 'default-config.json');
}

export function getConfigPath(): string {
  return pathModule.join(getUserDataPath(), 'config.json')
}

export function getDefaultTextPath(): string {
  return pathModule.join(getUserDataPath(), 'text.json')
}

export function getDefaultTextTemplateDir(): string {
    return pathModule.join(getUserDataPath(), 'text-template')
}

export function getDefaultTextTemplateOutputDir(): string {
    return pathModule.join(getUserDataPath(), 'text-template-output')
}

export function resolve(...paths: string[]): string {
    return pathModule.join(...paths)
}

export function createDirectoryIfNotExists(path: string): void {
    if (!fs.existsSync(path)) fs.mkdirSync(path)
}

export function listFiles(path: string): string[] {
    return fs.readdirSync(path)
}

export function fileExists(path: string): boolean {
    return fs.existsSync(path);
}

export function extension(path: string): string {
    return pathModule.extname(path)
}

export function filename(path: string, includeExtension: boolean = true): string {
    const name = pathModule.basename(path)
    if (includeExtension) return name

    return pathModule.parse(name).name
}

export function readJsonFile<T>(path: string): T {
    return JSON.parse(readFile(path))
}

export function readFile(path: string): string {
    return fs.readFileSync(path, 'utf-8')
}

export function saveJsonFile<T>(obj: T, path: string): void {
    saveFile(JSON.stringify(obj, null, 4), path)
}

export function saveFile(obj: string, path: string): void {
    fs.writeFileSync(path, obj, { encoding: 'utf8', flag: 'w'})
}

export function copyFile(fromPath: string, toPath: string) {
    fs.copyFileSync(fromPath, toPath, fs.constants.COPYFILE_EXCL)
}

export async function openFile(path: string): Promise<void> {
    await shell.openExternal(path)
}

export async function sleep(timeMs: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, timeMs))
}

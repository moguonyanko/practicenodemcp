const { createDefaultPreset } = require("ts-jest")

const tsJestTransformCfg = createDefaultPreset().transform

// /** @type {import("jest").Config} **/
// const config = {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg
//   }
// }

/** @type {import("jest").Config} */
const config = {
  // ⚠️ preset: 'ts-jest' はそのまま残します
  preset: 'ts-jest',
  testEnvironment: "node",

  // ★★★ transform の設定を修正 ★★★
  // ts-jest の警告に従い、globals の代わりに transform 内に直接 ts-jest の設定を記述します
  transform: {
    // TypeScript ファイルを ts-jest で変換
    '^.+\\.tsx?$': ['ts-jest', {
      // tsconfig.json を参照することを明示
      tsconfig: 'tsconfig.json',
      // isolatedModules は tsconfig.json にある場合はここには不要
      // tsconfig.json に isolatedModules: true があれば削除
      // isolatedModules: true,
    }],
    // JavaScript ファイルも Babel などで変換する必要がある場合 (プロジェクトによる)
    // '^.+\\.jsx?$': 'babel-jest',
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: [
    // テストファイルが .ts または .tsx であることを Jest に伝える
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts",
    "**/?(*.)+(spec|test).tsx"
  ],
  rootDir: './',
  // moduleNameMapper は一旦削除したままでOK (ESMでは明示的な拡張子推奨のため)

  // globals はもう不要なので削除するか、ts-jest の設定のみ残す
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.json',
  //     isolatedModules: true, // これは tsconfig.json に移動
  //   },
  // },
  // TypeScript の警告に従って tsconfig.json に 'isolatedModules': true を追加してください
  // tsconfig.json に "isolatedModules": true を追加したら、この globals.ts-jest は不要です
};

module.exports = config

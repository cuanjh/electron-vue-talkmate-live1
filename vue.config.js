// // vue.config.js
const StringReplaceWebpackPlugin = require('string-replace-webpack-plugin');
// const os = require('os');
// console.log('process.argv:', process.argv);
// console.log('\n\n');

// function getArgvToObject() {
//   let cmdArgvs = process.argv;
//   let param = {};
//   let key = '';
//   let tmp = [];
//   for (let i = 0; i < cmdArgvs.length; i++) {
//     if (/^--[\w\d_-]+/g.test(cmdArgvs[i])) {
//       tmp = cmdArgvs[i].replace('--', '').split('=');
//       key = tmp[0].toUpperCase();
//       param[key] = tmp[1];
//     }
//   }
//   console.log('getArgvToObject param: ', param);
//   return param;
// }

// let param = getArgvToObject();

// if (!param.TRTC_ENV) {
//   param.TRTC_ENV = 'development';
// }

// if (!param.TRTC_ENV || !['production', 'development'].includes(param.TRTC_ENV)) {
//   console.log('TRTC_ENV set default: development');
//   param.TRTC_ENV = 'development';
// }

// if (!param.TARGET_PLATFORM || !['darwin', 'win32'].includes(param.TARGET_PLATFORM)) {
//   console.log(`TARGET_PLATFORM set default: ${os.platform()}`);
//   param.TARGET_PLATFORM = os.platform();
// }

// console.log('param:', param);
let rewritePath = './node_modules/trtc-electron-sdk/build/Release';
if (process.env.NODE_ENV === 'production') {
  if (process.platform === 'win32') {
    rewritePath = './resources';
  } else {
    rewritePath = '../Resources';
  }
}

const vueCliConfig = {
  publicPath: './',
  configureWebpack: {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.node$/,
          loader: 'native-ext-loader',
          options: {
            emit: true,
            rewritePath,
          },
        },
      ],
    },
    plugins: [new StringReplaceWebpackPlugin()],
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.talkmate.app',
        productName: 'talkmate_live', // 项目名，也是生成的安装文件名，即talkmate_live.exe
        copyright: 'Copyright © 2020', // 版权信息
        extraResources: {
          from: './resources',
          to: './',
        },
        //   directories: {
        //     output: './dist' //输出文件路径
        //   },
        // files: ['dist_electron/**/*', '!node_modules'],
        win: {
          // win相关配置
          // icon: './shanqis.ico', //图标，当前图标在根目录下，注意这里有两个坑
          // target: [
          //   {
          //     target: 'nsis', //利用nsis制作安装程序
          //     arch: [
          //       'x64', //64位
          //       'ia32' //32位
          //     ]
          //   }
          // ],
          extraFiles: [
            {
              from: 'node_modules/trtc-electron-sdk/build/Release',
              to: './resources',
              filter: ['**/*'],
            },
          ],
        },
        mac: {
          extraFiles: [
            {
              from: 'node_modules/trtc-electron-sdk/build/Release/trtc_electron_sdk.node',
              to: './Resources',
            },
          ],
        },
      },
    },
  },
};

module.exports = vueCliConfig;

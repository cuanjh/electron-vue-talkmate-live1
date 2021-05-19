const config = {
  appKey: 'talkmateVersion',
  appSecret: 'E6DAC3DC3514681FC922ECE1B0CF06EB',
  apiDomain: 'http://dev.api.talkmate.com',
  uploadDomain: 'https://uploadfile1.talkmate.com/',
  ryAppkey: 'qf3d5gbjqhonh',
};

const dev = false;

if (dev === true) {
  config.appSecret = '5EAE76C6323C85D2E35D4817020D84C9';
  config.apiDomain = 'https://api.talkmate.com';
  config.ryAppkey = 'sfci50a7s89ki';
}

export default config;

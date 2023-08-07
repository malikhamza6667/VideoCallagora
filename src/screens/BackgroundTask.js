import BackgroundTask from 'react-native-background-task';
import AgoraRtcEngine from 'react-native-agora';

BackgroundTask.define(async () => {
  AgoraRtcEngine.keepAlive();
  BackgroundTask.finish();
});

export default BackgroundTask;
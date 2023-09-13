import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useState} from 'react'
import { MediaStream, RTCView } from 'react-native-webrtc';
import Button from './Button';

interface Props {
  hangup: () => void;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
}

const ButtonContainer = (props: Props) => {
     return (
       <View style={styles.bContainer}>
         <Button
           backGroundColor="red"
           content="end call"
           onPress={props.hangup}
         />
       </View>
     );
}

const Video = (props: Props) => {
     console.log('video remoteStream', props.remoteStream);

    const [remoteStream, setRemoteStream] = useState<any>(null);



    useEffect(() => {
                    console.log('props.remoteStream in use', props.remoteStream);

        if(props.remoteStream) {
            setRemoteStream(props.remoteStream);
        }
    }, [props.remoteStream]);
    

    
  return (
    <View style={styles.container}>
      {props?.localStream && (
        <RTCView
          streamURL={props?.localStream.toURL()}
          objectFit="cover"
          style={styles.videoLocal}
        />
      )}

      {remoteStream && (
        <RTCView
          streamURL={remoteStream?.toURL()}
          objectFit="cover"
          style={styles.videoRemote}
        />
      )}
      <ButtonContainer hangup={props.hangup} />
    </View>
  );
}

export default Video

const styles = StyleSheet.create({
  bContainer: {
    flexDirection: 'row',
    bottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoLocal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 150,
    elevation: 10,
  },
  videoRemote: {
    width: 300,
    height: 300,
  },
});
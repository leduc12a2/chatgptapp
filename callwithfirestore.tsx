import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import GettingCall from './components/GettingCall';
import Video from './components/Video';
import Button from './components/Button';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import Utils from './components/Utils';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

function generateRandomSixDigitNumber() {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return randomNumber.toString().padStart(6, '0');
}

let peerConstraints = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

const App = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [calleeId, setCalleeId] = useState<number>();
  const [gettingCall, setGettingCall] = useState(false);

  const peerConnection = useRef<RTCPeerConnection>();
  const connecting = useRef<boolean>();
  const numId = useRef<any>(generateRandomSixDigitNumber());

  useEffect(() => {
    const cRef = firestore().collection('meet').doc('chatId');

    const subscribe = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();

      //On answer start the call

      if (
        peerConnection.current &&
        !peerConnection.current.remoteDescription &&
        data &&
        data.answer
      ) {
        console.log('run 123', data.answer);
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
      }

      //if there is offer for chatId set the getting call flag

      if (data && data.offer && !connecting.current) {
        setGettingCall(true);
      }
    });

    const subscribeDelete = cRef.collection('remote').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'removed') {
          hangup();
        }
      });
    });
    //unsub
    return () => {
      subscribe();
      subscribeDelete();
    };
  }, []);

  const setupWebRTC = async () => {
    peerConnection.current = new RTCPeerConnection({peerConstraints});

    //Get the audio and video stream for the call (local)

    const stream = await Utils.getStream();
    if (stream) {
      setLocalStream(stream);
      stream
        .getTracks()
        .forEach(
          track =>
            peerConnection.current &&
            peerConnection.current.addTrack(track, stream),
        );
    }

    // Get the remote stream it is available
    console.log('addEventListener track');
    peerConnection.current.addEventListener('track', (event: any) => {
      // Grab the remote track from the connected participant.
      console.log('caller', JSON.stringify(event));

      let remoteMediaStream = new MediaStream(undefined);
      remoteMediaStream.addTrack(event.track);
      console.log('event.track', event.track);
      setRemoteStream(remoteMediaStream);
    });
  };
  const create = async () => {
    console.log('Create Calling');
    connecting.current = true;

    await setupWebRTC();

    //Document for the call

    const cRef = firestore().collection('meet').doc(numId.current);

    //Exchange the ICE candidates between the caller and callee

    collectIceCandidated(cRef, 'local', 'remote');

    if (peerConnection.current) {
      //create the offer for the call
      //Store the offer under the document

      const offer = await peerConnection.current.createOffer(null);
      peerConnection.current.setLocalDescription(offer);

      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };

      cRef.set(cWithOffer);
    }
  };
  const join = async () => {
    console.log('Joining the call');
    connecting.current = true;

    setGettingCall(false);

    const cRef = firestore().collection('meet').doc('chatId');
    const offer = (await cRef.get()).data()?.offer;

    console.log('click join');

    if (offer) {
      //setupWebrtc
      await setupWebRTC();

      //Exchange ICECandidate
      //Check the parameter, it reversed. Since the joining part is callee

      collectIceCandidated(cRef, 'remote', 'local');

      if (peerConnection.current) {
        peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(offer),
        );

        //Create the answer for the call
        //Update the document with answer

        const answer = await peerConnection.current.createAnswer();
        peerConnection.current.setLocalDescription(answer);

        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };

        cRef.update(cWithAnswer);
      }
    }
  };
  const hangup = async () => {
    console.log('Hangup');

    setGettingCall(false);

    connecting.current = false;

    streamCleanUp();
    firestoreCleanUp();
    if (peerConnection.current) {
      peerConnection.current.close();
    }
  };

  // Helper function
  const collectIceCandidated = async (
    cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    localName: string,
    remoteName: string,
  ) => {
    const candidateCollection = cRef.collection(localName);

    if (peerConnection.current) {
      //On New ICE Candidate add it to firestore
      peerConnection.current.addEventListener('icecandidate', (event: any) => {
        if (!event.candidate) {
          return;
        }
        console.log('event.candidate', event.candidate);
        candidateCollection.add(event.candidate);
      });
    }

    //Get the ICE Candidate to firestore and update the local PC
    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot?.docChanges().forEach(change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  const firestoreCleanUp = async () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  const streamCleanUp = async () => {
    const cRef = firestore().collection('meet').doc('chatId');

    if (cRef) {
      const calleeCandidate = await cRef.collection('remote').get();
      calleeCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });

      cRef.delete();
    }
  };

  //Display the gettingCall
  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} />;
  }

  //Display local streaming on calling

  if (localStream) {
    return (
      <Video
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream}
      />
    );
  }

  //Display the button call
  return (
    <View style={styles.container}>
      <View
        style={{
          width: '80%',
          height: 100,
          backgroundColor: 'white',
          margin: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: 'blue',
            fontSize: 20,
            fontWeight: 'bold',
          }}>{`Your Id: ${numId.current}`}</Text>
      </View>
      <View
        style={{
          width: '80%',
          backgroundColor: 'white',
          margin: 20,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
        }}>
        <TextInput
          placeholderTextColor={'blue'}
          keyboardType="numeric"
          style={{
            color: 'blue',
            fontWeight: 'bold',
          }}
          placeholder="Enter callee id"
          onChangeText={() => setCalleeId}
        />
      </View>
      <Button
        backGroundColor="gray"
        onPress={create}
        content="create call or join call"
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

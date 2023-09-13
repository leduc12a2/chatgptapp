import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  mediaDevices,
  RTCView,
  RTCPeerConnection,
  RTCSessionDescription,
  MediaStream,
} from 'react-native-webrtc';

import Config from 'react-native-config';

console.log(Config.APP_NAME)

let peerConstraints = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

const App = () => {
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>();
  const [offer, setOffer] = useState<any>(null);
  const [answer, setAnswer] = useState<any>(null);

  const peerConnection: any = useRef(new RTCPeerConnection(peerConstraints));

  useEffect(() => {}, []);

  const createOffer = async () => {
    let sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true,
      },
    };
    const offer = await peerConnection.current.createOffer(sessionConstraints);
    console.log('offer', JSON.stringify(new RTCSessionDescription(offer)));
    await peerConnection.current.setLocalDescription(offer);
  };

  const createAnswer = async () => {
    console.log('peerConnection', peerConnection);
    //  let offer = JSON.parse({
    //    type: 'offer',
    //    sdp: 'v=0\r\no=- 402083301967979499 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS e4690a16-0372-4625-9ef8-9d1b88aa3089\r\nm=video 49321 UDP/TLS/RTP/SAVPF 96 97 102 103 104 105 106 107 108 109 127 125 39 40 45 46 98 99 100 101 112 113 116 117 118\r\nc=IN IP4 192.168.1.83\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=candidate:1739216763 1 udp 2122194687 192.168.1.83 49321 typ host generation 0 network-id 1 network-cost 10\r\na=candidate:3578901342 1 udp 2122262783 2405:4802:90d1:b4f0:45a1:8f98:65d2:5b08 52066 typ host generation 0 network-id 2 network-cost 10\r\na=candidate:426096099 1 tcp 1518214911 192.168.1.83 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\na=candidate:2879279558 1 tcp 1518283007 2405:4802:90d1:b4f0:45a1:8f98:65d2:5b08 9 typ host tcptype active generation 0 network-id 2 network-cost 10\r\na=ice-ufrag:6WEi\r\na=ice-pwd:Us8+eIjzyBPMpoVnPZzCaKc2\r\na=ice-options:trickle\r\na=fingerprint:sha-256 A0:D7:61:56:0A:C7:12:B9:2E:1C:53:58:1A:AC:67:3D:09:D0:DC:20:67:4D:AC:08:F1:46:1A:D6:E0:00:A7:A7\r\na=setup:actpass\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:3 urn:3gpp:video-orientation\r\na=extmap:4 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\r\na=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:e4690a16-0372-4625-9ef8-9d1b88aa3089 99678dee-90ae-4086-8160-5589bc0c0c45\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:102 H264/90000\r\na=rtcp-fb:102 goog-remb\r\na=rtcp-fb:102 transport-cc\r\na=rtcp-fb:102 ccm fir\r\na=rtcp-fb:102 nack\r\na=rtcp-fb:102 nack pli\r\na=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\na=rtpmap:103 rtx/90000\r\na=fmtp:103 apt=102\r\na=rtpmap:104 H264/90000\r\na=rtcp-fb:104 goog-remb\r\na=rtcp-fb:104 transport-cc\r\na=rtcp-fb:104 ccm fir\r\na=rtcp-fb:104 nack\r\na=rtcp-fb:104 nack pli\r\na=fmtp:104 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\na=rtpmap:105 rtx/90000\r\na=fmtp:105 apt=104\r\na=rtpmap:106 H264/90000\r\na=rtcp-fb:106 goog-remb\r\na=rtcp-fb:106 transport-cc\r\na=rtcp-fb:106 ccm fir\r\na=rtcp-fb:106 nack\r\na=rtcp-fb:106 nack pli\r\na=fmtp:106 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:107 rtx/90000\r\na=fmtp:107 apt=106\r\na=rtpmap:108 H264/90000\r\na=rtcp-fb:108 goog-remb\r\na=rtcp-fb:108 transport-cc\r\na=rtcp-fb:108 ccm fir\r\na=rtcp-fb:108 nack\r\na=rtcp-fb:108 nack pli\r\na=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\na=rtpmap:109 rtx/90000\r\na=fmtp:109 apt=108\r\na=rtpmap:127 H264/90000\r\na=rtcp-fb:127 goog-remb\r\na=rtcp-fb:127 transport-cc\r\na=rtcp-fb:127 ccm fir\r\na=rtcp-fb:127 nack\r\na=rtcp-fb:127 nack pli\r\na=fmtp:127 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f\r\na=rtpmap:125 rtx/90000\r\na=fmtp:125 apt=127\r\na=rtpmap:39 H264/90000\r\na=rtcp-fb:39 goog-remb\r\na=rtcp-fb:39 transport-cc\r\na=rtcp-fb:39 ccm fir\r\na=rtcp-fb:39 nack\r\na=rtcp-fb:39 nack pli\r\na=fmtp:39 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f\r\na=rtpmap:40 rtx/90000\r\na=fmtp:40 apt=39\r\na=rtpmap:45 AV1/90000\r\na=rtcp-fb:45 goog-remb\r\na=rtcp-fb:45 transport-cc\r\na=rtcp-fb:45 ccm fir\r\na=rtcp-fb:45 nack\r\na=rtcp-fb:45 nack pli\r\na=rtpmap:46 rtx/90000\r\na=fmtp:46 apt=45\r\na=rtpmap:98 VP9/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=fmtp:98 profile-id=0\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:100 VP9/90000\r\na=rtcp-fb:100 goog-remb\r\na=rtcp-fb:100 transport-cc\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=fmtp:100 profile-id=2\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100\r\na=rtpmap:112 H264/90000\r\na=rtcp-fb:112 goog-remb\r\na=rtcp-fb:112 transport-cc\r\na=rtcp-fb:112 ccm fir\r\na=rtcp-fb:112 nack\r\na=rtcp-fb:112 nack pli\r\na=fmtp:112 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=64001f\r\na=rtpmap:113 rtx/90000\r\na=fmtp:113 apt=112\r\na=rtpmap:116 red/90000\r\na=rtpmap:117 rtx/90000\r\na=fmtp:117 apt=116\r\na=rtpmap:118 ulpfec/90000\r\na=ssrc-group:FID 894143756 2849349731\r\na=ssrc:894143756 cname:NphUX8W24lzAzzgp\r\na=ssrc:894143756 msid:e4690a16-0372-4625-9ef8-9d1b88aa3089 99678dee-90ae-4086-8160-5589bc0c0c45\r\na=ssrc:2849349731 cname:NphUX8W24lzAzzgp\r\na=ssrc:2849349731 msid:e4690a16-0372-4625-9ef8-9d1b88aa3089 99678dee-90ae-4086-8160-5589bc0c0c45\r\n',
    //  });

    console.log('offer', offer);

    peerConnection.current.onicecandidate = async (event: any) => {
      //Event that fires off when a new answer ICE candidate is created
      if (event.candidate) {
        console.log('Adding answer candidate...:', event.candidate);
        setAnswer(peerConnection.localDescription);
      }
    };

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription({
        type: 'offer',
        sdp: 'v=0\r\no=- 8806827314483809913 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS f878bddf-a67a-4ee7-9b19-b7459540ad04\r\nm=video 24408 UDP/TLS/RTP/SAVPF 96 97 102 103 104 105 106 107 108 109 127 125 39 40 45 46 98 99 100 101 112 113 116 117 118\r\nc=IN IP4 1.54.153.219\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=candidate:4015717648 1 udp 2122194687 192.168.1.84 52112 typ host generation 0 network-id 1 network-cost 10\r\na=candidate:2562481901 1 udp 2122262783 2405:4802:9192:a7c0:b0b8:576d:62e:36fc 54576 typ host generation 0 network-id 2 network-cost 10\r\na=candidate:878304593 1 udp 1685987071 1.54.153.219 24408 typ srflx raddr 192.168.1.84 rport 52112 generation 0 network-id 1 network-cost 10\r\na=candidate:878304593 1 udp 1685987071 1.54.153.219 20869 typ srflx raddr 192.168.1.84 rport 52112 generation 0 network-id 1 network-cost 10\r\na=candidate:2442469256 1 tcp 1518214911 192.168.1.84 9 typ host tcptype active generation 0 network-id 1 network-cost 10\r\na=candidate:3866344565 1 tcp 1518283007 2405:4802:9192:a7c0:b0b8:576d:62e:36fc 9 typ host tcptype active generation 0 network-id 2 network-cost 10\r\na=candidate:878304593 1 udp 1685987071 1.54.153.219 58715 typ srflx raddr 192.168.1.84 rport 52112 generation 0 network-id 1 network-cost 10\r\na=ice-ufrag:vfln\r\na=ice-pwd:j+iRHP7SM0eOIBss7cVaCegG\r\na=ice-options:trickle\r\na=fingerprint:sha-256 3A:D4:C7:7E:5B:87:36:72:23:F2:33:54:7A:9E:AF:7C:95:F7:5D:8C:BC:14:B8:77:F1:3E:37:EF:76:A0:94:47\r\na=setup:actpass\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:3 urn:3gpp:video-orientation\r\na=extmap:4 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\r\na=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:f878bddf-a67a-4ee7-9b19-b7459540ad04 c101b0b6-b96d-4471-927f-4c9cb90164e1\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:102 H264/90000\r\na=rtcp-fb:102 goog-remb\r\na=rtcp-fb:102 transport-cc\r\na=rtcp-fb:102 ccm fir\r\na=rtcp-fb:102 nack\r\na=rtcp-fb:102 nack pli\r\na=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\na=rtpmap:103 rtx/90000\r\na=fmtp:103 apt=102\r\na=rtpmap:104 H264/90000\r\na=rtcp-fb:104 goog-remb\r\na=rtcp-fb:104 transport-cc\r\na=rtcp-fb:104 ccm fir\r\na=rtcp-fb:104 nack\r\na=rtcp-fb:104 nack pli\r\na=fmtp:104 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\na=rtpmap:105 rtx/90000\r\na=fmtp:105 apt=104\r\na=rtpmap:106 H264/90000\r\na=rtcp-fb:106 goog-remb\r\na=rtcp-fb:106 transport-cc\r\na=rtcp-fb:106 ccm fir\r\na=rtcp-fb:106 nack\r\na=rtcp-fb:106 nack pli\r\na=fmtp:106 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:107 rtx/90000\r\na=fmtp:107 apt=106\r\na=rtpmap:108 H264/90000\r\na=rtcp-fb:108 goog-remb\r\na=rtcp-fb:108 transport-cc\r\na=rtcp-fb:108 ccm fir\r\na=rtcp-fb:108 nack\r\na=rtcp-fb:108 nack pli\r\na=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\na=rtpmap:109 rtx/90000\r\na=fmtp:109 apt=108\r\na=rtpmap:127 H264/90000\r\na=rtcp-fb:127 goog-remb\r\na=rtcp-fb:127 transport-cc\r\na=rtcp-fb:127 ccm fir\r\na=rtcp-fb:127 nack\r\na=rtcp-fb:127 nack pli\r\na=fmtp:127 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f\r\na=rtpmap:125 rtx/90000\r\na=fmtp:125 apt=127\r\na=rtpmap:39 H264/90000\r\na=rtcp-fb:39 goog-remb\r\na=rtcp-fb:39 transport-cc\r\na=rtcp-fb:39 ccm fir\r\na=rtcp-fb:39 nack\r\na=rtcp-fb:39 nack pli\r\na=fmtp:39 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f\r\na=rtpmap:40 rtx/90000\r\na=fmtp:40 apt=39\r\na=rtpmap:45 AV1/90000\r\na=rtcp-fb:45 goog-remb\r\na=rtcp-fb:45 transport-cc\r\na=rtcp-fb:45 ccm fir\r\na=rtcp-fb:45 nack\r\na=rtcp-fb:45 nack pli\r\na=rtpmap:46 rtx/90000\r\na=fmtp:46 apt=45\r\na=rtpmap:98 VP9/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=fmtp:98 profile-id=0\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:100 VP9/90000\r\na=rtcp-fb:100 goog-remb\r\na=rtcp-fb:100 transport-cc\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=fmtp:100 profile-id=2\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100\r\na=rtpmap:112 H264/90000\r\na=rtcp-fb:112 goog-remb\r\na=rtcp-fb:112 transport-cc\r\na=rtcp-fb:112 ccm fir\r\na=rtcp-fb:112 nack\r\na=rtcp-fb:112 nack pli\r\na=fmtp:112 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=64001f\r\na=rtpmap:113 rtx/90000\r\na=fmtp:113 apt=112\r\na=rtpmap:116 red/90000\r\na=rtpmap:117 rtx/90000\r\na=fmtp:117 apt=116\r\na=rtpmap:118 ulpfec/90000\r\na=ssrc-group:FID 215667750 1723282998\r\na=ssrc:215667750 cname:Wud2S537uc7+bW0p\r\na=ssrc:215667750 msid:f878bddf-a67a-4ee7-9b19-b7459540ad04 c101b0b6-b96d-4471-927f-4c9cb90164e1\r\na=ssrc:1723282998 cname:Wud2S537uc7+bW0p\r\na=ssrc:1723282998 msid:f878bddf-a67a-4ee7-9b19-b7459540ad04 c101b0b6-b96d-4471-927f-4c9cb90164e1\r\n',
      }),
    );

    let textAnswer = await peerConnection.current.createAnswer();
    console.log(JSON.stringify(textAnswer));
    await peerConnection.current.setLocalDescription(textAnswer);
  };

  const addAnswer = async () => {
    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(new RTCSessionDescription());
    }
  };

  useEffect(() => {
    if (!localStream) {
      (async () => {
        let getLocalStream = await mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setLocalStream(getLocalStream);
            getLocalStream
              .getTracks()
              .forEach(
                track =>
                  peerConnection.current &&
                  peerConnection.current.addTrack(track, getLocalStream),
              );
      })();

      peerConnection.current.ontrack = (event: any) => {
        console.log('run after create answer', event);
      };
    }
  }, []);

  return (
    <ScrollView style={{flex: 1, padding: 20}}>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.stream} />
      )}
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.stream} />
      )}
      <TextInput
        style={styles.textAnswer}
        placeholder="offer"
        onChangeText={setOffer}
      />
      <TouchableOpacity
        style={{
          width: 200,
          height: 50,
          borderRadius: 20,
          backgroundColor: 'blue',
        }}
        onPress={() => {
          createOffer();
        }}>
        <Text>Create Offer</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.textAnswer}
        placeholder="answer"
        onChangeText={setAnswer}
      />
      <TouchableOpacity
        style={{
          width: 200,
          height: 50,
          borderRadius: 20,
          backgroundColor: 'blue',
        }}
        onPress={() => {
          createAnswer();
        }}>
        <Text>Create Answer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 200,
          height: 50,
          borderRadius: 20,
          backgroundColor: 'blue',
          marginTop: 20,
        }}
        onPress={addAnswer}>
        <Text>Add Answer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  stream: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  textAnswer: {
    margin: 20,
    width: '100%',
    height: 50,
    backgroundColor: 'gray',
  },
});

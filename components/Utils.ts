import { mediaDevices } from "react-native-webrtc";


export default class Utils {
    static async getStream () {
        let mediaConstraints = {
	audio: false,
	video: {
		frameRate: 30,
		facingMode: 'user'
	}
};

let isVoiceOnly = false;

try {
	const mediaStream = await mediaDevices.getUserMedia( mediaConstraints );

	if ( isVoiceOnly ) {
		let videoTrack = await mediaStream.getVideoTracks()[ 0 ];
		videoTrack.enabled = false;
	};

    console.log("mediaStream",mediaStream)

    if(typeof mediaStream != "boolean") return mediaStream

    return null

} catch( err ) {
	// Handle Error
};
    }
}
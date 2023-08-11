import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import Tts from 'react-native-tts';
import Permissions, {request, PERMISSIONS} from 'react-native-permissions';
import Voice, {SpeechResultsEvent} from '@react-native-voice/voice';
import {GiftedChat} from 'react-native-gifted-chat';

const myApiKey = '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';

const App = () => {
  const [messages, setMessages] = useState<any>([]);
  const [voice, setVoice] = useState<any | never>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const status = await Permissions.request(
        Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
      );
      if (status !== 'granted') {
      } else {
      }
    })();
    setMessages([
      {
        _id: 1,
        text: 'Hello Man!',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chat GPT',
          avatar:
            'https://freebiehive.com/wp-content/uploads/2023/04/Chat-GPT-Icon-PNG.jpg',
        },
      },
    ]);
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      console.log('onSpeechResults: ', e);
      if (e.value) {
        setVoice(e.value[0]);
      }
    };
  }, []);

  useEffect(() => {
    if (voice) {
      console.log('runnnnnn');
      setLoading(true);
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${myApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            {
              role: 'user',
              content: `${voice}`,
            },
          ],
        }),
      }).then(data => {
        data.json().then(res => {
          const ress = res?.choices[0].message?.content;
          Tts.speak(ress);
          console.log('Res', res?.choices[0].message?.content);
          setMessages((previousMessages: any) =>
            GiftedChat.append(previousMessages, [
              {
                _id: messages?.length + 1,
                text: `${res?.choices[0].message?.content}`,
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'Chat GPT',
                  avatar:
                    'https://freebiehive.com/wp-content/uploads/2023/04/Chat-GPT-Icon-PNG.jpg',
                },
              },
            ]),
          );
          setLoading(false);
        });
      });
    }
  }, [voice]);

  const onSend = useCallback((messages = []) => {
    if (messages) {
      setVoice(messages[0]?.text);
    }
    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <GiftedChat
      textInputProps={{
        color: 'black',
      }}
      messages={messages}
      onSend={messages => onSend(messages as any)}
      disableComposer={loading}
      user={{
        _id: 1,
      }}
    />
  );
};

export default App;

const styles = StyleSheet.create({});

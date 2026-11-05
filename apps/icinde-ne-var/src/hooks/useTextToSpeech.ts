import { useState, useCallback, useEffect, useRef } from "react";
import * as Speech from "expo-speech";

const SPEECH_RATE = 0.9;

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      Speech.stop();
    };
  }, []);

  const speak = useCallback(
    (text: string, lang: string = "tr-TR") => {
      if (isSpeaking) {
        Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      const handleEnd = () => {
        if (isMountedRef.current) {
          setIsSpeaking(false);
        }
      };

      Speech.speak(text, {
        language: lang,
        rate: SPEECH_RATE,
        onDone: handleEnd,
        onError: handleEnd,
        onStopped: handleEnd,
      });
    },
    [isSpeaking],
  );

  const stop = useCallback(() => {
    Speech.stop();
    if (isMountedRef.current) {
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking } as const;
}

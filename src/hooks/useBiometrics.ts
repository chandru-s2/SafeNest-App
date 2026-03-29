import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const useBiometrics = () => {
  const checkCompatibility = async () => {
    const { available } = await rnBiometrics.isSensorAvailable();
    return available;
  };

  const authenticate = async (promptMessage: string) => {
    try {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage });
      return success;
    } catch (error) {
      console.error('Biometric Auth Error:', error);
      return false;
    }
  };

  const createSignature = async (promptMessage: string, payload: string) => {
    try {
      const { success, signature } = await rnBiometrics.createSignature({
        promptMessage,
        payload,
      });
      return { success, signature };
    } catch (error) {
      console.error('Biometric Signature Error:', error);
      return { success: false };
    }
  };

  return { checkCompatibility, authenticate, createSignature };
};

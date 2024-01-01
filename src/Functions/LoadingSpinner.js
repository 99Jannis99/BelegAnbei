import {NativeModules} from 'react-native';
const { Spinner } = NativeModules;

const ShowSpinner = () => {
  Spinner.show()
}

const HideSpinner = () => {
  Spinner.hide()
}

export { ShowSpinner, HideSpinner };

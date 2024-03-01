import axios from 'axios';
//import { staticConfigs } from './utils/configs';
import Config from "react-native-config";

let baseURL = Config.BASE_URL + '/hapsync-backend/'


const instance = axios.create({
    baseURL,
})

export default instance;
import { Manager } from 'socket.io-client';
import backendUrl from '../config/apiAddress';

const manager = new Manager(backendUrl)
manager.reconnectionAttempts(3)
export const socket = manager.socket('/');

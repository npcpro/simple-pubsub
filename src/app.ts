import express from 'express';
import http from 'node:http';

import { 
  createMachine, 
  deleteMachine, 
  getMachineById, 
  getAllMachines,
  subscribe, 
  unsubscribe, 
  publish,
  getAllSubscribers 
} from './controller';

const app = express();
app.use(express.json());

// Machine routes
app.post('/machine', createMachine);
app.delete('/machine/:id', deleteMachine);
app.get('/machine/:id', getMachineById);
app.get('/machine', getAllMachines);

// PubSub routes
app.get('/pubsub', getAllSubscribers);
app.post('/pubsub/publish', publish);
app.post('/pubsub/subscribe', subscribe);
app.post('/pubsub/unsubscribe', unsubscribe);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

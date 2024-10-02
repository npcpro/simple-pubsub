import { Request, Response } from 'express';
import { 
  MachineRepository, 
  PublishSubscribeService, 
  Machine, 
  MachineSubscriber,
  MachineEvent
} from './pubsub-service';

const machineRepository = new MachineRepository([new Machine('001'), new Machine('002'), new Machine('003')]);
const machineSubscriber = new MachineSubscriber(machineRepository);
const pubSubService = new PublishSubscribeService(machineSubscriber);
export const createMachine = (req: Request, res: Response) => {
  const { id } = req.body;
  const existingMachine = machineRepository.getMachineById(id);
  
  if (existingMachine) {
    res.status(400).send('Machine already exists');
  } else {
    const machine = new Machine(id);
    machineRepository.saveMachine(machine);
    res.status(201).send(machine);
  }

};

export const deleteMachine = (req: Request, res: Response) => {
  const { id } = req.params;
  const machine = machineRepository.getMachineById(id);

  if (!machine) {
    res.status(404).send('Machine not found');
  } else {
    machineRepository.deleteMachine(id);
    res.status(200).send(`Machine with id ${id} deleted.`);
  }

};

export const getMachineById = (req: Request, res: Response) => {
  const { id } = req.params;
  const machine = machineRepository.getMachineById(id);

  if (!machine) {
    res.status(404).send('Machine not found');
  } else {
    res.status(200).send(machine);
  }

};

export const getAllMachines = (_: Request, res: Response) => {
  const machines = machineRepository.getAllMachines();
  res.status(200).send(machines);
};


export const publish = (req: Request, res: Response) => {
  try {
    const {machineId, type, qty} = req.body;
    const event = new MachineEvent(machineId, type, qty)
    const subscriber = pubSubService.getSubscriberById(machineId);
    
    if (!subscriber) {
      res.status(404).send('Machine Subscriber not found');
    } else {
      pubSubService.publish(event);
      res.status(201).send(`Publishing event of type "${event.type()}" for machine ID: ${event.machineId()} Qty: ${event.getQty()}`);
    }
  } catch (error) {
    console.log(error,'error');
    
    res.status(500).send(error);
  }


};

export const subscribe = (req: Request, res: Response) => {
  try {
    const { machineId } = req.body;
    const machine = machineRepository.getMachineById(machineId);
    const subscriber = pubSubService.getSubscriberById(machineId);
    if (!machine) {
        res.status(404).send('Machine not found');
    } else if (subscriber) {
        res.status(400).send(`Machine ${machineId} already subscribed.`);
    } else {
        pubSubService.subscribe(machineId);
        res.status(201).send(`Machine ${machineId} subscribed successfully.`);
    }
  } catch (error) {
    console.log(error,'error');
    
    res.status(500).send(error);
  }
};


export const unsubscribe = (req: Request, res: Response) => {
  try {
    const { machineId } = req.body;
    const machine = pubSubService.getSubscriberById(machineId);
    if (!machine) {
      res.status(404).send('Machine Subscriber not found');
    } else {
      pubSubService.unsubscribe(machineId);
      res.status(201).send(`Machine ${machineId} unsubscribed successfully.`);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllSubscribers = (req: Request, res: Response) => {
  const pubSubService = new PublishSubscribeService(machineSubscriber);
  res.status(200).send(pubSubService.getAllSubscribers());
};


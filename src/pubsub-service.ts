export interface IEvent {
  type(): string;
  machineId(): string;
}

export interface ISubscriber {
  handle(event: IEvent): void;
}

export interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  unsubscribe(type: string, handler: ISubscriber): void;
}

export class Machine {
  public stockLevel: number = 10;
  public id: string;
  public lowStockWarningFired: boolean = false;
  public stockLevelOkFired: boolean = false;

  constructor(id: string) {
    this.id = id;
  }
}


export class MachineRepository {
  private machines: Machine[];

  constructor(machines: Machine[]) {
    this.machines = machines;
  }

  getMachineById(id: string): Machine | null {
    return this.machines.find(machine => machine.id === id) || null;
  }

  saveMachine(machine: Machine): void {
    const index = this.machines.findIndex(m => m.id === machine.id);
    if (index > -1) {
      this.machines[index] = machine;
    } else {
      this.machines.push(machine);
    }
  }

  deleteMachine(id: string): void {
    const machineIndex = this.machines.findIndex(m => m.id === id);
    if (machineIndex > -1) {
      this.machines.splice(machineIndex, 1);
      console.log(`Machine with id ${id} has been deleted.`);
    } else {
      console.log(`Machine with id ${id} not found.`);
    }
  }

  getAllMachines(): Machine[] {
    return this.machines;
  }
}

export class MachineEvent implements IEvent {
  constructor(private readonly _machineId: string, private readonly _type: string, private readonly _qty: number) {}

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return this._type;
  }

  getQty(): number {
    return this._qty;
  }
}

export class LowStockWarningEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return 'LowStockWarningEvent';
  }
}

export class StockLevelOkEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return 'StockLevelOkEvent ';
  }
}


export class StockWarningSubscriber implements ISubscriber {
  handle(event: IEvent): void {
    if (event.type() === 'LowStockWarningEvent ') {
      console.log(`Low stock warning for machine ${event.machineId()}`);
    } else if (event.type() === 'StockLevelOkEvent ') {
      console.log(`Stock level OK for machine ${event.machineId()}`);
    }
  }
}

export class MachineSubscriber implements ISubscriber {

  private machines: Machine[] = [];
  constructor(
      private machineRepository: MachineRepository,
    ) {}

  handle(event: MachineEvent): void {
    const machine = this.machines.find((m) => m.id === event.machineId());

    if (!machine) {
      console.log('Machine not found.');
      return;
    }

    if (event.type() === 'sale') {
      machine.stockLevel -= machine.stockLevel > 0 ? event.getQty() : 0;
      console.log(`Machine with ID: ${machine.id} performed a sale. New stock level: ${machine.stockLevel}`);

      if (machine.stockLevel < 3 && !machine.lowStockWarningFired) {
        console.log(`Warning: Low stock for machine with ID: ${machine.id}`);
        machine.lowStockWarningFired = true;
        machine.stockLevelOkFired = false;
      }
    } else if (event.type() === 'refill') {
      machine.stockLevel += event.getQty();
      console.log(`Machine with ID: ${machine.id} performed a refill. New stock level: ${machine.stockLevel}`);

      if (machine.stockLevel >= 3 && !machine.stockLevelOkFired) {
        console.log(`Stock level OK for machine with ID: ${machine.id}`);
        machine.stockLevelOkFired = true;
        machine.lowStockWarningFired = false;
      }
    } else {
      console.log(`Unknown event type: ${event.type()}`);
    }
  }

  subscribe(machineId: string): void {
    const machineIndex = this.machines.findIndex(m => m.id === machineId);
    const machine = this.machineRepository.getMachineById(machineId);
    
    if (machineIndex > -1) {
      console.log('This machine has already subscribed.');
    } else {
      this.machines.push(machine);
      console.log(`Machine with ID: ${machineId} has subscribed.`);
    }

  }

  unsubscribe(machineId: string): void {
    const machineIndex = this.machines.findIndex(m => m.id === machineId);
    if (machineIndex > -1) {
      this.machines.splice(machineIndex, 1);
      console.log(`Machine with ID ${machineId} has been deleted.`);
    } else {
      console.log(`Machine with ID ${machineId} not found.`);
    }
  }

  getAllMachineSubscribers(): Machine[] {
    return this.machines;
  }

  getMachineSubscriberById(machineId: string): Machine {
    return this.machines.find(m => m.id === machineId);
  }
  
}


export class PublishSubscribeService implements IPublishSubscribeService {
  constructor(private machineSubscriber: MachineSubscriber) {}

  subscribe(machineId: string): void {
    this.machineSubscriber.subscribe(machineId);
  }

  unsubscribe(machineId: string): void {
    this.machineSubscriber.unsubscribe(machineId);
  }

  publish(event: MachineEvent): void {
    this.machineSubscriber.handle(event);
  }

  getAllSubscribers(): Machine[] {
    return this.machineSubscriber.getAllMachineSubscribers() || [];
  }

  getSubscriberById(machineId: string): Machine {
    return this.machineSubscriber.getMachineSubscriberById(machineId);
  }
}

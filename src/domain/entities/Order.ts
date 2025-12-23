import { OrderState } from "../value-objects/OrderState";
import { OrderStatus } from "../value-objects/OrderStatus";
import { Service } from "./Service";

export class Order {
	constructor(
		public lab: string,
		public patient: string,
		public customer: string,
		public state: OrderState,
		public status: OrderStatus,
		public services: Service[],
	) {
		this.validateServices();
	}

	private validateServices(): void {
		if (!this.services || this.services.length === 0) {
			throw new Error("Order must have at least one service");
		}

		const totalValue = this.services.reduce(
			(acc, service) => acc + service.value,
			0,
		);

		if (totalValue <= 0) {
			throw new Error("Order total value must be greater than zero");
		}
	}

	public advanceState(): void {
		const nextStateMap: Record<OrderState, OrderState | null> = {
			CREATED: "ANALYSIS",
			ANALYSIS: "COMPLETED",
			COMPLETED: null,
		};

		const nextState = nextStateMap[this.state];

		if (!nextState) {
			throw new Error(`Cannot advance order state from ${this.state}`);
		}

		this.state = nextState;
	}
}

export interface CreateOrderArgs {
    userId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}

export interface GetOrderListArgs {
    id: string
}
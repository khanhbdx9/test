import { QueryOrderListBaseDto } from './query-order-list.base.dto';
export declare const ORDER_HISTORY_STATUSES: readonly ["REJECTED", "COMPLETED"];
export type OrderHistoryStatus = (typeof ORDER_HISTORY_STATUSES)[number];
export declare class QueryOrderHistoryDto extends QueryOrderListBaseDto {
    status?: OrderHistoryStatus[];
}

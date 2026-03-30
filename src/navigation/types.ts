export type MainStackParamList = {
  Home: undefined;
  SendMoney: {
    prefillPhone?: string;
    prefillName?: string;
    prefillUserId?: string;
  } | undefined;
  StripePayment: {
    recipientPhone: string;
    amount: string;
    recipientName: string;
  };
  ReceiveMoney: undefined;
  QRScanner: undefined;
  Transactions: undefined;
};

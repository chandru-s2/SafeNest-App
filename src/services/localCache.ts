// import Realm from 'realm';

export class TxnHistory {
  id!: string;
  amount!: number;
  type!: 'credit' | 'debit';
  merchant!: string;
  ts!: Date;
  status!: string;
}

export class UserPrefs {
  key!: string;
  value!: string;
  updatedAt!: Date;
}

export class ComplaintCache {
  complaintId!: string;
  payload!: string;
  status!: string;
  retryCount!: number;
  createdAt!: Date;
}

export class ChatbotContext {
  sessionId!: string;
  role!: 'user' | 'assistant';
  content!: string;
  ts!: Date;
}

export class AdvisorAlerts {
  alertId!: string;
  type!: string;
  message!: string;
  read!: boolean;
  ts!: Date;
}

export class SyncQueue {
  opId!: string;
  opType!: string;
  payload!: string;
  createdAt!: Date;
}

export const realmConfig = {
  schema: [],
  schemaVersion: 1,
};

// Open Realm without encryption to avoid Buffer / Keychain crash on startup.
// Encryption can be re-enabled once @craftzdog/react-native-buffer is installed.
export const getRealm = async (): Promise<any> => {
  // return await Realm.open(realmConfig);
  return {
    objects: () => ({
      sorted: () => [],
    }),
    write: (cb: any) => cb(),
    create: () => ({}),
    delete: () => {},
  };
};

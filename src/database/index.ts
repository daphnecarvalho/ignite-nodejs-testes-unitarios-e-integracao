import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: "172.21.0.2",
      database: process.env.NODE_ENV == 'test' ? 'fin_api_test' : 'fin_api',
    }),
  );
};

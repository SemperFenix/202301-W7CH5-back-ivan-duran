export interface Repo<T> {
  query(): Promise<T[]>;
  advancedQuery?(): Promise<T[]>;
  queryById(_id: string): Promise<T>;
  advancedQueryById?(_id: string): Promise<T>;
  search(_query: { key: string; value: unknown }[]): Promise<T[]>;
  create(_entity: Partial<T>): Promise<T>;
  update(_entity: Partial<T>): Promise<T>;
  erase(_id: string): Promise<void>;
}

// Aunque en el proyecto usaremos sólo un repo, dejo el interfaz hecho por si a futuro quisiéramos ampliar (Open-closed)
